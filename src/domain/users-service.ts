import {IUser, User} from "../repositories/db"
import {UsersRepository} from "../repositories/users-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsPostsObjType} from "./posts-service";
import bcrypt from 'bcrypt'

export class UsersService {
    private usersRepository: UsersRepository

    constructor() {
        this.usersRepository = new UsersRepository()
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

    async checkCredentials(login: string, password: string): Promise<boolean> {
        const user = await this.usersRepository.findUser(login)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        return user.passwordHash === passwordHash;

    }

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}

export const usersService = new UsersService()
