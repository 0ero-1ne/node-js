import Express from "express";
import { getUserById, createUser } from "../services/users-service";

const route = Express.Router();

route.get('/api/user/:id', getUserById);
route.post('/api/user', createUser);

export default route;