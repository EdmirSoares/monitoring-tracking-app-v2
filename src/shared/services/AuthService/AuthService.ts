import { unAuthenticatedInstance } from "@/axios-config";
import { AuthUser } from "@/src/features/auth/domain/AuthUser";
import { getUserIdFromToken } from "../../utils/jwt_decode";

export async function login(
    email: string,
    password: string
): Promise<AuthUser> {
    const response = await unAuthenticatedInstance.post("/auth/login", {
        email,
        password,
    });

    const user = response.data;
    const token = getUserIdFromToken(response.data.token);


    return AuthUser.create({ ...user, token });
}
