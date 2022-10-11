import {UsersRepository} from "../repositories/users-repository";
import {UsersService} from "../domain/users-service";
import {UsersController} from "../controllers/users-controller";

const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository)
export const usersController = new UsersController(usersService)
