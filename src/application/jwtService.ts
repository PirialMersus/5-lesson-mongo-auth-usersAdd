import jwt from "jsonwebtoken"
import {settings} from "../settings/settings";
import {IUser} from "../types/types";

export const jwtService = {
    async createJWT(user: IUser) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '100h'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (error) {
            return
        }
    }
}