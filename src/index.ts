import dotenv from 'dotenv';

import app from './app';
import { prismaWrapper } from './services';

dotenv.config();

const startServer = async () => {
  try {
    // TODO env vars check
    await prismaWrapper.connect();

    const server = app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}!`);
    });

    const cleanup = async () => {
      server.close(async () => {
        await prismaWrapper.disconnect();
        console.info('Server closed!');
        process.exit();
      });
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
