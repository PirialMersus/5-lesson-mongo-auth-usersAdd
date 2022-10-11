import {Request, Response, Router} from 'express'
import {body, param} from "express-validator";
import {errorObj, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {IBlog, IPost} from "../repositories/db";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {serializedPostsSortBy} from "./posts-router";
import {BlogsService} from "../domain/blogs-service";

export const blogsRouter = Router({})

export type IRequest = {
    searchNameTerm: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
}

class BlogsController {
    private blogsService: BlogsService

    constructor() {
        this.blogsService = new BlogsService()
    }

    async getBlogs(req: Request<{}, {}, {}, IRequest>, res: Response) {
        const name = req.query.searchNameTerm ? req.query.searchNameTerm : ''
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const response: IReturnedFindObj<IBlog> = await this.blogsService.findBlogs(name,
            pageNumber,
            pageSize,
            serializedBlogsSortBy(sortBy),
            sortDirection)
        res.send(response);
    }

    async getBlog(req: Request, res: Response) {
        let blog: IBlog | null = await this.blogsService.findBlogById(req.params.blogId)

        if (blog) {
            res.send(blog)
        } else {
            res.send(404)
        }
    }

    async getPostsOfBlog(req: Request<{ blogId: string }, {}, {}, IRequest>, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const blogId: string = req.params.blogId
        const isBloggerPresent = await this.blogsService.findBlogById(blogId)
        if (isBloggerPresent) {
            const response: IReturnedFindObj<IPost> = await postsService.findPostsByBlogId(
                blogId,
                pageNumber,
                pageSize,
                serializedPostsSortBy(sortBy),
                sortDirection)
            res.send(response);
        } else {
            res.send(404);
        }

    }

    async createBlog(req: Request, res: Response) {

        const newBlog = await this.blogsService.createBlog(req.body.name, req.body.youtubeUrl)
        res.status(201).send(newBlog)

    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId: string = req.params.blogId

        const isBloggerPresent = await this.blogsService.findBlogById(blogId)
        if (isBloggerPresent) {
            const newPost = await postsService.createPost(req.body.title,
                req.body.shortDescription,
                req.body.content,
                blogId)
            res.status(201).send(newPost)
        } else {
            res.send(404);
        }
    }

    async updateBlog(req: Request, res: Response) {
        const name = req.body.name;
        const youtubeUrl = req.body.youtubeUrl;

        const isUpdated: boolean = await this.blogsService.updateBlogger(req.params.id, name, youtubeUrl)
        if (isUpdated) {
            const blogger = await this.blogsService.findBlogById(req.params.id)
            res.status(204).send(blogger)
        } else {
            errorObj.errorsMessages = [{
                message: 'Required blogger not found',
                field: 'none',
            }]
            res.status(404).send(errorObj)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const id = req.params.id;
        const isDeleted = await this.blogsService.deleteBlogger(id)

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


const serializedBlogsSortBy = (value: string) => {
    switch (value) {
        case 'name':
            return 'name';
        case 'youtubeUrl':
            return 'youtubeUrl'
        case 'id':
            return 'id'
        default:
            return 'createdAt'
    }
}
export const blogsController = new BlogsController()
blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
    .get('/:blogId?',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        blogsController.getBlog.bind(blogsController))
    .get('/:blogId/posts',
        param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
        inputValidatorMiddleware,
        blogsController.getPostsOfBlog.bind(blogsController))
    .post('/',
        authMiddleware,
        body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }
            return true;
        }),
        inputValidatorMiddleware,
        blogsController.createBlog.bind(blogsController))
    .post('/:blogId/posts',
        authMiddleware,
        param('blogId').trim().not().isEmpty().withMessage('enter blogId value in params'),
        body('title').trim().not().isEmpty().withMessage('enter input value in title field'),
        body('shortDescription').trim().not().isEmpty().withMessage('enter input value in shortDescription field'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('title').isLength({max: 30}).withMessage('title length should be less then 30'),
        body('content').isLength({max: 1000}).withMessage('content length should be less then 1000'),
        body('shortDescription').isLength({max: 100}).withMessage('shortDescription length should be less then 100'),
        param('blogId').isLength({max: 1000}).withMessage('blogId length should be less then 1000'),

        inputValidatorMiddleware,
        blogsController.createPostForBlog.bind(blogsController))
    .put('/:id?',
        authMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
        body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
        body('youtubeUrl').isLength({max: 100}).withMessage('youtubeUrl length should be less then 100'),
        body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
        body('youtubeUrl').custom((value, {req}) => {
            const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
            if (!regExp.test(req.body.youtubeUrl)) {
                throw new Error('enter correct value');
            }
            return true;
        }),
        inputValidatorMiddleware,
        blogsController.updateBlog.bind(blogsController))
    .delete('/:id?',
        authMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        blogsController.deleteBlog.bind(blogsController))