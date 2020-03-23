import { ConfirmUserResolver } from './modules/user/ConfirmUser';
import { MeResolver } from './modules/user/Me';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { RegisterResolver } from './modules/user/Register';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/Login';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    authChecker: ({ context: { req } }) => {
      if (req.session.userId) {
        return true;
      }

      return false;
    },
    resolvers: [`${__dirname}/modules/**/*.ts`],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({
      req,
    }),
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redis,
      }),
      name: 'qid',
      secret: 'alfncjnfjexmcfnvkcoi434',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
      },
    })
  );

  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Listening affectionately on localhost:${4000}/graphql`);
  });
};

main();
