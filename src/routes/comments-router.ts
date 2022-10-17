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
        bearerAuthMiddleware,
        param('id').trim().not().isEmpty().withMessage('enter id value in params'),
        body('content').trim().not().isEmpty().withMessage('enter input value in content field'),
        body('content').isLength({max: 300, min: 20}).withMessage('content: maxLength: 300 minLength: 20'),
        inputValidatorMiddleware,
        commentsController.updateComment.bind(commentsController)
    )
    .delete('/:id?',
        bearerAuthMiddleware,
        param('id').not().isEmpty().withMessage('enter id value in params'),
        inputValidatorMiddleware,
        commentsController.deleteComment.bind(commentsController)
    )