const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './uploads';

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir,{recursive:true});
        }
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        let filename = file.originalname;
        arr = filename.split('.');

        let newFilename = '';

        for (let i = 0; i < arr.length; i++) {
            if(i != arr.length - 1){
                newFilename += arr[i];
            }else {
                newFilename +=( '-' + Date.now() + '.' + arr[i]);
            }
        }

        cb(null, newFilename)
    }
})
var upload = multer({storage:storage,limits:{fileSize:1*1024*1024}});
app.get('/',function(req,res){
    res.sendFile(__dirname + '/upload.html');
});
var upload = upload.single('avatar');
app.post('/upload',function(req,res){
    upload(req,res,function(err){
        if(err  instanceof multer.MulterError){
         return   res.end("file ko xác định hoặc file lớn hơn 1MB");
        }
        console.log(req.file);
        res.send("Thành CÔng");
    });
    
});
var uploads = multer({storage:storage});
app.post('/uploadmultiple', uploads.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log(req.file);
    res.send("Thành Công");
})
app.post('/uploadfile', uploads.array('avatar', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    console.log(req.file);
    res.send("Thành Công");
})
app.listen(8080);
