import { PrismaClient } from "@prisma/client";

const userModel = new PrismaClient().user;

export default userModel;