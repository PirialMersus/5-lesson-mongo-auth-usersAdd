import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {IReturnedFindObj} from "../repositories/blogs-repository";
import {errorObj} from "../middlewares/input-validator-middleware";
// import {blogsService} from "../compositions/composition-blogs";
import {injectable} from "inversify";
import {BlogsService} from "../domain/blogs-service";
import {IComment, IPost, IQuery, IRequest, IUser} from "../types/types";
import {serializedCommentsSortBy, serializedPostsSortBy} from "../utils/helpers";
import {CommentsService} from "../domain/comments-service";

@injectable()
export class PostsController {
    constructor(protected postsService: PostsService,
                protected blogsService: BlogsService,
                protected commentsService: CommentsService) {
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

    async getCommentsOfThePost(req: Request<{ postId: string }, {}, {}, IRequest>, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy: string = req.query.sortBy ? req.query.sortBy : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection : 'desc'
        const postId: string = req.params.postId

        const post = await this.postsService.findPostById(postId)
        if (!post) {
            res.sendStatus(404);
            return
        }
        const response: IReturnedFindObj<IComment> = await this.commentsService.findCommentsByPostId(
            postId,
            pageNumber,
            pageSize,
            serializedCommentsSortBy(sortBy),
            sortDirection)
        res.status(200).send(response)
    }

    async createCommentForPost(req: Request, res: Response) {
        const postId: string = req.params.postId
        const user: IUser | null = req.user

        const post = await this.postsService.findPostById(postId)
        // console.log('post', post)
        // console.log('user', user)
        if (!post || !user) {
            res.sendStatus(404)
            return
        }

        const newComment = await this.commentsService.createComment(post,
            req.body.content,
            user
        )
        res.status(201).send(newComment)
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


// Received: {
//     "pagesCount"
// :
//     2, "page"
// :
//     1, "pageSize"
// :
//     10, "totalCount"
// :
//     12, "items"
// :
//     [{
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:24.634Z",
//         "id": "1666002264634"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:24.331Z",
//         "id": "1666002264331"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:24.054Z",
//         "id": "1666002264054"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:23.767Z",
//         "id": "1666002263767"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:23.478Z",
//         "id": "1666002263478"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:23.192Z",
//         "id": "1666002263192"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:22.906Z",
//         "id": "1666002262906"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:22.626Z",
//         "id": "1666002262626"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:22.334Z",
//         "id": "1666002262334"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "postId": "1666002261165",
//         "createdAt": "2022-10-17T10:24:22.042Z",
//         "id": "1666002262042"
//     }]
// }