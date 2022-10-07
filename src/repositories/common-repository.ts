import {blogsCollection, postsCollection, usersCollection} from "./db";


export const commonRepository = {
    async deleteAll(): Promise<boolean> {
        const resultBlogs = await blogsCollection.deleteMany({})
        const resultPosts = await postsCollection.deleteMany({})
        const resultUsers = await usersCollection.deleteMany({})
        // const resultPosts = await postsCollection.deleteMany({})
        return resultBlogs.acknowledged
            && resultPosts.acknowledged
            && resultUsers.acknowledged
    },
}

// {
//     "_id": "629711812a96d7ba6ae292c6",
//     "name": "new 222 blo222",
//     "youtubeUrl": "https://www.youtubecom/bla/222221",
//     "id": 1654067585795
// },
// {
//     "_id": "632704c3527353c507852044",
//     "name": "mongo test",
//     "youtubeUrl": "https://www.youtube.com/channel/UCNH9VJDJVt8pXg4TEUHh76w",
//     "id": 1663501507285
// }