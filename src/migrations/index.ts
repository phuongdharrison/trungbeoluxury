import * as migration_20261026_185949_initial_cms from './20261026_185949_initial_cms';
import * as migration_20261027_000734_category_albums from './20261027_000734_category_albums';

export const migrations = [
  {
    up: migration_20261026_185949_initial_cms.up,
    down: migration_20261026_185949_initial_cms.down,
    name: '20261026_185949_initial_cms',
  },
  {
    up: migration_20261027_000734_category_albums.up,
    down: migration_20261027_000734_category_albums.down,
    name: '20261027_000734_category_albums'
  },
];
