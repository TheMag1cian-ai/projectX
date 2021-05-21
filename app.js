var express = require('express');
var expressSession = require('express-session');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

var app = express();

// var db = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'Debu0210#',
// 	database: 'projectX',
// 	debug: false,
// 	multipleStatements: true
// });

var db = mysql.createConnection({
	host: 'bzw0xcezuqhgcxwp05lj-mysql.services.clever-cloud.com',
	user: 'uzv1g8gja2s0og5h',
	password: 'TAW8x1z3Zyz25YlJiYV5',
	database: 'bzw0xcezuqhgcxwp05lj',
	debug: false,
	multipleStatements: true
});

db.connect(function(err){
	if(err) {
		throw err;
	}
	console.log('database connected!!');
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({secret: 'my top secret code', saveUninitialized: true, resave: false}));
// app.use('/assets',express.static('assets'));
app.use(express.static(__dirname + '/assets'));

// auth
app.get('/', function(req, res) {
	if(req.session.auth === undefined) {
		req.session.auth = 0;
	}

	if(req.session.auth === 0) {
		res.render('home');
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/cv');
	}
	else if(req.session.auth === 3) {
		res.redirect('/user');
	}
});

// app.get('/', function(req, res) {
// 	if(req.session.auth === undefined) {
// 		req.session.auth = 0;
// 	}

// 	res.redirect('/login');
// });

app.get('/register', function(req, res) {
	if(req.session.auth === undefined) {
		req.session.auth = 0;
	}

	if(req.session.auth === 0) {
		res.render('register');
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/cv');
	}
	else if(req.session.auth === 3) {
		res.redirect('/user');
	}
});

app.post('/register', function(req, res) {
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	var data = `SELECT * FROM login WHERE email = '${email}'`;
	var query = db.query(data, function(err, result) {
		if(err) {
			throw err;
		}
		else if(result.length > 0) {
			res.redirect('/eae');
		}
		else if(result.length === 0) {
			bcrypt.hash(password, 10).then(function(hash) {
		    	var data = `INSERT INTO login VALUES ('${name}', '${email}', '${hash}', '3')`;
		    	var query = db.query(data, function(err, result) {
		    		if(err) {
		    			throw err;
		    		}
		    		else {
		    			res.redirect('/');
		    		}
		    	});
			});
		}
	});
});

app.get('/login', function(req, res) {
	if(req.session.auth === undefined) {
		req.session.auth = 0;
	}

	if(req.session.auth === 0) {
		res.render('login');
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/cv');
	}
	else if(req.session.auth === 3) {
		res.redirect('/user');
	}
});

app.post('/login', function(req, res) {
	if(req.session.auth === 0) {
		var email = req.body.email;
		req.session.rem = email;
		var password = req.body.password;
		var data = `SELECT * FROM login WHERE email = '${email}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				if(result.length === 0) {
					res.redirect('/nouser');
				}

				else {
					bcrypt.compare(password, result[0]['password']).then(function(result1) {
						if(result[0]['id'] === 1) {
							if(result1) {
								req.session.auth = 1;
								res.redirect('/admin');
								count = 1;
							}
							else {
								res.redirect('/nouser');
							}
						}

						else if(result[0]['id'] === 2) {
							if(result1) {
								req.session.auth = 2;
								res.redirect('/cv');
								count = 1;
							}
							else {
								res.redirect('/nouser');
							}
						}

						else if(result[0]['id'] === 3) {
							if(result1) {
								req.session.auth = 3;
								res.redirect('/user');
								count = 1;
							}
							else {
								res.redirect('/nouser');
							}
						}
					});
				}
			}
		});
	}
	else if(req.session.auth === 1) {
		res.redirect('/admin');
	}
	else if(req.session.auth === 2) {
		res.redirect('/cv');
	}
	else if(req.session.auth === 3) {
		res.redirect('/user');
	}
});

// admin
app.get('/admin', function(req, res) {
	if(req.session.auth === 1) {
		var data = `SELECT name FROM login WHERE email = '${req.session.rem}';SELECT COUNT(*) AS cv FROM login WHERE id = '2';SELECT COUNT(*) AS nc FROM dustbin WHERE height > 70 OR moisture > 70 OR report > 0;SELECT SUM(height) AS hs FROM dustbin;SELECT SUM(moisture) AS ms FROM dustbin;SELECT COUNT(*) AS hc FROM dustbin WHERE height > '70';SELECT COUNT(*) AS mc FROM dustbin WHERE moisture > '70';SELECT COUNT(*) AS rc FROM dustbin WHERE report > 0`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('admin', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/admin_cv', function(req, res) {
	if(req.session.auth === 1) {
		var data = `SELECT * FROM login WHERE id = '2'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('admin_cv', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.post('/admin_cv', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;


	var raw_data = `SELECT * FROM login WHERE email = '${email}'`;
	var raw_query = db.query(raw_data, function(raw_err, raw_result) {
		if(raw_err) {
			throw raw_err;
		}
		else {
			if(raw_result.length === 0) {
				var data = `SELECT * FROM login WHERE email = '${email}'`;
				var query = db.query(data, function(err, result) {
					if(err) {
						throw err;
					}
					else {
						if(result.length === 0) {
							bcrypt.hash(password, 10).then(function(hash) {
						    	var data = `INSERT INTO login VALUES ('${name}', '${email}', '${hash}', '2')`;
						    	var query = db.query(data, function(err, result) {
						    		if(err) {
						    			throw err;
						    		}
						    		else {
						    			res.redirect('/admin_cv');
						    		}
						    	});
							});
						}
						else {
							res.redirect('/eae');
						}
					}
				});
			}
			else {
				res.redirect('cv_exist');
			}
		}
	});
});

// cv
app.get('/cv', function(req, res) {
	if(req.session.auth === 2) {
		var data = `SELECT name FROM login WHERE email = '${req.session.rem}';SELECT COUNT(*) AS aa FROM dustbin WHERE alert > 0;SELECT COUNT(*) AS nc FROM dustbin WHERE height > 70 OR moisture > 70 OR report > 0;SELECT SUM(height) AS hs FROM dustbin;SELECT SUM(moisture) AS ms FROM dustbin;SELECT COUNT(*) AS hc FROM dustbin WHERE height > '70';SELECT COUNT(*) AS mc FROM dustbin WHERE moisture > '70';SELECT COUNT(*) AS rc FROM dustbin WHERE report > 0`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('cv', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

// user
app.get('/user', function(req, res) {
	if(req.session.auth === 3) {
		var data = `SELECT name FROM login WHERE email = '${req.session.rem}';SELECT SUM(height) AS hs FROM dustbin;SELECT SUM(moisture) AS ms FROM dustbin;SELECT COUNT(*) AS hc FROM dustbin WHERE height > '70';SELECT COUNT(*) AS mc FROM dustbin WHERE moisture > '70'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('user', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});


// common
app.get('/dustbin', function(req, res) {
	if(req.session.auth === 1 || req.session.auth === 2 || req.session.auth === 3) {
		var data = `SELECT * FROM dustbin;SELECT name FROM login WHERE email = '${req.session.rem}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				var t_result = [req.session.auth];
				t_result.push(result);
				res.render('dustbin', {result: t_result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/profile', function(req, res) {
	if(req.session.auth === 1 || req.session.auth === 2 || req.session.auth === 3) {
		var data = `SELECT * FROM login WHERE email = '${req.session.rem}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('profile', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.post('/profile', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

	if(password === 'projectX') {
		var data = `UPDATE login SET name = '${name}' WHERE email = '${email}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.redirect('/');
			}
		});
	}
	else {
		bcrypt.hash(password, 10).then(function(hash) {
		    var data = `UPDATE login SET name = '${name}', password = '${hash}' WHERE email = '${email}'`;
		   	var query = db.query(data, function(err, result) {
		   		if(err) {
		   			throw err;
		   		}
		   		else {
		   			res.redirect('/');
		   		}
		   	});
		});
	}
});

app.get('/notification', function(req, res) {
	if(req.session.auth === 1 || req.session.auth === 2) {
		var data = `SELECT * FROM login WHERE email = '${req.session.rem}';SELECT * FROM dustbin`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('notification', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/alert/:id/:status', function(req, res) {
	if(req.session.auth === 1) {
		var id = req.params.id;
		var status = req.params.status;

		if(status === '0') {
			var data = `UPDATE dustbin SET alert = '1' WHERE id = '${id}'`;
			var query = db.query(data, function(err, result) {
				if(err) {
					throw err;
				}
				else {
					res.redirect('/notification');
				}
			});
		}
		else if(status === '1') {
			var data = `UPDATE dustbin SET alert = '0' WHERE id = '${id}'`;
			var query = db.query(data, function(err, result) {
				if(err) {
					throw err;
				}
				else {
					res.redirect('/notification');
				}
			});
		}
	}
	else {
		res.redirect('/');
	}
});

app.get('/reset/:id', function(req, res) {
	if(req.session.auth === 1) {
		var id = req.params.id;
		var data = `UPDATE dustbin SET report = '0' WHERE id = '${id}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.redirect('/notification');
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/report/:id', function(req, res) {
	if(req.session.auth === 3) {
		var id = req.params.id;
		var data = `UPDATE dustbin SET report = report + '1' WHERE id = '${id}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.redirect('/dustbin');
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/edit', function(req, res) {
	if(req.session.auth === 1) {
		var data = `SELECT name FROM login WHERE email = '${req.session.rem}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.render('edit', {result: result});
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.post('/edit', function(req, res) {
	var id = req.body.id;
	var height = req.body.height;
	var moisture = req.body.moisture;
	var status = '';

	if(height > 90 || moisture > 90) {
		status = '#e74a3b';
	}
	else if(height > 70 || moisture > 70) {
		status = '#f6c23e';
	}
	else {
		status = '#1cc88a';
	}

	var data = `UPDATE dustbin SET height = '${height}', moisture = '${moisture}', status = '${status}' WHERE id = '${id}'`;
	var query = db.query(data, function(err, result) {
		if(err) {
			throw err;
		}
		else {
			res.redirect('/admin');
		}
	});
});

app.get('/remove_cv/:email', function(req, res) {
	if(req.session.auth === 1) {
		var email = req.params.email;
		var data = `DELETE FROM login WHERE email = '${email}'`;
		var query = db.query(data, function(err, result) {
			if(err) {
				throw err;
			}
			else {
				res.redirect('/admin_cv');
			}
		});
	}
	else {
		res.redirect('/');
	}
});

app.get('/logout', function(req, res) {
	req.session.auth = 0;
	res.redirect('/');
});

// error
app.get('/eae', function(req, res) {
	res.render('error', {result:'Email already exist!!'});
});

app.get('/nouser', function(req, res) {
	res.render('error', {result:'No such User exist!!'});
});

app.get('/cv_exist', function(req, res) {
	if(req.session.auth === 1) {
		res.render('error', {result: 'Email already exist!!'});
	}
	else {
		res.redirect('/');
	}
});

app.listen(process.env.PORT, function(req, res) {
	console.log('server started!!')
});
