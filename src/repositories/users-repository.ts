import {IUser, usersCollection} from "./db";
import {FindConditionsPostsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {Filter} from "mongodb";

export const usersRepository = {
    async findUsers({pageNumber, pageSize, skip}: FindConditionsPostsObjType,
                    sortBy: keyof IUser,
                    sortDirection: string,
                    searchLoginTerm: string | null,
                    searchEmailTerm: string | null): Promise<IReturnedFindObj<IUser>> {
        const findObject: Filter<IUser> = {}
        if (searchLoginTerm) findObject.login = {$regex: new RegExp(searchLoginTerm, "i")}
        if (searchEmailTerm) findObject.email = {$regex: new RegExp(searchEmailTerm, "i")}
        const count = await usersCollection.find(findObject).count()
        const foundUsers: IUser[] = await usersCollection
            .find(findObject, {projection: {_id: false}})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip(skip)
            .limit(pageSize)
            .toArray()

        return new Promise((resolve) => {
            resolve({
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: foundUsers
            })
        })
    },

    async createUser(newUser: IUser): Promise<IUser> {
        await usersCollection.insertOne(newUser)
        return newUser
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}