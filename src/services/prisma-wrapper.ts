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
    await this._client.$connect();
    console.info('POSTGRES CONNECTED!');
  }

  async disconnect() {
    await this._client.$disconnect();
    console.info('POSTGRES DISCONNECTED!');
  }
}

const prismaWrapper = new PrismaWrapper();

export { prismaWrapper };
