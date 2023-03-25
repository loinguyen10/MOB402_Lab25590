var express = require("express");
var multer = require("multer");
var expressHbs = require("express-handlebars");
const fs = require('fs');
var app = express();

const userData = JSON.parse(fs.readFileSync('db_user.json', 'utf-8'));
const productData = JSON.parse(fs.readFileSync('db_product.json', 'utf-8'));

app.engine('.hbs', expressHbs.engine({
    extname:"hbs",
    defaultLayout:"main",
    layoutsDir:"views/layouts"
}));

app.use(
    express.urlencoded({
      extended: true,
    })
  );
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

app.get('/signIn',(req,res) => {
    res.render('main', {layout : 'inside' , userData, productData});
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

//

app.listen(6969, () =>
    console.log('Server started on port 6969')
);