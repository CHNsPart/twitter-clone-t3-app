import type { PhoneNumber, User } from "@clerk/nextjs/dist/api";

function formatPhoneNumbers(phoneNumbers: PhoneNumber[]): string {
  return phoneNumbers.map((phoneNumber) => phoneNumber.toString()).join(", ");
}


export const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username:user.username, 
    profilePicture: user.profileImageUrl,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    lastSignInAt: user.lastSignInAt,
    gender: user.gender,
    birthday: user.birthday,
    phone: formatPhoneNumbers(user.phoneNumbers),
  }
}