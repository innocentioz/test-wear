import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    username: string;
    fullName: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      role: string;
      fullName?: string;
    };
  }

  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: string;
    fullName?: string;
  }
}
