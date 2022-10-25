import {User} from "../repositories/db"
import {UsersRepository} from "../repositories/users-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsPostsObjType} from "./posts-service";
import bcrypt from 'bcrypt'
import {injectable} from "inversify";
import {IUser} from "../types/types";

@injectable()
export class UsersService {

    constructor(protected usersRepository: UsersRepository) {
    }

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
        return this.usersRepository.findUsers(findConditionsObj,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
    }

    async findUserByIdAllDataReturn(id: string) {
        const user = await this.usersRepository.findUserById(id)
        if (!user) return null
        return user
    }
    async findUserByIdSomeDataReturn(id: string) {
        const user = await this.usersRepository.findUserById(id)
        if (!user) return null

        return {
            email: user.email,
            login: user.login,
            userId: user.id
        }
    }

    async createUser(login: string, password: string, email: string): Promise<IUser | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const date = new Date()
        const newUser: User = new User(login, email, passwordSalt, passwordHash, date)
        return this.usersRepository.createUser(newUser)
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.usersRepository.deleteUser(id)
    }

    async checkCredentials(login: string, password: string): Promise<IUser | null> {
        const user: IUser | null = await this.usersRepository.findUser(login)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user
        } else return null

    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}

// export const usersService = new UsersService()
