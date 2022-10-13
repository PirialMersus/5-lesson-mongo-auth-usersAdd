import {injectable} from "inversify";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {errorObj} from "../middlewares/input-validator-middleware";

@injectable()
export class AuthController {
    constructor(protected usersService: UsersService) {
    }

    async checkCredentials(req: Request, res: Response) {
        const user = await this.usersService.checkCredentials(req.body.login, req.body.password)

        if (user) {
            res.status(204).send(user)
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant login this user',
                field: 'none',
            }]
            res.status(401).send(errorObj.errorsMessages[0].message)
        }
    }
}