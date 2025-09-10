import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
    role: string;
    exp?: number;
    iat?: number;
}

export const getUserIdFromToken = (token: string): { idUser: string; name: string } | null => {
    try {
        if (!token) return null;

        const decoded = jwtDecode<TokenPayload>(token);
        return {
            idUser: decoded.sub,
            name: decoded.role || ""
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        throw error;
    }
}
