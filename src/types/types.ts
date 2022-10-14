import {ObjectId} from "mongodb";

export type IRequest = {
    searchNameTerm: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
}
export interface IQuery {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: string
    pageSize: string
    sortBy: string,
    sortDirection: string,
}
export interface IBlog {
    name: string,
    youtubeUrl: string,
    id: string,
    createdAt: string
}
export interface IPost {
    id: string,
    blogId: string,
    title: string,
    shortDescription: string,
    content: string,
    blogName: string,
    createdAt: string
}
export interface IUser {
    _id: ObjectId,
    login: string,
    email: string,
    createdAt: string,
    passwordSalt: string,
    passwordHash: string,
    id: string
}
export interface IComment {
    _id: ObjectId,
    content: string,
    userId: string,
    createdAt: string,
    userLogin: string,
    id: string
}
export interface IPassword {
    id: number,
    service: string,
    name: string,
    password: string,
}