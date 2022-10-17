import {commentsCollection} from "./db";
import {injectable} from "inversify";
import {IComment} from "../types/types";
import {FindConditionsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {WithId} from "mongodb";

@injectable()
export class CommentsRepository {
    async findCommentById(id: string): Promise<IComment | null> {
        let comment = commentsCollection.findOne({id}, {projection: {_id: 0, postId: 0},})
        if (comment) {
            return comment
        } else {
            return null
        }
    }

    async findCommentsByPostId({postId, pageNumber, pageSize, skip}: FindConditionsObjType,
                               sortBy: keyof IComment,
                               sortDirection: string): Promise<IReturnedFindObj<IComment>> {
        const count = await commentsCollection.find({postId}).count()
        const foundComments: WithId<IComment>[] = await commentsCollection
            .find({postId}, {projection: {_id: false, postId: 0}})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip(skip)
            .limit(pageSize)
            .toArray()
        return new Promise((resolve) => {
            resolve({
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: foundComments
            })
        })
    }

    async createComment(comment: IComment): Promise<IComment | null> {
        await commentsCollection.insertOne(comment)
        return commentsCollection.findOne({id: comment.id}, {projection: {_id: 0, postId: 0}})
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