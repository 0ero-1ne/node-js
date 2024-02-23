const { DataTypes, Model } = require('sequelize');

class Turtle extends Model {}

module.exports.initTurtleModel = (sequelize) => {
    Turtle.init({
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
        color: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, { sequelize });

    return Turtle;
};