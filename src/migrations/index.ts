import * as migration_20261020_184924_inicial from './20261020_184924_inicial';
import * as migration_20261020_212354_blob_objectkey from './20261020_212354_blob_objectkey';

export const migrations = [
  {
    up: migration_20261020_184924_inicial.up,
    down: migration_20261020_184924_inicial.down,
    name: '20261020_184924_inicial',
  },
  {
    up: migration_20261020_212354_blob_objectkey.up,
    down: migration_20261020_212354_blob_objectkey.down,
    name: '20261020_212354_blob_objectkey'
  },
];
