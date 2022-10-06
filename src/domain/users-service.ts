import {IUser} from "../repositories/db"
import {usersRepository} from "../repositories/users-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsPostsObjType} from "./posts-service";

export const usersService = {
    findUsers(pageNumber: number,
              pageSize: number,
              sortBy: keyof IUser,
              sortDirection: string,
              searchLoginTerm: string | null,
              searchEmailTerm: string | null
    ): Promise<IReturnedFindObj<IUser>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsPostsObjType = {
            pageNumber,
            pageSize,
            skip,
        }
        return usersRepository.findUsers(findConditionsObj,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
    },

    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        const date = new Date()
        const newBlogger: IUser = {
            login,
            email,
            id: (+date).toString(),
            createdAt: date.toISOString()
        }
        return usersRepository.createUser(newBlogger)
    },
    async deleteUser(id: string): Promise<boolean> {
        return usersRepository.deleteUser(id)
    }
}