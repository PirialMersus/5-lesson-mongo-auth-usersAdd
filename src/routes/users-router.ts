import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {usersService} from "../domain/users-service";
import {IUser} from "../repositories/db"
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {IQuery} from "./posts-router";
import {authMiddleware} from "../middlewares/auth-middleware";

export const serializedUsersSortBy = (value: string) => {
    switch (value) {
        case 'login':
            return 'login';
        case 'id':
            return 'id'
        case 'email':
            return 'email'
        default:
            return 'createdAt'
    }
}

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request<{}, {}, {}, IQuery>, res: Response) => {
    const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm : null
    const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm : null
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10
    const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
    const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
    const users: IReturnedFindObj<IUser> = await usersService.findUsers(
        pageNumber,
        pageSize,
        serializedUsersSortBy(sortBy),
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    )
    res.send(users);
})
    .post('/',
        authMiddleware,
        body('login').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('password').trim().not().isEmpty().withMessage('enter input value in password field'),
        body('login').isLength({max: 10, min: 3}).withMessage('login: maxLength: 10 minLength: 3'),
        body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),
        body('email').trim().not().isEmpty().withMessage('enter input value in email field'),
        body('email').isLength({max: 100}).withMessage('email length should be less then 100'),
        body('email').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value to email field');
            }
            return true;
        }),

        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email)
            if (newUser) {
                res.status(201).send(newUser)
            } else {
                errorObj.errorsMessages = [{
                    message: 'Cant create new user',
                    field: 'none',
                }]
                res.status(404).send(errorObj.errorsMessages)
            }
        })
    .delete('/:id?',
        authMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = req.params.id;
            const isDeleted = await usersService.deleteUser(id)

            if (!isDeleted) {
                errorObj.errorsMessages = [{
                    message: 'Required user not found',
                    field: 'none',
                }]
                res.status(404).send(errorObj.errorsMessages[0].message)
            } else {
                res.send(204)
            }
        })
