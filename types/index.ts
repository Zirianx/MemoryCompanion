export interface User {
    email: string;
    name: string;
    password: string;
    image?: string;
    birthdate?: string;
    address?: string;
    mobileNo?: string;
}

export interface EditableUserFields {
    name: string;
    image: string;
    birthdate: string;
    address: string;
    mobileNo: string;
}