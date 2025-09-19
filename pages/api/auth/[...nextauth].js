import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo user hardcoded
        const user = { id: 1, name: "Shree", email: "shree@example.com" }

        if (
          credentials.username === "shree" &&
          credentials.password === "1234"
        ) {
          return user
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
})
