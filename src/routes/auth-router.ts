import {Request, Response, Router} from 'express'
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {UsersService} from "../domain/users-service";
import {usersService} from "../compositions/composition-users.ts";

export const authRouter = Router({})

class AuthController {
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

const authController = new AuthController(usersService);
authRouter
    .post('/login',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        inputValidatorMiddleware,
        authController.checkCredentials.bind(authController))