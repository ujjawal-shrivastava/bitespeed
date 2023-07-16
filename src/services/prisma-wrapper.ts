import { PrismaClient } from '@prisma/client';

class PrismaWrapper {
  private _client?: PrismaClient;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access database before connecting!');
    }
    return this._client;
  }

  async connect() {
    this._client = new PrismaClient();
    await this.client.$connect();
    console.info('POSTGRES CONNECTED!');
  }

  async disconnect() {
    await this.client.$disconnect();
    console.info('POSTGRES DISCONNECTED!');
  }
}

const prismaWrapper = new PrismaWrapper();
const prismaClient = prismaWrapper.client;

export { prismaWrapper, prismaClient };
