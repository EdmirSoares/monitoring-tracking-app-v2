import { z } from "zod";

const AuthUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2),
    email: z.email(),
    token: z.string().min(1),
    roles: z.array(z.string()).default(["pilot"]),
});

export type AuthUserProps = z.infer<typeof AuthUserSchema>;

export class AuthUser {
    private readonly props: AuthUserProps;

    private constructor(props: AuthUserProps) {
        this.props = props;
    }

    static create(data: unknown): AuthUser {
        const parsed = AuthUserSchema.parse(data);
        return new AuthUser(parsed);
    }

    get id() {
        return this.props.id;
    }

    get email() {
        return this.props.email;
    }

    get token() {
        return this.props.token;
    }

    get name() {
        return this.props.name;
    }

    isAdmin() {
        return this.props.roles.includes("admin");
    }

    isPilot() {
        return this.props.roles.includes("pilot");
    }

    toJSON() {
        return this.props;
    }
}
