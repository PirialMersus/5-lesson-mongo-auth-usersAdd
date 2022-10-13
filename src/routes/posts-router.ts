import {Router} from 'express'
import {body, param} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {PostsController} from "../controllers/posts-controller";
import {container} from "../compositions/composition-root";

export const postsRouter = Router({})
const postsController = container.resolve(PostsController);

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
            const isBloggerPresent = await postsController.findBlogById(value)

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
            const isBloggerPresent = await postsController.findBlogById(value)
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