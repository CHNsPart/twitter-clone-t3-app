import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username:user.username, 
    profilePicture: user.profileImageUrl,
    email: user.emailAddresses[0]?.emailAddress,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  }
}