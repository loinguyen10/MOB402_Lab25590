var express = require("express");
var multer = require("multer");
var expressHbs = require("express-handlebars");
const fs = require('fs');
var app = express();

let uri = 'mongodb+srv://admin:admin@cluster0.o8ogiw5.mongodb.net/User'

const productM = require('./productServer');
const userM = require('./userServer');

app.engine('.hbs', expressHbs.engine({
    extname:"hbs",
    defaultLayout:"main",
    layoutsDir:"views/layouts"
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', '.hbs');

let account = [{
    email: 'admin@admin', pass: 'admin', fullname: 'admin'
}]

//upload
var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './src/upload');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });
//

//dangnhapdangki

app.post("/dangKy", upload.single("avatar"), (req, res) => {
    let email = req.body.emailUp;
    let pass = req.body.passUp;
    let name = req.body.fullname;
    // let avatar = `rsc/${req.file.originalname}`;
    // let id = account.length + 1;
    let newAcc = {
      email: email,
      password: pass,
      fullname: name,
    //   avatar:avatar
    };
    account.push(newAcc);
    res.redirect("/signIn");
  });

app.post('/signIn', (req, res) => {
    console.log(req.body);
    let email = req.body.emailIn;
    let pass = req.body.passIn;
  
    let userFound = account.find(
      (acc) => acc.email === email && acc.pass === pass
    );
    console.log(userFound);
    if (userFound!=undefined) {
        console.log("OK");
        res.redirect('/signIn');
    } else {
        console.log("Fail");
      res.redirect('/');
    }
});

app.get('/signIn',async (req,res) => {
  await mongoose.connect(uri);
  console.log('Ket noi DB thanh cong');

  let userDb = await userM.find({});
  let productDb = await productM.find({});

  console.log("product: \n" + productDb);
  console.log("user: \n" + userDb);

  res.render('main', { layout: 'inside', userDb, productDb, helpers:{
      sum: (a,b) => a+b
  } });
});

app.get('/signUp', (req, res) => {
    res.render('main', {layout : 'signUp'});
})

app.get('/', (req, res) => {
    res.render('main', {layout : 'signIn',content: 'signIn'});
});


//

//them sua xoa user

app.post("/addUser", function (req, res) {
    let name = req.body.userNameAdd;
    let phone = req.body.phoneAdd;
    let id = userData.length + 1;
    let email = req.body.emailAdd;
    let newAcc = {
      id: id,
      username: name,
      email: email,
      phone: phone,
    //   avatar:`rsc/${req.file.originalname}`
    };
    console.log(newAcc);
    userData.push(newAcc);
    fs.writeFileSync('db_user.json', JSON.stringify(userData));
    res.redirect('/signIn')
  });

app.post("/editUser", (req,res) => {
    let name = req.body.userNameEdit;
    let phone = req.body.phoneEdit;
    let id = req.body.phoneEdit;
    let email = req.body.emailEdit;

    const user = userData.find(user => user.id === id);
    user.name = name;
    user.phone = phone;
    user.email = email;

});

app.get('/editU/:id', function (req, res) {
    console.log("OK");
    let user = userData.find((acc) => acc.id === parseInt(req.params.id));
    res.render('./layouts/inside', { user});
  })

  app.delete("/inside/:id", function (req, res) {
    const id = req.params.id;
    const index = userData.findIndex(
        (user) => user.id === parseInt(id)
        );
    if (index >= 0) {
      userData.splice(index, 1);
      res.status(200).send("Deleted successfully");
    } else {
      res.status(404).send("Account not found");
    }
    fs.writeFileSync('db_user.json', JSON.stringify(userData));
  });

//

app.listen(6969, () =>
    console.log('Server started on port 6969')
);