var express = require("express");
var multer = require("multer");
var expressHbs = require("express-handlebars");
var app = express();

app.engine('.hbs', expressHbs.engine({
    extname: "hbs"
}));

app.set('view engine', '.hbs');

var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './upload');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + " - " + file.originalname);
    }
});

var upload = multer({ storage: storage });

app.post('/uploadSingle',upload.single("avatar"),function(req,res){
    console.log(req.file);
    res.send('Done');
});

app.post('/uploadMulti', upload.array('avatar', 12), (req, res, next) => {
    console.log(req.files);
    if (!req.files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send('Done');
})

app.get('/', function (res, res) {
    res.render('upload');
});

app.listen(3000, () =>
    console.log('Server started on port 3000')
);