import { LinkPrecedence } from '@prisma/client';
import contactController from '../controllers/contact-controller';
import { ContactRes } from '../types';

export class Formatters {
  static postIdentify(
    contact: Awaited<ReturnType<typeof contactController.Create.newLinked>>
  ): ContactRes {
    const primaryContact =
      contact.linkPrecedence === LinkPrecedence.primary
        ? contact
        : contact.primaryContact;

    const { id, email, phoneNumber, secondaryContacts } = primaryContact;

    const emails = new Set([]);
    const phoneNumbers = new Set([]);
    const secondaryContactIds = [];

    email && emails.add(email);
    phoneNumber && phoneNumbers.add(phoneNumber);

    secondaryContacts.map((it) => {
      it.email && emails.add(it.email);
      it.phoneNumber && phoneNumbers.add(it.phoneNumber);
      secondaryContactIds.push(it.id);
    });

    return {
      contact: {
        primaryContatctId: id,
        emails: [...emails],
        phoneNumbers: [...phoneNumbers],
        secondaryContactIds,
      },
    };
  }
}
