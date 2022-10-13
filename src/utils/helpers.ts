export const serializedPostsSortBy = (value: string) => {
    switch (value) {
        case 'blogId':
            return 'blogId';
        case 'title':
            return 'title';
        case 'shortDescription':
            return 'shortDescription'
        case 'id':
            return 'id'
        case 'content':
            return 'content'
        case 'blogName':
            return 'blogName'
        default:
            return 'createdAt'
    }
}
export const serializedUsersSortBy = (value: string) => {
    switch (value) {
        case 'login':
            return 'login';
        case '_id':
            return '_id'
        case 'id':
            return 'id'
        case 'email':
            return 'email'
        default:
            return 'createdAt'
    }
}