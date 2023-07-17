import { LinkPrecedence } from '@prisma/client';

import { prismaWrapper } from '../services';
import { ContactAttrs, NotAllowedErrors } from '../types';
import { BadRequestError } from '../utils';

class Create {
  private static async _new(attrs: ContactAttrs) {
    const prismaClient = prismaWrapper.client;

    if (!attrs.email && !attrs.phoneNumber) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    return await prismaClient.$transaction(async (tx) => {
      const exisitingIdentical = await tx.contact.findFirst({
        where: {
          email: attrs.email,
          phoneNumber: attrs.phoneNumber ?? null,
        },
        include: {
          primaryContact: {
            include: {
              secondaryContacts: true,
            },
          },
          secondaryContacts: true,
        },
      });

      if (exisitingIdentical) {
        return exisitingIdentical;
      } else {
        return await tx.contact.create({
          data: attrs,
          include: {
            primaryContact: {
              include: {
                secondaryContacts: true,
              },
            },
            secondaryContacts: true,
          },
        });
      }
    });
  }

  private static async _newPrimary(
    attrs: Omit<ContactAttrs, 'linkPrecedence' | 'linkedId'>
  ) {
    return await this._new({
      ...attrs,
      linkPrecedence: LinkPrecedence.primary,
    });
  }

  private static async _newSecondary(
    attrs: Omit<ContactAttrs, 'linkPrecedence'>
  ) {
    return await this._new({
      ...attrs,
      linkPrecedence: LinkPrecedence.secondary,
    });
  }

  static async newLinked(phoneNumber?: string, email?: string) {
    if (!email && !phoneNumber) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    const exisitingPrimaryContacts = await Read.primaryByEmailOrPhone(
      phoneNumber,
      email
    );

    const [first, ...rest] = exisitingPrimaryContacts;

    if (rest.length) {
      await Update.bulkMarkSecondary(
        rest.map((it) => it.id),
        first.id
      );
    }

    const newContact = first
      ? await this._newSecondary({
          phoneNumber,
          email,
          linkedId: first.id,
        })
      : await this._newPrimary({
          phoneNumber,
          email,
        });

    return newContact;
  }
}

class Read {
  static async primaryByEmailOrPhone(phoneNumber?: string, email?: string) {
    const prismaClient = prismaWrapper.client;

    if (!phoneNumber && !email) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    return await prismaClient.contact.findMany({
      where: {
        OR: [{ email }, { phoneNumber }],
        linkPrecedence: 'primary',
        deletedAt: null,
      },
    });
  }
}

class Update {
  static async bulkMarkSecondary(ids: number[], primaryContactId: number) {
    const prismaClient = prismaWrapper.client;
    return await prismaClient.contact.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        linkPrecedence: LinkPrecedence.secondary,
        linkedId: primaryContactId,
      },
    });
  }
}

class Delete {
  // * soft delete
  static async byId(id: number) {
    const prismaClient = prismaWrapper.client;

    return await prismaClient.contact.update({
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
