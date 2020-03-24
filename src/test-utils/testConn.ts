import { createConnection, Connection } from 'typeorm';
export const testConn = (drop = false): Promise<Connection> => {
  return createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'myuser',
    password: 'arch',
    database: 'mydb',
    synchronize: drop,
    dropSchema: drop,
    entities: ['src/entity/*.*'],
  });
};
