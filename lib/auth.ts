import jwt from "jsonwebtoken"

interface DecodedToken {
  adminId: string;
  username?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

export function verifyToken(token: string): DecodedToken | { error: string } {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as DecodedToken;
    
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return { error: 'TOKEN_EXPIRED' };
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: 'TOKEN_EXPIRED' };
    }
    return { error: 'INVALID_TOKEN' };
  }
}
