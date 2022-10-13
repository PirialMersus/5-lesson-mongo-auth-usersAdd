import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "../controllers/blogs-controller";
import {Container} from "inversify";
import {PostsRepository} from "../repositories/posts-repository";
import {PostsService} from "../domain/posts-service";
import {PostsController} from "../controllers/posts-controller";
import {UsersRepository} from "../repositories/users-repository";
import {UsersService} from "../domain/users-service";
import {UsersController} from "../controllers/users-controller";
import {AuthController} from "../controllers/auth-controller";

// const blogsRepository = new BlogsRepository()
// export const blogsService = new BlogsService(blogsRepository)
// export const blogsController = new BlogsController(blogsService)

export const container = new Container();
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);

container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);


container.bind(AuthController).to(AuthController);
