import { debug, warn, error } from 'tauri-plugin-log-api';
import { fetch } from '@tauri-apps/api/http';
import { AVAILABLE_MINERS, MinerRelease, addAppNotice } from '../models';
import { downloadApi } from '../shared/DownloadApi';
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

export async function syncMinerReleases() {
  const miners = await Promise.all(
    AVAILABLE_MINERS.map(async (info) => {
      const releases = await getReleases(info.owner, info.repo);

      if (!releases) {
        warn(`Unable to fetch releases for ${info.owner}/${info.repo}`);
        return null;
      }

      debug(`Found ${releases.length} releases for ${info.owner}/${info.repo}`);

      return {
        name: info.name,
        versions: releases
          .map((release) => ({
            tag: release.tag_name,
            published: release.published_at,
            url:
              release.assets.find((x) => info.assetPattern.test(x.name))?.browser_download_url ??
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

export async function downloadMiner(name: string, version: string) {
  const miner = (await getMinerReleases()).find((m) => m.name === name);
  const url = miner?.versions.find((r) => r.tag === version)?.url;

  if (url !== undefined) {
    return downloadApi.downloadMiner(name, version, url);
  }

  addAppNotice(
    'error',
    `Unable to download miner '${name}': URL for version ${version} not found.`,
  );
  return false;
}
