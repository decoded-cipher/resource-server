var express = require('express');
var upload = require('express-fileupload');
var path = require('path');
var hbs = require('express-handlebars');

var app = express();
app.use(upload());

app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, + 'public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/upload', (req, res) => {
    res.render('file-upload');
});

app.post('/upload', (req, res) => {
    var uploadMsg;
    if(req.files) {
        // console.log(req.files);

        var file = req.files.file;
        // console.log(file.name);

        if(req.body.fileName) {
            var fileExt = file.name.split('.').pop();
            // console.log(fileExt);
            file.name = req.body.fileName + '.' + fileExt
        }

        file.mv('./uploads/' + file.name, (err) => {
            // res.send('File Uploaded')
            uploadMsg = 'File Uploaded Successfully!';
            res.render('upload-result', {uploadMsg});
        })
    } else {
        uploadMsg = 'Oops! No files selected for uploading!';
        res.render('upload-result', {uploadMsg});
    }
})

app.listen(3000);