import { LinkPrecedence } from '@prisma/client';

import { prismaWrapper } from '../services';
import { ContactAttrs, NotAllowedErrors } from '../types';
import { BadRequestError } from '../utils';

const prismaClient = prismaWrapper.client;

class Create {
  private static async _new(attrs: ContactAttrs) {
    if (!attrs.email && !attrs.phoneNumber) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    return await prismaClient.contact.create({
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

  private static async _newPrimary(
    attrs: Omit<ContactAttrs, 'linkPrecedence' | 'linkedId'>
  ) {
    return await this._new({
      ...attrs,
      linkPrecedence: LinkPrecedence.PRIMARY,
    });
  }

  private static async _newSecondary(
    attrs: Omit<ContactAttrs, 'linkPrecedence'>
  ) {
    return await this._new({
      ...attrs,
      linkPrecedence: LinkPrecedence.SECONDARY,
    });
  }

  static async newLinked(phoneNumber?: string, email?: string) {
    if (!email && !phoneNumber) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    const exisitingPrimary = await Read.exisitingPrimary(phoneNumber, email);

    const newContact = exisitingPrimary
      ? await this._newSecondary({
          phoneNumber,
          email,
          linkedId: exisitingPrimary.id,
        })
      : await this._newPrimary({
          phoneNumber,
          email,
        });

    return newContact;
  }
}

class Read {
  static async exisitingPrimary(phoneNumber?: string, email?: string) {
    if (!phoneNumber && !email) {
      throw new BadRequestError(NotAllowedErrors.emailPhoneRequired);
    }

    return await prismaClient.contact.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
        linkPrecedence: LinkPrecedence.PRIMARY,
        deletedAt: null,
      },
    });
  }
}

class Update {}

class Delete {
  // * soft delete
  static async byId(id: number) {
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
