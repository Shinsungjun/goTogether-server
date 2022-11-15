import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthQuery {
  retrieveUserIdAndCreatedAtQuery = (phoneNumber: string): string => {
    return `
      SELECT User.userName,
            DATE_FORMAT(User.createdAt, '%Y.%m.%d') as createdAt
      FROM User
      WHERE User.phoneNumber = '${phoneNumber}' and User.status = 'ACTIVE';
    `;
  };

  retrieveDeletedUserByPhoneNumber = (phoneNumber: string): string => {
    return `
      SELECT User.id
      FROM User
      WHERE User.phoneNumber = ${phoneNumber}
        and User.accountStatus = 'DELETED'
        and TIMESTAMPDIFF(day, User.createdAt, NOW()) < 7;
    `;
  };
}
