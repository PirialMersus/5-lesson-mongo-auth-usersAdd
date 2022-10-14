import {MongoClient, ObjectId} from 'mongodb'
import {IBlog, IComment, IPassword, IPost, IUser} from "../types/types";


export class Blog {
    createdAt: string
    id: string
    static date: Date

    constructor(public name: string,
                public youtubeUrl: string,
                date: Date) {
        this.createdAt = date.toISOString()
        this.id = (+date).toString()
    }
}

export class Comment {
    createdAt: string
    id: string
    static date: Date

    constructor(public content: string,
                public userId: string,
                public userLogin: string,
                date: Date) {
        this.createdAt = date.toISOString()
        this.id = (+date).toString()
    }
}


export class Post {
    createdAt: string
    id: string
    blogName: string
    static date: Date
    static possibleBlogName: string | undefined

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
    static date: Date

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



export interface IPasswordObjectType {
    userId: number,
    passwords: IPassword[]
}

const uri = "mongodb+srv://mersus:genafe@bloggers.ypwqb.mongodb.net/blogsPostsUsers?retryWrites=true&w=majority";

export const client = new MongoClient(uri);
export const blogsCollection = client.db().collection<IBlog>('blogs')
export const postsCollection = client.db().collection<IPost>('posts')
export const usersCollection = client.db().collection<IUser>('users')
export const commentsCollection = client.db().collection<IComment>('comments')


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