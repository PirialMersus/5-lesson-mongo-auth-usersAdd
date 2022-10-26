import {injectable} from "inversify";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {errorObj} from "../middlewares/input-validator-middleware";
import {jwtService} from "../application/jwtService";

@injectable()
export class AuthController {
    constructor(protected usersService: UsersService) {
    }

     checkCredentials = async (req: Request, res: Response) => {
        const user = await this.usersService.checkCredentials(req.body.login, req.body.password)

        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({
                "accessToken": token
            })
        } else {
            errorObj.errorsMessages = [{
                message: 'Cant login this user',
                field: 'none',
            }]
            res.status(401).send(errorObj.errorsMessages[0].message)
        }
    }

    // async getUserInformation(req: Request, res: Response) {
    //     const user = await this.usersService.checkCredentials(req.body.login, req.body.password)
    //
    //     if (user) {
    //         const token = await jwtService.createJWT(user)
    //         res.status(200).send(user)
    //     } else {
    //         errorObj.errorsMessages = [{
    //             message: 'Cant login this user',
    //             field: 'none',
    //         }]
    //         res.status(401).send(errorObj.errorsMessages[0].message)
    //     }
    // }
}