import prismaClient from "../prisma/prisma-client.js";

const Auditorium = prismaClient.auditorium;

const getAuditoriums = async (req, res) => {
    let error = null;

    const auditoriums = await Auditorium.findMany()
        .catch(err => error = err);

    if (auditoriums.length === 0) {
        error = 'Info: Auditorium table is empty';
    }

    return error === null ? auditoriums : { message: error };
};

const createAuditorium = async (req, res) => {
    let error = null;

    const auditorium = await Auditorium.create({
        data: {
            auditorium: req.body.auditorium,
            auditorium_capacity: req.body.auditorium_capacity,
            auditorium_type_id: req.body.auditorium_type,
            auditorium_name: req.body.auditorium_name
        }
    }).catch(() => error = `Error: Auditorium ${req.body.auditorium} is already exists`);

    return error === null ? auditorium : { message: error };
};

const updateAuditorium = async (req, res) => {
    let error = null;

    const auditorium = await Auditorium.update({
        where: { auditorium: req.body.auditorium, },
        data: {
            auditorium_capacity: req.body.auditorium_capacity,
            auditorium_type_id: req.body.auditorium_type,
            auditorium_name: req.body.auditorium_name
        }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? auditorium : { message: error };
};

const deleteAuditorium = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const auditorium = await Auditorium.delete({
        where: { auditorium: id }
    }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

    return error === null ? auditorium : { message: error };
};

const getCompAuditoriums = async (req, res) => {
    let error = null;

    const id = req.params.id;

    const auditoriums = await Auditorium.findMany({
        where: {
            auditorium: {
                endsWith: `-${id}`
            }
        }
    }).catch((err) => error = err);

    return error === null ? auditoriums : error;
};

const getAuditoriumsWithSameCount = async (req, res) => {
    let error = null;

    const auditoriums = await Auditorium.groupBy({
        by: ['auditorium_capacity', 'auditorium_type_id'],
        _count: {
            auditorium: true
        },
    }).catch((err) => error = err);

    return error === null ? auditoriums : error;
};

export default {
    create: createAuditorium,
    read: getAuditoriums,
    update: updateAuditorium,
    delete: deleteAuditorium,
    compAuditoriums: getCompAuditoriums,
    sameCount: getAuditoriumsWithSameCount
};