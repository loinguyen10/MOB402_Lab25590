var express = require("express");
var app = express();
var mongoose = require('mongoose');
var expressHbs = require("express-handlebars");

let uri = 'mongodb+srv://admin:admin@cluster0.o8ogiw5.mongodb.net/User'

const model = require('./model');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', '.hbs');

app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts"
}));

app.get('/', async (req, res) => {
    await mongoose.connect(uri);
    console.log('Ket noi DB thanh cong');

    let moDel = await model.find({}).lean();

    console.log(moDel);

    res.render('main', { layout: 'upload', moDel });
});

app.post("/add", async (req, res) => {
    let name = req.body.nameAdd;
    let price = req.body.priceAdd;
    let number = req.body.numberAdd;
    let newAcc = {
        name: name,
        price: price,
        number: number,
    };
    console.log(newAcc);

    if (!name || !price || !number) {
        return res.status(400).send('Name, price, and number fields are required');
    }

    try {
        // connect to the database
        await mongoose.connect(uri);
        console.log('Ket noi DB 2 thanh cong');
        await model.create(newAcc);

        await mongoose.disconnect();
        res.redirect('/')
        console.log('Thêm thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const doc = await model.findById(id).lean();
    console.log(id,doc);
    res.render('main' ,{ layout: 'editM' , doc });
});

app.post('/editM/:id', async (req, res) => {
    const id = req.params.id;
    const { name, price, number } = req.body;
    const doc = await model.findByIdAndUpdate(id, { name, price, number }).lean();
    console.log(id,doc);
    res.redirect('/');
});

app.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const doc = await model.findByIdAndDelete(id).lean();
    console.log("Xoa thanh cong: " + id,doc);
    res.redirect('/');
  });

app.listen(3000, () =>
    console.log('Server started on port 3000')
);