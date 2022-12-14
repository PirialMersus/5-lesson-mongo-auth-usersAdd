import {injectable} from "inversify";
import {Comment} from "../repositories/db"
import {IComment, IPost, IUser} from "../types/types";
import {CommentsRepository} from "../repositories/comments-repository";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {FindConditionsObjType} from "./posts-service";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async findCommentById(id: string): Promise<IComment | null> {
        return this.commentsRepository.findCommentById(id)
    }

    async findCommentsByPostId(postId: string,
                               pageNumber: number,
                               pageSize: number,
                               sortBy: keyof IComment,
                               sortDirection: string): Promise<IReturnedFindObj<IComment>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: FindConditionsObjType = {
            postId,
            pageNumber,
            pageSize,
            skip,
        }
        return this.commentsRepository.findCommentsByPostId(findConditionsObj, sortBy, sortDirection)
    }

    async updateComment(id: string, content: string, userId: string | undefined) {
        const comment = await this.commentsRepository.findCommentById(id)
        if (comment?.userId !== userId) return 'notMyOwnComment'
        return this.commentsRepository.updateComment(id, content)
    }

    async createComment(post: IPost, content: string, user: IUser): Promise<IComment | null> {
        const date = new Date()
        const newComment: IComment = Comment.create(content,
            user.id,
            user.login,
            post.id,
            date);
        return this.commentsRepository.createComment(newComment)
    }

    async deleteComment(id: string, userId: string | undefined): Promise<boolean | 'notMyComment'> {
        const comment = await this.commentsRepository.findCommentById(id)
        if (comment?.userId !== userId) return 'notMyComment'
        return this.commentsRepository.deleteComment(id)
    }
}