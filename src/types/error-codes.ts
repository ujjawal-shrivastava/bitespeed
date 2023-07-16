export interface BaseErrorCodeStructure {
  [key: string]: { code: string; message: string; description?: string };
}

export const NotAllowedErrors = {
  emailPhoneRequired: {
    code: 'EC-NA-001',
    message: 'Cannot create contact as both email & phone number are undefined',
  },
};
