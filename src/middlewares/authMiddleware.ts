import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {container} from "../compositions/composition-root";
import {UsersService} from "../domain/users-service";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // console.log('req.headers.authorization', req.headers.authorization)
    if (req.headers.authorization) {
        const base64FirstWorld = req.headers.authorization.split(' ')[0];
        const base64Credentials = req.headers.authorization.split(' ')[1];

        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
        if (`${base64FirstWorld} ${username}:${password}` === 'Basic admin:qwerty') {
            // if (username === 'admin' && password === 'qwerty') {
            next()
        } else {
            res.sendStatus(401)
        }
        return
    }
    res.sendStatus(401)
}
export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        const user = await container.resolve(UsersService).findUserByIdAllDataReturn(userId)
        req.user = user

    } else {
        res.sendStatus(401)
    }
    next()
}