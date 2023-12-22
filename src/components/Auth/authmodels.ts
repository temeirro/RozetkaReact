import {IUploadedFile} from "./imageconvert.ts";

export interface IRegisterForm {
    name: string;
    lastName: string;
    image: IUploadedFile | null;
    email: string;
    password: string;
}

export interface IRegister {
    name: string;
    lastName: string;
    image: string | undefined;
    email: string;
    password: string;
}

export interface ILoginResult {
    token: string
}

export interface IUserLoginInfo {
    name: string,
    email: string
}