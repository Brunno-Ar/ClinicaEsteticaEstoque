import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions = {
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { tenant: true },
        });

        if (!user || !user.password) {
          console.error(
            "Login falhou: Usuário não encontrado ou sem senha",
            credentials.email
          );
          throw new Error("Credenciais inválidas");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          console.error(
            "Login falhou: Senha incorreta para",
            credentials.email
          );
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenantStatus: user.tenant?.subscriptionStatus || null,
          trialEndsAt: user.tenant?.trialEndsAt || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantStatus = user.tenantStatus;
        token.trialEndsAt = user.trialEndsAt;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantStatus = token.tenantStatus as string;
        session.user.trialEndsAt = token.trialEndsAt as string | null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };
export { handler as GET, handler as POST };
