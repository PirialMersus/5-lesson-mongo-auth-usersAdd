import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {IUser} from "../repositories/db";
import {errorObj} from "../middlewares/input-validator-middleware";
import {injectable} from "inversify";
import {IQuery} from "../types/types";
import {serializedUsersSortBy} from "../utils/helpers";

@injectable()
export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: Request<{}, {}, {}, IQuery>, res: Response) {
        const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : ''
        const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : ''
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const users: IReturnedFindObj<IUser> = await this.usersService.findUsers(
            pageNumber,
            pageSize,
            serializedUsersSortBy(sortBy),
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
        res.send(users);
    }

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (newUser) {
            res.status(201).send(newUser)
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant create new user',
                field: 'none',
            }]
            res.status(404).send(errorObj.errorsMessages)
        }
    }

    async deleteUser(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.usersService.deleteUser(id)

        if (!isDeleted) {
            errorObj.errorsMessages = [{
                message: 'Required user not found',
                field: 'none',
            }]
            res.status(404).send(errorObj.errorsMessages[0].message)
        } else {
            res.send(204)
        }
    }
}