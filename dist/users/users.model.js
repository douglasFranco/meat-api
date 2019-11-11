"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { name: 'Zé da Silva', email: 'ze@gmail.com' },
    { name: 'jão da Silva', email: 'jao@gmail.com' },
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
}
exports.User = User;
