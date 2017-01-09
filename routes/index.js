var express = require('express');
var router = express.Router();
var mysql = require("mysql");


/* GET home page. */
router.get('/', function(req, res, next) {

  // var con = mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   password: "sqlpass"
  // });
  //
  // con.connect(function(err){
  //   if(err){
  //     console.log('Error connecting to Db');
  //     return;
  //   }
  //   console.log('Connection established');
  // });
  //
  // con.end(function(err) {
  //   // The connection is terminated gracefully
  //   // Ensures all previously enqueued queries are still
  //   // before sending a COM_QUIT packet to the MySQL server.
  // });



  res.render('index', { title: 'Express' });
});

router.get('/classes', function(req, res, next) {
  res.json({
	classes: [
	  {
		dept: 'CS',
		num: 2112,
	  },
	  {
		dept: 'AEM',
		num: 4820,
	  },
    ],
  });
});


module.exports = router;
