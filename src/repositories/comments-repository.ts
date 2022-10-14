import {commentsCollection} from "./db";
import {injectable} from "inversify";
import {IComment} from "../types/types";

@injectable()
export class CommentsRepository {
    async findCommentById(id: string): Promise<IComment | null> {
        let comment = commentsCollection.findOne({id}, {projection: {_id: 0}})
        if (comment) {
            return comment
        } else {
            return null
        }
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        let result = await commentsCollection.updateOne({id}, {
            $set: {content}
        })
        return result.matchedCount === 1
    }

    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}