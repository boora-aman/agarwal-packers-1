import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean; // ✅ Add isAdmin
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    isAdmin: boolean; // ✅ Add isAdmin
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean; // ✅ Add isAdmin to JWT token
  }
}
