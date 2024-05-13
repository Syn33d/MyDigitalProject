//api expres connect mysql dar table test_column host localhost user adminDAR password admin 3306
var express = require('express');
var mysql = require('mysql');
var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'adminDAR',
    password: 'admin',
    database: 'test_column'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
});

//get all data
app.get('/data', function(req, res) {
    connection.query('SELECT * FROM test_column', function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
});

app.listen(3000, function() {
    console.log('Node app is running on port 3000');
}
);

// Path: darBack/apiBDD.js