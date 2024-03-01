const { Op } = require('sequelize');
const { sequelize, Weapon } = require('./../db/db').connectToDatabase();

class WeaponService {
    static async getWeapons() {
        let error = null;

        let weapons = await Weapon.findAll()
            .catch(err => error = err);

        if (weapons.length === 0) {
            error = 'Info: There is no records in Weapons table';
            weapons = null;
        }

        return weapons || error;
    }

    static async getWeaponById(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const weapon = await Weapon.findOne({ where: { id: ID }})
            .catch(err => error = err);

        if (weapon === null) {
            error = `Error: There is no record in Weapons table with id = ${ID}`;
        }

        return weapon || error;
    }

    static async getWeaponsByDPS(Dps) {
        let error = null;

        if (!Dps.match(/(gt|lt) ([0-9]*[.])?[0-9]+/gm)) {
            return `Error: Invalid input type for dps (${Dps})`;
        }

        const [ type, value ] = Dps.split(' ');
        
        let weapons = null;

        if (type === 'gt') {
            weapons = await Weapon.findAll({ where: { dps: { [Op.gt]: value }} }).catch(err => error = err);
        } else {
            weapons = await Weapon.findAll({ where: { dps: { [Op.lt]: value }} }).catch(err => error = err);
        }

        if (weapons.length === 0) {
            error = `Info: There is no records in Weapons table with dps ${type === 'gt' ? '>' : '<'} ${value}`;
            weapons = null;
        }

        return weapons || error;
    }

    static async saveWeapon(input) {
        let error = null;
        
        if (!('name' in input) || !('dps' in input) || Object.keys(input).length !== 2) {
            return 'Error: Json must have only 2 properties: name (string) and dps (number <= 500)';
        }

        if (!this.#checkWeapon(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isWeaponNameAllowed = await Weapon.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isWeaponNameAllowed !== null) {
            return `Error: Weapon with name '${input.name}' is already exists`;
        }

        const weapon = await Weapon.create(input)
            .catch(err => error = err);

        return weapon || error;
    }

    static async updateWeapon(input) {
        let error = null;

        if (!('name' in input) || !('dps' in input) || !('id' in input) || Object.keys(input).length !== 3) {
            return 'Error: Json must have only 3 properties: id (number), name (string) and dps (number 0..500)';
        }

        if (!this.#checkWeapon(input)) {
            return 'Error: Invalid data types/values of properties in json';
        }

        const isWeaponExists = await Weapon.findOne({ where: { id: input.id } });
        
        if (isWeaponExists === null) {
            return `Error: There is no record in Weapons table with id = ${input.id}`;
        }
        
        const isWeaponNameAllowed = await Weapon.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('name')), input.name.toLowerCase())
        }).catch(err => error = err);

        if (isWeaponNameAllowed !== null && isWeaponNameAllowed.id !== isWeaponExists.id) {
            return `Error: Weapon with name '${input.name}' is already exists`;
        }

        const weapon = await Weapon.update({
            name: input.name,
            dps: input.dps,
        }, {
            where: {
                id: input.id
            }
        }).catch(err => error = err);

        return weapon || error;
    }

    static async deleteWeapon(ID) {
        let error = null;

        if (isNaN(+ID)) {
            return `Error: Invalid input type for id (${ID})`;
        }

        const weapon = await Weapon.destroy({ where: { id: ID }})
            .catch(err => error = err);

        if (weapon === 0) {
            return `Error: There is no record in Weapons table with id = ${ID}`;
        }

        return weapon || error;
    }

    static #checkWeapon(input) {
        if ('id' in input) {
            if (typeof input.id !== 'number') {
                return false;
            }
        }

        if (typeof input.name !== 'string') {
            return false;
        }

        if (typeof input.dps !== 'number') {
            return false;
        }

        if (input.dps > 500 || input.dps < 0) {
            return false;
        }

        return true;
    }
}

module.exports.WeaponService = WeaponService;