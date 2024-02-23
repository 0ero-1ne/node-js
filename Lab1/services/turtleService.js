const { Op } = require('sequelize');
const { sequelize, Turtle, Weapon, Pizza } = require('./../db/db').connectToDatabase();

class TurtleService {
    static async getTurtles() {
        let error = null;

        let turtles = await Turtle.findAll()
            .catch(err => error = err);

        if (turtles.length === 0) {
            error = 'Info: There is no records in Turtles table';
            turtles = null;
        }

        return turtles || error;
    }

    static async getTurtleById(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const turtle = await Turtle.findOne({ where: { id: ID }})
            .catch(err => error = err);

        if (turtle === null) {
            error = `Error: There is no record in Turtles table with id = ${ID}`;
        }

        return turtle || error;
    }

    static async getTurtlesByFavoritePizza(pizza) {
        let error = null;
        
        
        let turtles = await Turtle.findAll({ include: [
            {
                model: Pizza,
                as: 'favoritePizza'
            },
        ]}).catch(err => error = err);

        turtles = turtles.filter(turtle => turtle.favoritePizza.name.toLowerCase() === pizza.toLowerCase());

        if (turtles.length === 0) {
            error = `Info: There is no records in Turtles table with favorite pizza '${pizza}'`;
            turtles = null;
        }

        return turtles || error;
    }

    static async saveTurtle(input) {
        let error = null;
        
        if (!('name' in input) || !('color' in input) || !('WeaponId' in input) || !('favoritePizzaId' in input) || !('secondFavoritePizzaId' in input) || Object.keys(input).length !== 5) {
            return 'Error: Json must have only 5 properties: name (string), color (string), WeaponId (number), favoritePizzaId (number) and secondFavoritePizzaId (number)';
        }

        if (!this.#checkTurtle(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isTurtleNameAllowed = await Turtle.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isTurtleNameAllowed !== null) {
            return `Error: Turtle with name '${input.name}' is already exists`;
        }

        const turtle = await Turtle.create(input)
            .catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static async updateTurtle(input) {
        let error = null;

        if (!('name' in input) || !('color' in input) || !('WeaponId' in input) || !('favoritePizzaId' in input) || !('secondFavoritePizzaId' in input) || !('id' in input) || Object.keys(input).length !== 6) {
            return 'Error: Json must have only 6 properties: id (number), name (string), color (string), WeaponId (number), favoritePizzaId (number) and secondFavoritePizzaId (number)';
        }

        if (!this.#checkTurtle(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isTurtleExists = await Turtle.findOne({ where: { id: input.id } });

        if (isTurtleExists === null) {
            return `Error: There is no record in Turtles table with id = ${input.id}`;
        }

        const isTurtleNameAllowed = await Turtle.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isTurtleNameAllowed !== null && isTurtleNameAllowed.id !== isTurtleExists.id) {
            return `Error: Turtle with name '${input.name}' is already exists`;
        }

        const turtle = await Turtle.update({
            name: input.name,
            dps: input.dps,
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static async updateImage(ID, Image) {
        let error = null;

        const turtle = await Turtle.update({
            image: Image
        }, {
            where: {
                id: ID
            }
        }).catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static async deleteTurtle(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const turtle = await Turtle.destroy({ where: { id: ID }})
            .catch(err => error = err);

        if (turtle === 0) {
            return `Error: There is no record in Turtles table with id = ${ID}`;
        }

        return turtle || error;
    }

    static async bindFavoritePizza(input, isUnbind) {
        let error = null;

        if (!isUnbind) {
            if (!('id' in input) || !('favoritePizzaId' in input) || Object.keys(input).length !== 2) {
                return 'Error: Json must have only 2 properties: id (number) and favoritePizzaId (number)';
            }
        } else {
            if (!('id' in input) || Object.keys(input).length !== 1) {
                return 'Error: Json must have only 1 property: id (number)';
            }
        }

        if (!this.#checkUnbindInput(input)) {
            return 'Error: Invalid data types\/values of properties in json';
        }

        const turtle = await Turtle.update({
            favoritePizzaId: isUnbind ? 1 : input.favoritePizzaId,
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static async bindSecondFavoritePizza(input, isUnbind) {
        let error = null;

        if (!isUnbind) {
            if (!('id' in input) || !('secondFavoritePizzaId' in input) || Object.keys(input).length !== 2) {
                return 'Error: Json must have only 2 properties: id (number) and secondFavoritePizzaId (number)';
            }
        } else {
            if (!('id' in input) || Object.keys(input).length !== 1) {
                return 'Error: Json must have only 1 property: id (number)';
            }
        }

        if (!this.#checkUnbindInput(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const turtle = await Turtle.update({
            secondFavoritePizzaId: isUnbind ? 1 : input.secondFavoritePizzaId,
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static async bindWeapon(input, isUnbind) {
        let error = null;

        if (!isUnbind) {
            if (!('id' in input) || !('WeaponId' in input) || Object.keys(input).length !== 2) {
                return 'Error: Json must have only 2 properties: id (number) and WeaponId (number)';
            }
        } else {
            if (!('id' in input) || Object.keys(input).length !== 1) {
                return 'Error: Json must have only 1 property: id (number)';
            }
        }

        if (!this.#checkUnbindInput(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const turtle = await Turtle.update({
            WeaponId: isUnbind ? 1 : input.WeaponId,
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = "Error: " + err.parent.detail);

        return turtle || error;
    }

    static #checkTurtle(input) {
        if ('id' in input) {
            if (typeof input.id !== 'number') {
                return false;
            }
        }

        if (typeof input.name !== 'string') {
            return false;
        }

        if (typeof input.color !== 'string') {
            return false;
        }

        if (typeof input.WeaponId !== 'number') {
            return false;
        }

        if (typeof input.favoritePizzaId !== 'number') {
            return false;
        }

        if (typeof input.secondFavoritePizzaId !== 'number') {
            return false;
        }

        return true;
    }

    static #checkUnbindInput(input) {
        if (typeof input.id !== 'number') {
            return false;
        }

        if ('WeaponId' in input) {
            if (typeof input.WeaponId !== 'number') {
                return false;
            }
        }

        if ('favoritePizzaId' in input) {
            if (typeof input.favoritePizzaId !== 'number') {
                return false;
            }
        }

        if ('secondFavoritePizzaId' in input) {
            if (typeof input.secondFavoritePizzaId !== 'number') {
                return false;
            }
        }

        return true;
    }
}

module.exports.TurtleService = TurtleService;