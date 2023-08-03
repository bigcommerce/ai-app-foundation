export interface User {
    email: string;
    id: number;
    username?: string;
}

export interface SessionProps {
    access_token?: string;
    context: string;
    owner?: User;
    scope?: string;
    url?: string;
    store_hash?: string;
    sub?: string;
    timestamp?: number;
    user: User;
}
