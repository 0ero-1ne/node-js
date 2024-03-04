import prismaClient from "../prisma/prisma-client.js";
import { checkSchema } from "express-validator";

const Subject = prismaClient.subject;

const schema = {
    subject: { notEmpty: true, isString: true },
    subject_name: { notEmpty: true, isString: true },
    pulpit_id: { notEmpty: true, isString: true }
};

class SubjectController {
    static async getSubjects(req, res) {
        let error = null;

        const subjects = await Subject.findMany()
            .catch(err => error = err);

        if (subjects.length === 0) {
            error = 'Info: Subject table is empty';
        }

        error === null ? res.send(subjects) : res.json({ message: error });
    }

    static async createSubject(req, res) {
        let error = null;

        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!SubjectController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: SubjectController.#getSchemaError(jsonValidation)});
            return;
        }

        const subject = await Subject.create({
            data: {
                subject: req.body.subject,
                subject_name: req.body.subject_name,
                pulpit_id: req.body.pulpit_id
            }
        }).catch(() => error = `Error: Subject ${req.body.subject} is already exists`);

        error === null ? res.send(subject) : res.json({ message: error });
    }

    static async updateSubject(req, res) {
        let error = null;

        const jsonValidation = await checkSchema(schema).run(req);
        
        if (!SubjectController.#checkSchemaValid(jsonValidation)) {
            res.json({ message: SubjectController.#getSchemaError(jsonValidation)});
            return;
        }

        const subject = await Subject.update({
            where: { subject: req.body.subject },
            data: {
                subject_name: req.body.subject_name,
                pulpit_id: req.body.pulpit_id
            }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(subject) : res.json({ message: error });
    }

    static async deleteSubject(req, res) {
        let error = null;

        const id = req.params.id;

        const subject = await Subject.delete({
            where: { subject: id }
        }).catch(err => error = `Error: Model ${err.meta.modelName}; ${err.meta.cause}`);

        error === null ? res.send(subject) : res.json({ message: error });
    }

    static #checkSchemaValid(schema) {
        return schema.filter(item => item.errors.length !== 0).length === 0;
    }

    static #getSchemaError(schema) {
        const error = schema.filter(item => item.errors.length !== 0)[0].errors[0];
        return `Error: Field ${error.path} has ${error.msg}`;
    }
}

export default SubjectController;