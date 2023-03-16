var express = require('express');
var multer = require('multer');
var app =  express();

var storage = multer.diskStorage({
destination:function (req,file,callback) {
    callback(null,'')
},
filename:function (req,file,callback) {
    callback(null,file.originalname);
}
});

var upload  = multer({
    storage:storage
}).single('mefile');
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.post('/upload',function(req,res){
    upload(req,res,function(err){
        if(err){
         return res.end("Loi");
        }
        res.end("Thanh cong")
    });
});

app.listen(6969)