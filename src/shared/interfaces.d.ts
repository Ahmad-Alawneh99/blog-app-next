export interface User {
    name: string;
    id: string;
    email: string;
    password?: string;
}

export interface Blog {
    _id: string;
    title: string;
    content: string;
}
