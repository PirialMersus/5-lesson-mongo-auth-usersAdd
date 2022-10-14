import {injectable} from "inversify";
import {IComment, IPost} from "../types/types";
import {CommentsRepository} from "../repositories/comments-repository";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async getComment(id: string): Promise<IComment | null> {
        return this.commentsRepository.findCommentById(id)
    }
    async updateComment(id: string, content: string): Promise<boolean> {
        return this.commentsRepository.updateComment(id, content)
    }
    async createComment(post: IPost, content: string): Promise<boolean> {
        const date = new Date()
        // const newComment: IComment = new Comment(content,
        //     shortDescription,
        //     content,
        //     blogId,
        //     blog?.name,
        //     date);
        return this.commentsRepository.deleteComment(post.id)
    }
    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepository.deleteComment(id)
    }
}