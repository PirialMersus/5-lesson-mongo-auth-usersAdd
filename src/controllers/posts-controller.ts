import "reflect-metadata";
import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {IPost} from "../repositories/db";
import {errorObj} from "../middlewares/input-validator-middleware";
import {IQuery, serializedPostsSortBy} from "../routes/posts-router";
import {blogsService} from "../compositions/composition-blogs";
import {injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(protected postsService: PostsService) {
    }

    async getPosts(req: Request<{}, {}, {}, IQuery>, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const posts: IReturnedFindObj<IPost> = await this.postsService.findPosts(
            pageNumber,
            pageSize,
            serializedPostsSortBy(sortBy),
            sortDirection)
        res.send(posts);
    }

    async findBlogById(id: string) {
        return await blogsService.findBlogById(id)
    }

    async getPost(req: Request, res: Response) {
        let post: IPost | null = await this.postsService.findPostById(req.params.postId)

        if (post) {
            res.send(post)
        } else {
            res.send(404)
        }
    }

    async createPost(req: Request, res: Response) {

        const newPost = await this.postsService.createPost(req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)

        res.status(201).send(newPost)
    }

    async updatePost(req: Request, res: Response) {
        const title = req.body.title;
        const shortDescription = req.body.shortDescription;
        const content = req.body.content;
        const blogId = req.body.blogId;

        const id = req.params.id;

        const isUpdated: boolean = await this.postsService.updatePost(id, title, shortDescription, content, blogId)
        if (isUpdated) {
            const product = await this.postsService.findPostById(req.params.id)
            res.status(204).send(product)
        } else {
            errorObj.errorsMessages = [{
                message: 'Required post not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        }
    }

    async deletePost(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.postsService.deletePost(id)

        if (!isDeleted) {
            errorObj.errorsMessages = [{
                message: 'Required blogger not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        } else {
            res.send(204)
        }
    }
}