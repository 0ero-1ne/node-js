const express = require('express');
const path = require('path');
const multiparty = require('multiparty');
const fs = require('fs');

const { PizzaService } = require('./services/pizzaService');
const { WeaponService } = require('./services/weaponService');
const { TurtleService } = require('./services/turtleService');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname + '/images/')));
app.use(express.json());

app.get('/', (_, res) => {
    res.redirect('/index?page=1');
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

app.get('/turtles/:page', async (req, res) => {
    const turtles = await TurtleService.getTurtles();
    let page = +req.params.page - 1;
    let result = [];

    for (let i = 3 * page; i < 3 * page + 3; i++) {
        if (turtles[i] !== undefined) {
            result.push(turtles[i]);
        }
    }

    res.send([ turtles.length, result ]);
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname + '/view/upload.html'));
});

app.post('/upload', (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).send('File upload failed');
            return;
        }

        const turtle_id = +fields.turtle_id[0];
        const turtle = await TurtleService.getTurtleById(turtle_id);

        if (typeof turtle === 'string') {
            res.json({ message: `Error: There is no record in Turtles table with id = ${turtle_id}` });
            return;
        }

        const file = files.fileInput[0];
        const tempPath = file.path;
        const fileName = 'turtle_' + turtle_id + '.' + file.originalFilename.slice(file.originalFilename.lastIndexOf('.') + 1);
        
        const updatedTurtle = await TurtleService.updateImage(turtle_id, fileName);

        const targetPath = path.join(__dirname, 'images', fileName);

        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                res.status(500).send('File upload failed');
            } else {
                res.send('File uploaded successfully');
            }
        });
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 400, message: err.message });
    }
    next();
});

// PIZZA API

app.get('/pizza/transaction', async (req, res) => {
    const pizzas = await PizzaService.transaction();

    if (typeof pizzas === 'string') {
        res.json({ message: pizzas });
        return;
    }

    res.json({ message: `Number of updated rows: ${pizzas[0]}`});
});

app.get('/api/pizzas', async (req, res) => {
    let pizzas = null;

    if (req.query.calories) {
        pizzas = await PizzaService.getPizzasByCalories(req.query.calories);
    } else {
        pizzas = await PizzaService.getPizzas();
    }
    
    if (typeof pizzas === 'string') {
        res.json({ message: pizzas });
        return;
    }

    res.send(pizzas);
});

app.get('/api/pizzas/:id', async (req, res) => {
    const pizza = await PizzaService.getPizzaById(req.params.id);

    if (typeof pizza === 'string') {
        res.json({ message: pizza });
        return;
    }

    res.send(pizza);
});

app.post('/api/pizzas', async (req, res) => {
    const pizza = await PizzaService.savePizza(req.body);
    
    if (typeof pizza === 'string') {
        res.json({ message: pizza });
        return;
    }

    res.send(pizza);
});

app.put('/api/pizzas', async (req, res) => {
    const pizza = await PizzaService.updatePizza(req.body);
    
    if (typeof pizza === 'string') {
        res.json({ message: pizza });
        return;
    }

    res.json({ message: `Number of updated rows: ${pizza[0]}`});
});

app.delete('/api/pizzas', (req, res) => {
    res.json({ message: 'Error: Id parameter is not specified, try /api/pizzas/:id to delete record' });
})

app.delete('/api/pizzas/:id', async (req, res) => {
    const pizza = await PizzaService.deletePizza(req.params.id);
    
    if (typeof pizza === 'string') {
        res.json({ message: pizza });
        return;
    }

    res.json({ message: `Number of deleted rows: ${pizza}` });
})

// WEAPON API

app.get('/api/weapons', async (req, res) => {
    let weapons = null;

    if (req.query.dps) {
        weapons = await WeaponService.getWeaponsByDPS(req.query.dps);
    } else {
        weapons = await WeaponService.getWeapons();
    }
    
    if (typeof weapons === 'string') {
        res.json({ message: weapons });
        return;
    }

    res.send(weapons);
});

app.get('/api/weapons/:id', async (req, res) => {
    const weapon = await WeaponService.getWeaponById(req.params.id);

    if (typeof weapon === 'string') {
        res.json({ message: weapon });
        return;
    }

    res.send(weapon);
});

app.post('/api/weapons', async (req, res) => {
    const weapon = await WeaponService.saveWeapon(req.body);
    
    if (typeof weapon === 'string') {
        res.json({ message: weapon });
        return;
    }

    res.send(weapon);
});

app.put('/api/weapons', async (req, res) => {
    const weapon = await WeaponService.updateWeapon(req.body);
    
    if (typeof weapon === 'string') {
        res.json({ message: weapon });
        return;
    }

    res.json({ message: `Number of updated rows: ${weapon[0]}`});
});

app.delete('/api/weapons', (req, res) => {
    res.json({ message: 'Error: Id parameter is not specified, try /api/weapons/:id to delete record' });
})

app.delete('/api/weapons/:id', async (req, res) => {
    const weapon = await WeaponService.deleteWeapon(req.params.id);
    
    if (typeof weapon === 'string') {
        res.json({ message: weapon });
        return;
    }

    res.json({ message: `Number of deleted rows: ${weapon}` });
})

// TURTLE API

app.get('/api/turtles', async (req, res) => {
    let turtles = null;

    if (req.query.favoritePizza) {
        turtles = await TurtleService.getTurtlesByFavoritePizza(req.query.favoritePizza);
    } else {
        turtles = await TurtleService.getTurtles();
    }
    
    if (typeof turtles === 'string') {
        res.json({ message: turtles });
        return;
    }

    res.send(turtles);
});

app.get('/api/turtles/:id', async (req, res) => {
    const turtle = await TurtleService.getTurtleById(req.params.id);

    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.send(turtle);
});

app.post('/api/turtles', async (req, res) => {
    const turtle = await TurtleService.saveTurtle(req.body);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.send(turtle);
});

app.put('/api/turtles', async (req, res) => {
    const turtle = await TurtleService.updateTurtle(req.body);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.put('/api/turtles/favoritePizzaBind', async (req, res) => {
    const turtle = await TurtleService.bindFavoritePizza(req.body, false);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.delete('/api/turtles/favoritePizzaUnbind', async (req, res) => {
    const turtle = await TurtleService.bindFavoritePizza(req.body, true);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.put('/api/turtles/secondFavoritePizzaBind', async (req, res) => {
    const turtle = await TurtleService.bindSecondFavoritePizza(req.body, false);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.delete('/api/turtles/secondFavoritePizzaUnbind', async (req, res) => {
    const turtle = await TurtleService.bindSecondFavoritePizza(req.body, true);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.put('/api/turtles/weaponBind', async (req, res) => {
    const turtle = await TurtleService.bindWeapon(req.body, false);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.delete('/api/turtles/weaponUnbind', async (req, res) => {
    const turtle = await TurtleService.bindWeapon(req.body, true);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of updated rows: ${turtle[0]}`});
});

app.delete('/api/turtles/:id', async (req, res) => {
    const turtle = await TurtleService.deleteTurtle(req.params.id);
    
    if (typeof turtle === 'string') {
        res.json({ message: turtle });
        return;
    }

    res.json({ message: `Number of deleted rows: ${turtle}` });
})

app.listen(port, () => console.log(`Server on ${port} port`));