import {Router} from 'express'
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {container} from "../compositions/composition-root";
import {AuthController} from "../controllers/auth-controller";

export const authRouter = Router({})


const authController = container.resolve(AuthController)
authRouter
    .post('/login',
        // authMiddleware,
        // body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        // body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        // body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),

        inputValidatorMiddleware,
        authController.checkCredentials.bind(authController))