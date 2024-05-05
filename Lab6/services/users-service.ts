import { Request, Response } from "express";
import User from "./../models/user";

const getUserById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
        return res.json({ message: "Invalid id type" });
    }

    const user = await User.findFirst({
        where: {
            id: id
        },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
        }
    });

    if (!user) {
        return res.json({ message: `No user with ${id} id` });
    }

    res.json(user);
}

const createUser = async (req: Request, res: Response) => {
    const body = req.body;
    let error = null;

    const user = await User.create({
        data: {
            username: body.username,
            password: body.password,
            email: body.email,
            role: body.role
        }
    }).catch(err => error = err);

    return res.json(error ? { message: error } : { message: "User was created" });
}

export {
    getUserById,
    createUser,

}