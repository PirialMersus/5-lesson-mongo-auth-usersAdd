import {injectable} from "inversify";
import {IComment} from "../types/types";
import {FindConditionsObjType} from "../domain/posts-service";
import {IReturnedFindObj} from "./blogs-repository";
import {WithId} from "mongodb";
import {CommentsModel} from "./db";

@injectable()
export class CommentsRepository {
    async findCommentById(id: string): Promise<IComment | null> {
        let comment = CommentsModel.findOne({id}, {projection: {_id: 0, postId: 0},})
        if (comment) {
            return comment
        } else {
            return null
        }
    }

    async findCommentsByPostId({postId, pageNumber, pageSize, skip}: FindConditionsObjType,
                               sortBy: keyof IComment,
                               sortDirection: string): Promise<IReturnedFindObj<IComment>> {
        const count = await CommentsModel.find({postId}).count()
        const foundComments: WithId<IComment>[] = await CommentsModel
            .find({postId}, {projection: {_id: false, postId: 0}})
            .sort({[sortBy]: sortDirection === 'desc' ? -1 : 1})
            .skip(skip)
            .limit(pageSize)
            .lean()
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
        await CommentsModel.insertMany([comment])
        return CommentsModel.findOne({id: comment.id}, {projection: {_id: 0, postId: 0}})
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        let result: {matchedCount: number} = await CommentsModel.updateOne({id}, {
            $set: {content}
        })
        return result.matchedCount === 1
    }

    async deleteComment(id: string): Promise<boolean> {
        const result: {deletedCount: number} = await CommentsModel.deleteOne({id})
        return result.deletedCount === 1
    }
}