const pizzas = [
    {
        name: 'Pepperoni',
        calories: 494
    },
    {
        name: 'Margherita',
        calories: 275
    },
    {
        name: 'Four Cheese',
        calories: 699
    },
    {
        name: 'Four Seasons',
        calories: 350
    }
];

const weapons = [
    {
        name: 'Katana',
        dps: 10
    },
    {
        name: 'Nunchaki',
        dps: 10
    },
    {
        name: 'Bō staff',
        dps: 10
    },
    {
        name: 'Iron dome',
        dps: 10
    }
];

const turtles = [
    {
        name: 'Mikelangelo',
        color: 'Orange',
        WeaponId: 2,
        favoritePizzaId: 1,
        secondFavoritePizzaId: 3,
        image: null
    },
    {
        name: 'Leonardo',
        color: 'Blue',
        WeaponId: 1,
        favoritePizzaId: 1,
        secondFavoritePizzaId: 3,
        image: null
    },
    {
        name: 'Donatello',
        color: 'Purple',
        WeaponId: 3,
        favoritePizzaId: 1,
        secondFavoritePizzaId: 4,
        image: null
    },
    {
        name: 'Raphael',
        color: 'Red',
        WeaponId: 4,
        favoritePizzaId: 1,
        secondFavoritePizzaId: 2,
        image: null
    }
];

module.exports = [ pizzas, weapons, turtles ];