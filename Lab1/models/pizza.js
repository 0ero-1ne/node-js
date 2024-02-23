const { DataTypes, Model } = require('sequelize');

class Pizza extends Model {}

module.exports.initPizzaModel = (sequelize) => {
    Pizza.init({
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
        calories: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, { sequelize });

    return Pizza;
};