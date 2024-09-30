import axios from "axios";
import NextAuth, { NextAuthOptions, Account, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { AdapterUser } from "next-auth/adapters";
import prisma from "../../../lib/prisma";

// Define types for the callback parameters
type SignInParams = {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: { verificationRequest?: boolean };
  credentials?: Record<string, any>;
};

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ account, profile }: SignInParams) {
      try {
        if (account && account.provider === "google") {
          if (profile && profile.email) {
            // const response = await axios.get(
            //   `http://localhost:3000/api/user/${profile.email}`
            // );
            // console.log(response);
            // if (response && response.data.users.length === 0) {
            //   await axios.post("/api/user", {
            //     name: profile.name ?? "",
            //     email: profile.email,
            //     address: "",
            //   });
            // }

            const users = await prisma.user.findMany({
              where: {
                walletAddress: profile.email,
                email: profile.email,
              },
            });

            if (users.length === 0) {
              await prisma.user.create({
                data: {
                  name: profile.name ?? "",
                  email: profile.email,
                  walletAddress: profile.email,
                  role: "INVESTOR",
                  state: "",
                  investorType: "",
                  approved: true,
                },
              });
            }

            return true;
          }
        }
      } catch (error) {
        console.log(error);
        return false;
      }

      return false; // Default return if conditions are not met
    },
  },
};

export default NextAuth(authOptions);
