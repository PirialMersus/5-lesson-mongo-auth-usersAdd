import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../controllers/blogs-controller";

const blogsRepository = new BlogsRepository
export const blogsService = new BlogsService(blogsRepository)
export const blogsController = new BlogsController(blogsService)
