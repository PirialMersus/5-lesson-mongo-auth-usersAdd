import {MongoClient, ObjectId} from 'mongodb'

export interface IBlog {
    name: string,
    youtubeUrl: string,
    id: string,
    createdAt: string
}

export class Blog {
    createdAt: string
    id: string
    static date

    constructor(public name: string,
                public youtubeUrl: string,
                date: Date) {
        this.createdAt = date.toISOString()
        this.id = (+date).toString()
    }
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

export class Post {
    createdAt: string
    id: string
    blogName: string
    static date
    static possibleBlogName

    constructor(public title: string,
                public shortDescription: string,
                public content: string,
                public blogId: string,
                possibleBlogName: string | undefined,
                date: Date) {
        this.createdAt = date.toISOString()
        this.id = (+date).toString()
        this.blogName = possibleBlogName ? possibleBlogName : ''
    }
}


export class User {
    _id: ObjectId
    createdAt: string
    id: string
    static date

    constructor(public login: string,
                public email: string,
                public passwordSalt: string,
                public passwordHash: string,
                date: Date) {
        this.createdAt = date.toISOString()
        this._id = new ObjectId()
        this.id = (+date).toString()
    }
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

export interface IPassword {
    id: number,
    service: string,
    name: string,
    password: string,
}

export interface IPasswordObjectType {
    userId: number,
    passwords: IPassword[]
}

const uri = "mongodb+srv://mersus:genafe@bloggers.ypwqb.mongodb.net/blogsPostsUsers?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
export const blogsCollection = client.db().collection<IBlog>('blogs')
export const postsCollection = client.db().collection<IPost>('posts')
export const usersCollection = client.db().collection<IUser>('users')


export async function runDb() {
    try {
        await client.connect();
        // Establish and verify connection
        await client.db("blogsPostsUsers").command({ping: 1});
        console.log("Connected successfully to mongo server");

    } catch {
        console.log("Can't connect to db");
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}