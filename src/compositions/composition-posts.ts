import {PostsRepository} from "../repositories/posts-repository";
import {PostsService} from "../domain/posts-service";
import {PostsController} from "../controllers/posts-controller";

const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)
export const postsController = new PostsController(postsService)
