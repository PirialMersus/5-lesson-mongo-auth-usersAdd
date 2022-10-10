import {blogsRepository, IReturnedFindObj} from "../repositories/blogs-repository"
import {Blog, IBlog} from "../repositories/db"

export interface IFindObj {
    name: string,
    pageNumber: number,
    pageSize: number,
    skip: number,
}
export class BlogsService {
    findBlogs(name: string,
              pageNumber: number,
              pageSize: number,
              sortBy: keyof IBlog,
              sortDirection: string): Promise<IReturnedFindObj<IBlog>> {
        const skip = (pageNumber - 1) * pageSize
        const findConditionsObj: IFindObj = {
            name,
            pageNumber,
            pageSize,
            skip,
        }

        return blogsRepository.findBlogs(findConditionsObj, sortBy, sortDirection)
    }

    async findBlogById(id: string): Promise<IBlog | null> {
        return blogsRepository.findBlogById(id)
    }
    async createBlog(name: string, youtubeUrl: string): Promise<IBlog | null> {
        const date = new Date()
        const newBlog: Blog = new Blog(name, youtubeUrl, date)

        return blogsRepository.createBlogger(newBlog)
    }
    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, youtubeUrl)
    }

    async deleteBlogger(id: string): Promise<boolean> {
        return blogsRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsService()