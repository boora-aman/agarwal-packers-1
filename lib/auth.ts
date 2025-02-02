import jwt from "jsonwebtoken"

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string; isAdmin: boolean }
  } catch (error) {
    return null
  }
}
