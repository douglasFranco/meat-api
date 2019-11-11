const users = [
    {name: 'Zé da Silva', email: 'ze@gmail.com'},
    {name: 'jão da Silva', email: 'jao@gmail.com'},
]

export class User {
    static findAll(): Promise<any[]>{
        return Promise.resolve(users)
    }
}