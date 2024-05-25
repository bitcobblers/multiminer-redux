import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { enableMonitors } from './services/MonitorService';
import { enableDataService } from './services/DataService';
import { enableSettingsWatchers } from './services/SettingsService';
import { syncMinerReleases } from './services/DownloadManager';

window.addEventListener('load', () => {
  enableMonitors();
  enableDataService();
  enableSettingsWatchers();
  syncMinerReleases();
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
