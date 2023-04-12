const express = require('express');
const router = express.Router();
var mongoose = require('mongoose');

const userM = require('../../userServer');

router.post("/addUser", async (req, res) => {
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
        res.redirect('/signIn');
        console.log('Thêm thành công');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

router.get('/editU/:id', async (req, res) => {
    const id = req.params.id;
    const doc = await userM.findById(id).lean();
    console.log(id, doc);
    res.render('main', { layout: 'editUser', doc });
})

router.post('/editUser/:id', async (req, res) => {
    const id = req.params.id;
    const { username, email, phone } = req.body;
    const doc = await userM.findByIdAndUpdate(id, { username, email, phone }).lean();
    console.log(id, doc);
    res.redirect('/signIn');
});

router.delete("/inside/:id", async function (req, res) {
    const id = req.params.id;
    const doc = await userM.findByIdAndDelete(id).lean();
    console.log("Xoa thanh cong: " + id, doc);
    res.redirect('/signIn');
});

module.exports = router;