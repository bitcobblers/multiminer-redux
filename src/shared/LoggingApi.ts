export interface LoggingApi {
  openLogFolder: () => Promise<void>;
}

export const loggingApi = {
  openLogFolder: () => Promise.resolve(),
};
