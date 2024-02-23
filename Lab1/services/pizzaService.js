const { Op, where } = require('sequelize');
const { sequelize, Pizza } = require('./../db/db').connectToDatabase();

class PizzaService {
    static async getPizzas() {
        let error = null;

        let pizzas = await Pizza.findAll()
            .catch(err => error = err);

        if (pizzas.length === 0) {
            error = 'Info: There is no records in Pizzas table';
            pizzas = null;
        }

        return pizzas || error;
    }

    static async getPizzaById(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const pizza = await Pizza.findOne({ where: { id: ID }})
            .catch(err => error = err);

        if (pizza === null) {
            error = `Error: There is no record in Pizzas table with id = ${ID}`;
        }

        return pizza || error;
    }

    static async getPizzasByCalories(Calories) {
        let error = null;

        if (!Calories.match(/(gt|lt) ([0-9]*[.])?[0-9]+/gm)) {
            return `Error: Invalid input type for calories (${Calories})`;
        }

        const [ type, value ] = Calories.split(' ');
        
        let pizzas = null;

        if (type === 'gt') {
            pizzas = await Pizza.findAll({ where: { calories: { [Op.gt]: value }} }).catch(err => error = err);
        } else {
            pizzas = await Pizza.findAll({ where: { calories: { [Op.lt]: value }} }).catch(err => error = err);
        }

        if (pizzas.length === 0) {
            error = `Info: There is no records in Pizzas table with calories ${type === 'gt' ? '>' : '<'} ${value}`;
            pizzas = null;
        }

        return pizzas || error;
    }

    static async savePizza(input) {
        let error = null;

        if (!('name' in input) || !('calories' in input) || !('description' in input) || Object.keys(input).length !== 3) {
            return 'Error: Json must have only 3 properties: name (string), calories (number) and description (string|null)';
        }

        if (!this.#checkPizza(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isPizzaNameAllowed = await Pizza.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isPizzaNameAllowed !== null) {
            return `Error: Pizza with name '${input.name}' is already exists`;
        }

        const pizza = await Pizza.create(input)
            .catch(err => error = err);

        return pizza || error;
    }

    static async updatePizza(input) {
        let error = null;

        if (!('name' in input) || !('calories' in input) || !('description' in input) || !('id' in input) || Object.keys(input).length !== 4) {
            return 'Error: Json must have only 4 properties: id (number), name (string), calories (number 0..2000) and description (string|null)';
        }

        if (!this.#checkPizza(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isPizzaExists = await Pizza.findOne({ where: { id: input.id } });

        if (isPizzaExists === null) {
            return `Error: There is no record in Pizzas table with id = ${input.id}`;
        }

        const isPizzaNameAllowed = await Pizza.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isPizzaNameAllowed !== null && isPizzaExists.id !== isPizzaNameAllowed.id) {
            return `Error: Pizza with name '${input.name}' is already exists`;
        }

        const pizza = await Pizza.update({
            name: input.name,
            calories: input.calories,
            description: input.description
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = err);

        return pizza || error;
    }

    static async deletePizza(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const pizza = await Pizza.destroy({ where: { id: ID }})
            .catch(err => error = err);

        if (pizza === 0) {
            return `Error: There is no record in Pizzas table with id = ${ID}`;
        }

        return pizza || error;
    }

    static async transaction() {
        try {
            let error = null;
            
            const t = await sequelize.transaction();
            
            const pizzas = await Pizza.update({
                description: 'SUPER FAT!!!'
            }, { where: { calories: { [Op.gt]: 1500 }} })
                .catch(err => error = err);
            
            return pizzas || error;
        } catch(err) {
            return `Error: Transaction error ${err}`;
        }
    }

    static #checkPizza(input) {
        if ('id' in input) {
            if (typeof input.id !== 'number') {
                return false;
            }
        }

        if (typeof input.name !== 'string') {
            return false;
        }

        if (typeof input.calories !== 'number') {
            return false;
        }

        if (input.calories > 2000 || input.calories < 0) {
            return false;
        }

        if (input.description !== null && typeof input.description !== 'string') {
            return false;
        }

        return true;
    }
}

module.exports.PizzaService = PizzaService;