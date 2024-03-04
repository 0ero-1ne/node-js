import prismaClient from "../prisma/prisma-client.js";
import { checkSchema } from "express-validator";

const Faculty = prismaClient.faculty;

const schema = {
    faculty: { notEmpty: true, isString: true },
    faculty_name: { notEmpty: true, isString: true },
    pulpits: {
        optional: true,
        isArray: {
            bail: true,
            options: {
                min: 1
            }
        }
    },
    'pulpits.*.pulpit': { notEmpty: true, isString: true },
    'pulpits.*.pulpit_name': { notEmpty: true, isString: true }
};

class FacultyController {
    static async getFaculties(req, res) {
        let error = null;

        const faculties = await Faculty.findMany()
            .catch(err => error = err);

        if (faculties.length === 0) {
            error = 'Info: Faculty table is empty';
        }

        error === null ? res.send(faculties) : res.json({ message: error });
    }

    static async createFaculty(req, res) {
        let error = null;

        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!FacultyController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: FacultyController.#getSchemaError(jsonValidation)});
            return;
        }

        const faculty = await Faculty.upsert({
            data: {
                faculty: req.body.faculty,
                faculty_name: req.body.faculty_name
            }
        }).catch(() => error = `Error: Faculty ${req.body.faculty} is already exists`);

        if ('pulpits' in req.body) {
            req.body.pulpits.forEach(async (p) => {
                await prismaClient.pulpit.upsert({
                    where: { pulpit: p.pulpit },
                    create: { 
                        pulpit: p.pulpit,
                        pulpit_name: p.pulpit_name,
                        faculty_id: faculty.faculty
                    },
                    update: {}
                }).catch(err => error = err);
            });
        }

        error === null ? res.send(faculty) : res.json({ message: error });
    }

    static async updateFaculty(req, res) {
        let error = null;

        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!FacultyController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: FacultyController.#getSchemaError(jsonValidation)});
            return;
        }

        const faculty = await Faculty.update({
            where: { faculty: req.body.faculty },
            data: { faculty_name: req.body.faculty_name }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(faculty) : res.json({ message: error });
    }

    static async deleteFaculty(req, res) {
        let error = null;

        const id = req.params.id;

        const faculty = await Faculty.delete({
            where: { faculty: id }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(faculty) : res.json({ message: error });
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default FacultyController;