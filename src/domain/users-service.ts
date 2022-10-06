import {IPasswordObjectType, IUser} from "../repositories/db"
import {usersRepository} from "../repositories/users-repository";

export const usersService = {
    async findUser(name: string, password: string): Promise<IUser | null> {
        return usersRepository.findUser(name, password)
    },
    async createUser(name: string, password: string,): Promise<IUser | null> {
        const userId: number = +(new Date())
        const newUser: IUser = {
            name,
            password,
            id: userId,
        }
        const initPasswordsObject: IPasswordObjectType = {
            userId,
            passwords: []
        }
        return usersRepository.createUser(newUser)
    },
}