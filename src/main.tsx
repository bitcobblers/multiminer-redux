import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { enableMonitors } from './services/MonitorService';
import { enableDataService } from './services/DataService';
import { enableSettingsWatchers } from './services/SettingsService';
import { syncMinerReleases } from './services/DownloadManager';
import { enableMinerOutputListener } from './services/MinerService';
import { initializeMinerManager } from './services/MinerManager';

window.addEventListener('load', () => {
  initializeMinerManager();
  enableMonitors();
  enableDataService();
  enableSettingsWatchers();
  enableMinerOutputListener();
  syncMinerReleases();
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
