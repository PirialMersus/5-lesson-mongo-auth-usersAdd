import {PostsRepository} from "../repositories/posts-repository";
import {PostsService} from "../domain/posts-service";
import {PostsController} from "../controllers/posts-controller";
import {blogsService} from "./composition-blogs";

const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)
export const postsController = new PostsController(postsService, blogsService)
