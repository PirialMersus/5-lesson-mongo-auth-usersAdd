import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IPost} from "../repositories/db";
import {authMiddleware} from "../middlewares/auth-middleware";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {PostsService} from "../domain/posts-service";
import {BlogsService} from "../domain/blogs-service";

export interface IQuery {
    searchLoginTerm: string,
    searchEmailTerm: string,
    pageNumber: string
    pageSize: string
    sortBy: string,
    sortDirection: string,
}

export const serializedPostsSortBy = (value: string) => {
    switch (value) {
        case 'blogId':
            return 'blogId';
        case 'title':
            return 'title';
        case 'shortDescription':
            return 'shortDescription'
        case 'id':
            return 'id'
        case 'content':
            return 'content'
        case 'blogName':
            return 'blogName'
        default:
            return 'createdAt'
    }
}

export const postsRouter = Router({})

class PostsController {
    private postsService: PostsService
    private blogsService: BlogsService

    constructor() {
        this.postsService = new PostsService()
        this.blogsService = new BlogsService()
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

    async findPostById(id: string) {
        return await this.postsService.findPostById(id)
    }
    async findBlogById(id: string) {
        return await this.blogsService.findBlogById(id)
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

const postsController = new PostsController()

postsRouter.get('/', postsController.getPosts.bind(postsController))
    .get('/:postId?',
        param('postId').trim().not().isEmpty().withMessage('enter postId value in params'),
        inputValidatorMiddleware,
        postsController.getPost.bind(postsController))
    .post('/',
        authMiddleware,
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('blogId').trim().not().isEmpty().withMessage('enter input value in blogId field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),
        body('blogId').custom(async (value, {}) => {
            const isBloggerPresent = postsController.findPostById(value)
            if (!isBloggerPresent) {
                throw new Error('incorrect blogId');
            }
            return true;
        }),
        inputValidatorMiddleware,
        postsController.createPost.bind(postsController))
    .put('/:id?',
        authMiddleware,
        body('blogId').custom(async (value, {}) => {
            const isBloggerPresent = postsController.findBlogById(value)
            if (!isBloggerPresent) {
                throw new Error('incorrect blogId id');
            }
            return true;
        }),
        body('blogId').trim().not().isEmpty().withMessage('enter input value in blogId field'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        body('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        postsController.updatePost.bind(postsController))
    .delete('/:id?',
        authMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        postsController.deletePost.bind(postsController))