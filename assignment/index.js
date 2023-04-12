var express = require("express");
var multer = require("multer");
var expressHbs = require("express-handlebars");
const fs = require('fs');
var mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
var app = express();

let uri = 'mongodb+srv://admin:admin@cluster0.o8ogiw5.mongodb.net/User'

const productM = require('./productServer');
const userM = require('./userServer');

app.engine('.hbs', expressHbs.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: "views/layouts"
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.set('view engine', '.hbs');

let account = [{
  email: 'admin@admin', pass: 'admin', fullname: 'admin', avatar: 0, role: "admin",
}]

//upload
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
      cb(null, './image');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + " - " + file.originalname);
  }
});

var upload = multer({ storage: storage });
//

//dangnhapdangki

app.post("/dangKy", upload.single("avatar"), async (req, res) => {
  let email = req.body.emailUp;
  let pass = req.body.passUp;
  let name = req.body.fullname;
  let avatar = `image/` + Date.now() + " - " + `${req.file.originalname}`;
  let role = req.body.role;

  console.log(avatar);

  let newAcc = {
    email: email,
    password: pass,
    fullname: name,
    phone: "098",
    avatar: avatar,
    role: role,
  };

  console.log(newAcc);
  try {
    // connect to the database
    await mongoose.connect(uri);
    console.log('Ket noi DB 2 thanh cong');
    await userM.create(newAcc);
    await mongoose.disconnect();
    res.redirect('/');
    console.log('Đăng ký thành công');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.post('/signIn', async (req, res) => {
  console.log(req.body);
  let email = req.body.emailIn;
  let pass = req.body.passIn;

  try {
    // connect to the database
    await mongoose.connect(uri);
    console.log('Ket noi DB 2 thanh cong');
    const userFound = await userM.findOne({ email: email, password: pass });

    console.log(userFound);

    if (userFound) {
      res.cookie('user',userFound);
      console.log("OK");
      if(userFound.role == "admin"){
        console.log(userFound.role);
        res.redirect('/signIn/AllUsers');
      }else{
        res.redirect('/signIn/AllProducts');
      }
    } else {
      console.log("Fail");
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/signIn/AllUsers',async (req, res) => {
  let userData = await userM.find({}).lean();
  console.log("user: \n" + userData);
  console.log(req.cookies.user);
  console.log(req.headers.referer);
  res.render('main', { layout: 'member', userData });
});

app.get('/signIn/AllProducts',async (req, res) => {
  let productData = await productM.find({}).lean();

  console.log("product: \n" + productData);

  res.render('main', { layout: 'product', productData });
});

app.get('/signUp', (req, res) => {
  res.render('main', { layout: 'signUp' });
})

app.get('/', (req, res) => {
  res.render('main', { layout: 'signIn', content: 'signIn' });
});

//
app.post("/addUser", async (req, res) => {
  let name = req.body.userNameAdd;
  let phone = req.body.phoneAdd;
  let email = req.body.emailAdd;
  let pass = req.body.passAdd;
  let newAcc = {
    username: name,
    email: email,
    phone: phone,
    password: pass,
    //   avatar:`rsc/${req.file.originalname}`
  };
  console.log(newAcc);
  try {
    // connect to the database
    await mongoose.connect(uri);
    console.log('Ket noi DB 2 thanh cong');
    await userM.create(newAcc);

    await mongoose.disconnect();
    res.redirect('/signIn/AllUsers');
    console.log('Thêm thành công');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/editU/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await userM.findById(id).lean();
  console.log(id, doc);
  res.render('main', { layout: 'editUser', doc });
})

app.post('/editUser/:id', async (req, res) => {
  const id = req.params.id;
  const { username, email, phone } = req.body;
  const doc = await userM.findByIdAndUpdate(id, { username, email, phone }).lean();
  console.log(id, doc);
  res.redirect('/signIn/AllUsers');
});

app.delete("/deleteU/:id", async function (req, res) {
  const id = req.params.id;
  const doc = await userM.findByIdAndDelete(id).lean();
  console.log("Xoa thanh cong: " + id, doc);
  res.redirect('/signIn/AllUsers');
});

//

//
app.post("/addProduct", async (req, res) => {
  let name = req.body.userNameAdd;
  let phone = req.body.phoneAdd;
  let email = req.body.emailAdd;
  let newAcc = {
    username: name,
    email: email,
    phone: phone,
    //   avatar:`rsc/${req.file.originalname}`
  };
  console.log(newAcc);
  try {
    // connect to the database
    await mongoose.connect(uri);
    console.log('Ket noi DB 2 thanh cong');
    await userM.create(newAcc);

    await mongoose.disconnect();
    res.redirect('/signIn/AllProducts');
    console.log('Thêm thành công');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/editP/:id', async (req, res) => {
  const id = req.params.id;
  const doc = await userM.findById(id).lean();
  console.log(id, doc);
  res.render('main', { layout: 'editUser', doc });
})

app.post('/editProduct/:id', async (req, res) => {
  const id = req.params.id;
  const { username, email, phone } = req.body;
  const doc = await userM.findByIdAndUpdate(id, { username, email, phone }).lean();
  console.log(id, doc);
  res.redirect('/signIn/AllProducts');
});

app.delete("/deleteP/:id", async function (req, res) {
  const id = req.params.id;
  const doc = await userM.findByIdAndDelete(id).lean();
  console.log("Xoa thanh cong: " + id, doc);
  res.redirect('/signIn/AllProducts');
});

//

app.listen(6969, () =>
  console.log('Server started on port 6969')
);