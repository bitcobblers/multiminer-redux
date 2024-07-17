import { debug, info, warn, error } from 'tauri-plugin-log-api';
import { fetch } from '@tauri-apps/api/http';
import { appLocalDataDir, downloadDir, join } from '@tauri-apps/api/path';
import { fs, invoke } from '@tauri-apps/api';
import { AVAILABLE_MINERS, MinerName, MinerRelease, addAppNotice, downloadState$ } from '../models';
import { getMinerReleases, setMinerReleases } from './SettingsService';

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type MinerReleaseData = {
  tag_name: string;
  published_at: Date;
  assets: Array<ReleaseAsset>;
};

async function getReleases(owner: string, repo: string): Promise<MinerReleaseData[] | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

  try {
    debug(`Fetching releases for ${url}`);
    const response = await fetch<MinerReleaseData[]>(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Tauri',
      },
    });

    if (response.ok) {
      return response.data;
    }

    warn(`Failed to fetch releases for ${owner}/${repo}: ${response.status}`);
  } catch (e) {
    let message;

    if (e instanceof Error) {
      message = e.message;
    } else {
      message = String(e);
    }

    error(message);
  }

  return null;
}

async function downloadMiner(name: MinerName, version: string, url: string, savePath: string) {
  info(`Downloading ${name} version ${version} from ${url} to ${savePath}`);

  const result = await invoke('download_file', { url, savePath })
    .then(() => true)
    .catch((e) => {
      addAppNotice('error', e);
      return false;
    });

  return result;
}

async function extractZip(path: string, savePath: string) {
  info(`Extracting ${path} to ${savePath}`);

  const result = await invoke('extract_zip', { path, savePath })
    .then(() => true)
    .catch((e) => {
      addAppNotice('error', e);
      return false;
    });

  return result;
}

async function arrangeMinerFiles(path: string) {
  info('Arranging miner files');

  const result = await invoke('arrange_miner_files', { path })
    .then(() => true)
    .catch((e) => {
      addAppNotice('error', e);
      return false;
    });

  return result;
}

export async function syncMinerReleases() {
  const currentMinerReleases = await getMinerReleases();

  if (currentMinerReleases.length > 0) {
    info('Using cached miner releases.');
    return;
  }

  const miners = await Promise.all(
    AVAILABLE_MINERS.map(async (desc) => {
      const releases = await getReleases(desc.owner, desc.repo);

      if (!releases) {
        warn(`Unable to fetch releases for ${desc.owner}/${desc.repo}`);
        return null;
      }

      debug(`Found ${releases.length} releases for ${desc.owner}/${desc.repo}`);

      return {
        name: desc.name,
        versions: releases
          .map((release) => ({
            tag: release.tag_name,
            published: release.published_at,
            url:
              release.assets.find((x) => desc.assetPattern.test(x.name))?.browser_download_url ??
              '',
          }))
          .filter((x) => x.url !== ''),
      } as MinerRelease;
    }),
  );

  const allMiners = miners.filter((miner) => miner !== null) as MinerRelease[];

  if (allMiners.length > 0) {
    await setMinerReleases(allMiners);
  }
}

export async function ensureMiner(name: MinerName, version: string, verbose?: boolean) {
  const miner = (await getMinerReleases()).find((m) => m.name === name);
  const { exe } = AVAILABLE_MINERS.find((m) => m.name === name)!;
  const url = miner?.versions.find((r) => r.tag === version)?.url;
  const downloadFolder = await downloadDir();
  const localFolder = await appLocalDataDir();
  const savePath = await join(downloadFolder, `${name}-${version}.zip`);
  const installFolder = await join(localFolder, 'miners', name, version);
  const installExe = await join(installFolder, exe);

  try {
    downloadState$.next(true);

    if (await fs.exists(installExe)) {
      info(`Miner ${name} version ${version} already installed.`);

      if (verbose) {
        addAppNotice('info', `Miner ${name} version ${version} already installed.`);
      }

      return true;
    }

    if (!url) {
      addAppNotice(
        'error',
        `Unable to download miner '${name}': URL for version ${version} not found.`,
      );

      return false;
    }

    addAppNotice('info', `Installing ${name} ${version}.`);

    info('Cleaning installation path');
    if (await fs.exists(installFolder)) {
      await fs.removeDir(installFolder, {
        recursive: true,
      });
    }

    if (!(await downloadMiner(name, version, url, savePath))) {
      return false;
    }

    info('Installing miner');

    if (!(await extractZip(savePath, installFolder))) {
      return false;
    }

    await arrangeMinerFiles(installFolder);
    info('Installation complete.');
    return true;
  } finally {
    downloadState$.next(false);
  }
}
