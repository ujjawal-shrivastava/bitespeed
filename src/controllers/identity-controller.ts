import { prismaClient } from '../services';

class Create {
  async new(phoneNumber?: string, email?: string) {
    return await prismaClient.identity.create({
      data: {
        phoneNumber,
        email,
      },
    });
  }
}

class Read {}

class Update {}

class Delete {
  async one(id: number) {
    return await prismaClient.identity.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export default { Create, Read, Update, Delete };