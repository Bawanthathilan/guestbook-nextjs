import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import NextAuth from 'next-auth';

const GITHUB_ID = "<github id>";
const GITHUB_SECRET = "<github secret key>";
const NEXTAUTH_SECRET = "<next auth>"

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: NEXTAUTH_SECRET,

    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
    ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };