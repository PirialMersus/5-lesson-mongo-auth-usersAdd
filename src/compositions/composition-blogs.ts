import "reflect-metadata";
import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../controllers/blogs-controller";
import {Container} from "inversify";

const blogsRepository = new BlogsRepository
export const blogsService = new BlogsService(blogsRepository)
// export const blogsController = new BlogsController(blogsService)


export const container = new Container();
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
