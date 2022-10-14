import {Router} from 'express'
import {container} from "../compositions/composition-root";
import {AuthController} from "../controllers/auth-controller";
import {bearerAuthMiddleware} from "../middlewares/authMiddleware";
import {UsersController} from "../controllers/users-controller";

export const authRouter = Router({})


const authController = container.resolve(AuthController)
const usersController = container.resolve(UsersController)
authRouter
    .post('/login',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        // inputValidatorMiddleware,
        authController.checkCredentials.bind(authController)
    )
    .get('/me',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        // inputValidatorMiddleware,
        bearerAuthMiddleware,
        usersController.getUser.bind(authController)
    )