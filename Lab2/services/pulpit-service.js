import prismaClient from "../prisma/prisma-client.js";

const Pulpit = prismaClient.pulpit;

const getPulpits = async (req, res) => {
    let error = null;

    const pulpits = await Pulpit.findMany()
        .catch(err => error = err);

    if (pulpits.length === 0) {
        error = 'Info: Pulpit table is empty';
    }

    return error === null ? pulpits : { message: error };
};

const createPulpit = async (req, res) => {
    let error = null;

    const faculty = await prismaClient.faculty.upsert({
        where: { faculty: req.body.faculty.faculty },
        create: {
            faculty: req.body.faculty.faculty,
            faculty_name: req.body.faculty.faculty_name
        },
        update: {}
    }).catch(err => error = err);

    const pulpit = await Pulpit.create({
        data: {
            pulpit: req.body.pulpit,
            pulpit_name: req.body.pulpit_name,
            faculty_id: faculty.faculty
        }
    }).catch(() => error = `Error: Pulpit ${req.body.pulpit} is already exists`);

    return error === null ? pulpit : { message: error };
};

const updatePulpit = async (req, res) => {
    let error = null;

    const pulpit = await Pulpit.update({
        where: { pulpit: req.body.pulpit },
        data: {
            pulpit_name: req.body.pulpit_name,
            faculty_id: req.body.faculty
        }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? pulpit : { message: error };
};

const deletePulpit = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const pulpit = await Pulpit.delete({
        where: { pulpit: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? pulpit : { message: error };
};

export default {
    create: createPulpit,
    read: getPulpits,
    update: updatePulpit,
    delete: deletePulpit,
};