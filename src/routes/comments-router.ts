import {Router} from 'express'
import {container} from "../compositions/composition-root";
import {bearerAuthMiddleware} from "../middlewares/authMiddleware";
import {body, param} from "express-validator";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {CommentsController} from "../controllers/comments-controller";

export const commentsRouter = Router({})


const commentsController = container.resolve(CommentsController)
commentsRouter
    .get('/:id?',
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        commentsController.getComment.bind(commentsController)
    )
    .put('/:id?',

        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('content').isLength({max: 300, min: 20}).withMessage('content: maxLength: 300 minLength: 20'),
        // body('password').isLength({min: 6, max: 20}).withMessage('password: min: 6, max: 20'),
        bearerAuthMiddleware,
        inputValidatorMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete('/:id?',
        bearerAuthMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,

        commentsController.deleteComment.bind(commentsController)
    )
//
// Expected: {
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
//         "createdAt": "2022-10-17T10:24:24.634Z",
//         "id": "1666002264634"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:24.331Z",
//         "id": "1666002264331"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:24.054Z",
//         "id": "1666002264054"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:23.767Z",
//         "id": "1666002263767"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:23.478Z",
//         "id": "1666002263478"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:23.192Z",
//         "id": "1666002263192"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:22.906Z",
//         "id": "1666002262906"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:22.626Z",
//         "id": "1666002262626"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:22.334Z",
//         "id": "1666002262334"
//     }, {
//         "content": "length_21-weqweqweqwq",
//         "userId": "1666002258983",
//         "userLogin": "lg-258635",
//         "createdAt": "2022-10-17T10:24:22.042Z",
//         "id": "1666002262042"
//     }]
// }
//
