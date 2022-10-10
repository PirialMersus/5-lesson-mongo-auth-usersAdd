import {IUser, usersCollection} from "./db";
import {FindConditionsPostsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {WithId} from "mongodb";

export class UsersRepository {
    async findUsers({pageNumber, pageSize, skip}: FindConditionsPostsObjType,
                    sortBy: keyof IUser,
                    sortDirection: string,
                    searchLoginTerm: string | null,
                    searchEmailTerm: string | null): Promise<IReturnedFindObj<IUser>> {
        const findObject = {
            $or: [{
                login: {
                    $regex: searchLoginTerm || '',
                    $options: "(?i)a(?-i)cme"
                }
            }, {email: {$regex: searchEmailTerm || '', $options: "(?i)a(?-i)cme"}}]
        }
        const count = await usersCollection.find(findObject).count()
        const foundUsers: WithId<IUser>[] = await usersCollection
            .find(findObject,
                {
                    projection: {
                        _id: false,
                        passwordSalt: false,
                        passwordHash: false
                    }
                })
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
    }

    async createUser(newUser: IUser): Promise<IUser | null> {
        await usersCollection.insertOne(newUser)
        return usersCollection.findOne({_id: newUser._id}, {
            projection: {
                _id: false,
                passwordSalt: false,
                passwordHash: false
            }
        })
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
        return result.deletedCount === 1
    }

    async findUser(login: string): Promise<IUser | null> {
        return usersCollection.findOne({login: login})
    }
}

export const usersRepository = new UsersRepository()