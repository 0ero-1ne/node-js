import prismaClient from "../prisma/prisma-client.js";
import { checkSchema } from "express-validator";

const Pulpit = prismaClient.pulpit;

const schema = {
    create: {
        pulpit: { notEmpty: true, isString: true },
        pulpit_name: { notEmpty: true, isString: true },
        'faculty.faculty': { notEmpty: true, isString: true },
        'faculty.faculty_name': { notEmpty: true, isString: true },
    },
    update: {
        pulpit: { notEmpty: true, isString: true },
        pulpit_name: { notEmpty: true, isString: true },
        faculty: { notEmpty: true, isString: true }
    }
}

class PulpitController {
    static async getPulpits(req, res) {
        let error = null;

        const pulpits = await Pulpit.findMany()
            .catch(err => error = err);

        if (pulpits.length === 0) {
            error = 'Info: Pulpit table is empty';
        }

        error === null ? res.send(pulpits) : res.json({ message: error });
    }

    static async createPulpit(req, res) {
        let error = null;
        
        const jsonValidation = await checkSchema(schema.create).run(req);
        
        if (!PulpitController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: PulpitController.#getSchemaError(jsonValidation)});
            return;
        }

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

        error === null ? res.send(pulpit) : res.json({ message: error });
    }

    static async updatePulpit(req, res) {
        let error = null;
        
        const jsonValidation = await checkSchema(schema.update).run(req);
        
        if (!PulpitController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: PulpitController.#getSchemaError(jsonValidation)});
            return;
        }

        const pulpit = await Pulpit.update({
            where: { pulpit: req.body.pulpit },
            data: {
                pulpit_name: req.body.pulpit_name,
                faculty_id: req.body.faculty
            }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(pulpit) : res.json({ message: error });
    }

    static async deletePulpit(req, res) {
        let error = null;

        const id = req.params.id;

        const pulpit = await Pulpit.delete({
            where: { pulpit: id }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(pulpit) : res.json({ message: error });
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default PulpitController;