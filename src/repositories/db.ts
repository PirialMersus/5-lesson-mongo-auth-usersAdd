import {MongoClient} from 'mongodb'

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
    id: number,
    name: string,
    password: string,
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