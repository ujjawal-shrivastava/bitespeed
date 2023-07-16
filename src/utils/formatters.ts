import { LinkPrecedence } from '@prisma/client';
import contactController from '../controllers/contact-controller';
import { ContactRes } from '../types';

export class Formatters {
  static postIdentify(
    contact: Awaited<ReturnType<typeof contactController.Create.newLinked>>
  ): ContactRes {
    const primaryContact =
      contact.linkPrecedence === LinkPrecedence.PRIMARY
        ? contact
        : contact.primaryContact;

    const emails = [primaryContact.email];
    const phoneNumbers = [primaryContact.phoneNumber];
    const secondaryContactIds = [];

    primaryContact.secondaryContacts.map((it) => {
      emails.push(it.email);
      phoneNumbers.push(it.phoneNumber);
      secondaryContactIds.push(it.id);
    });

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  }
}
