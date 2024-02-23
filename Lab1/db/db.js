const { Sequelize } = require('sequelize');

const { initWeaponModel } = require('./../models/weapon');
const { initPizzaModel } = require('./../models/pizza');
const { initTurtleModel } = require('./../models/turtle');

function connectToDatabase() {
    const sequelize = new Sequelize('postgres://dimas:$Ad0129$@localhost:5433/node-psql', {
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    sequelize.authenticate()
        .catch(err => console.error('Database connection error: ' + err));

    const Weapon = initWeaponModel(sequelize);
    const Pizza = initPizzaModel(sequelize);
    const Turtle = initTurtleModel(sequelize);

    Weapon.hasMany(Turtle);
    

    Turtle.belongsTo(Pizza, {
        foreignKey: {
            name: 'favoritePizzaId'
        },
        as: 'favoritePizza'
    });
    Pizza.hasMany(Turtle, {
        foreignKey: {
            name: 'favoritePizzaId',
        },
        as: 'favoritePizza'
    });


    Turtle.belongsTo(Pizza, {
        foreignKey: {
            name: 'secondFavoritePizzaId'
        },
        as: 'secondFavoritePizza'
    });
    Pizza.hasMany(Turtle, {
        foreignKey: {
            name: 'secondFavoritePizzaId'
        },
        as: 'secondFavoritePizza'
    });

    sequelize.sync().catch(err => console.error('Models sync error: ' + err));

    return { sequelize, Pizza, Weapon, Turtle };
}

module.exports.connectToDatabase = connectToDatabase;