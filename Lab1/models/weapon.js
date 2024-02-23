const { DataTypes, Model } = require('sequelize');

class Weapon extends Model {}

module.exports.initWeaponModel = (sequelize) => {
    Weapon.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dps: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, { sequelize });

    return Weapon;
};