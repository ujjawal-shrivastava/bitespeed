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
          phoneNumber: attrs.phoneNumber,
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

    const exisiting = await Read.byEmailOrPhone(phoneNumber, email);

    const isExisitingIdentical =
      exisiting &&
      exisiting.email === email &&
      exisiting.phoneNumber === phoneNumber;

    if (isExisitingIdentical) return exisiting;

    const newContact = exisiting
      ? await this._newSecondary({
          phoneNumber,
          email,
          linkedId: exisiting.linkedId ?? exisiting.id,
        })
      : await this._newPrimary({
          phoneNumber,
          email,
        });

    return newContact;
  }
}

class Read {
  static async byEmailOrPhone(phoneNumber?: string, email?: string) {
    const prismaClient = prismaWrapper.client;

    if (!phoneNumber && !email) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    return await prismaClient.contact.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
        deletedAt: null,
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
  }
}

class Update {}

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
