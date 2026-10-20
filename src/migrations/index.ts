import * as migration_20261020_184924_inicial from './20261020_184924_inicial';

export const migrations = [
  {
    up: migration_20261020_184924_inicial.up,
    down: migration_20261020_184924_inicial.down,
    name: '20261020_184924_inicial'
  },
];
