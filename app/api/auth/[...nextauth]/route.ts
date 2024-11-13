import prisma from "@/prisma/db"
import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "password",
      name: "Username and Password",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Username...",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      // (check valid user)
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials!.username,
          },
        })

        // (wrong username)
        if (!user) {
          return null
        }

        // ( check same password)
        const matchPassword = await bcrypt.compare(
          credentials!.password,
          user.password
        )

        // (Wrodng Password)
        if (!matchPassword) {
          return null
        }

        // Username and Password correct
        return user
      },
    }),
  ],

  // MIDDLEWARE run on every request
  callbacks: {
    async jwt({token, account, user}) {
      if (account) {
        token.role = user.role
      }
      return token
    },
    session({session, token}) {
      if (session.user) {
        session.user.role = token.role || "USER"
      }

      return session
    },
  },
}

const handler = NextAuth(OPTIONS)

export {handler as GET, handler as POST}
