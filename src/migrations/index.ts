import * as migration_20261026_185949_initial_cms from './20261026_185949_initial_cms';

export const migrations = [
  {
    up: migration_20261026_185949_initial_cms.up,
    down: migration_20261026_185949_initial_cms.down,
    name: '20261026_185949_initial_cms'
  },
];
