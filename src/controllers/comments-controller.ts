import {Request, Response} from "express";
// import {blogsService} from "../compositions/composition-blogs";
import {injectable} from "inversify";
import {CommentsService} from "../domain/comments-service";
import {errorObj} from "../middlewares/input-validator-middleware";

@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService) {
    }

    async getComment(req: Request, res: Response) {
        const id = req.params.id;
        console.log('id', id)
        const comment = await this.commentsService.findCommentById(id)
        if (comment) {
            res.status(200).send(comment)
        } else {
            res.sendStatus(404)
        }
    }

    async updateComment(req: Request, res: Response) {
        // const user: IUser | null = req.user
        const id = req.params.id;
        const content = req.body.content;

        const isUpdated = await this.commentsService.updateComment(id, content)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteComment(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.commentsService.deleteComment(id)

        if (isDeleted) {
            res.sendStatus(204)

        } else {
            errorObj.errorsMessages = [{
                message: 'Required comment not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        }

    }
}