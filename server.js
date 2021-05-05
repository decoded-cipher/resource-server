var express = require('express');
var upload = require('express-fileupload');
var path = require('path');
var hbs = require('express-handlebars');
var mysql = require('mysql');

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
app.use(express.static(__dirname, +'public'));


// ------------------------------------------------------------------

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'resource-server'
})

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Database connected...');
});

// ------------------------------------------------------------------


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/upload', (req, res) => {
    res.render('file-upload');
});

app.post('/upload', (req, res) => {
    var uploadMsg;
    if (req.files) {
        // console.log(req.files);

        var file = req.files.file;
        // console.log(file.name);

        var fileSize = (file.size / 1024 / 1024).toFixed(2)
        // console.log(fileSize);

        if (req.body.fileName) {
            var fileExt = file.name.split('.').pop();
            // console.log(fileExt);
            file.name = req.body.fileName + '.' + fileExt
        }

        var data = {
            res_name: req.body.fileName,
            res_filesize: fileSize,
            res_desc: req.body.fileDescription,
            res_file: file.name
        }
        var sql = `INSERT INTO resources SET ?`
        var query = db.query(sql, data, (err, result) => {
            if (!err) {
                console.log(result);
            }
            file.mv('./uploads/' + file.name, (err) => {
                // res.send('File Uploaded')
                uploadMsg = 'File Uploaded Successfully!';
                res.render('upload-result', {
                    uploadMsg
                });
            })
        })

    } else {
        uploadMsg = 'Oops! No files selected for uploading!';
        res.render('upload-result', {
            uploadMsg
        });
    }
})

app.get('/file-list', (req, res) => {

    var sql = `SELECT * FROM resources`;
    var query = db.query(sql, (err, result) => {
        if (!err) {
            console.log(result);
            res.render('file-list', {
                result
            });
        }
    })
})

app.listen(3000);