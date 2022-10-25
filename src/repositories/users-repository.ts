import {UsersModel} from "./db";
import {FindConditionsPostsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {WithId} from "mongodb";
import {injectable} from "inversify";
import {IUser} from "../types/types";

@injectable()
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
        const count = await UsersModel.find(findObject).count()
        const foundUsers: WithId<IUser>[] = await UsersModel
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
            .lean()

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
    async findUserById(id: string): Promise<IUser | null> {
        let user = UsersModel.findOne({id}, {projection: {_id: 0}})
        if (user) {
            return user
        } else {
            return null
        }
    }

    async createUser(newUser: IUser): Promise<IUser | null> {
        await UsersModel.insertMany([newUser])
        return UsersModel.findOne({_id: newUser._id}, {
            projection: {
                _id: false,
                passwordSalt: false,
                passwordHash: false
            }
        })
    }

    async deleteUser(id: string): Promise<boolean> {
        await UsersModel.deleteOne({id}, (err: any, d: {deletedCount: 1 | 0}) => {
            if (err || d.deletedCount !== 1) return false
        })
        return true
    }

    async findUser(login: string): Promise<IUser | null> {
        return UsersModel.findOne({login: login})
    }
}

//export const usersRepository = new UsersRepository()