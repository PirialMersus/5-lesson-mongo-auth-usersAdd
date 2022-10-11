import {Request, Response, Router} from 'express'
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter
    .post('/login',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const user = await usersService.checkCredentials(req.body.login, req.body.password)

            if (user) {
                res.status(204).send(user)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Cant login this user',
                    field: 'none',
                }]
                res.status(401).send(errorObj.errorsMessages[0].message)
            }
        })