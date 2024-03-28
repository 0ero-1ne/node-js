export interface IUser {
    username: string,
    password: string
}

const users : IUser[] = [
    {
        username: "admin",
        password: "admin"
    },
    {
        username: "user",
        password: "user"
    }
];

export default users;