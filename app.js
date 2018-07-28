
const express = require('express');

const ejs = require('ejs');

//加载path模块，path模块中包含许多处理文件路径的工具
const path = require('path');

//创建一个express实例
let app = express();

//注册模板文件的后缀名为html，默认为ejs
app.engine('html', ejs.__express);

app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'html');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var mysql = require('mysql');
var connection = mysql.createConnection({
	host : '192.168.3.40',
	user : 'sycf',
	password : '000000',
	database : 'homestead'
})

//路由挂载
app.get('/', function(req, res) {
    var sql = 'select id,category_name,status,create_date from category';
	
	connection.query(sql,function(error,result){
		console.log(result);
		res.render('list', {
	        title: '类别列表',
	        content: 'Welcome to the list page.',
	        list: result
    	});
	});
});

app.get('/article/:id', function(req, res) {
    var id = req.params.id;
    var sql = 'select id,category_name,status from category where id=?';
    var sql_params = id;
    
    connection.query(sql,sql_params,function(error,result){
    	console.log(result);	
    	
    	res.render('article', {
	        title: '类别详情',
	        content: 'Welcome to the list page.',
	        category: result
    	});	
    });
});

app.get('/add', function(req, res) {
    res.render('add', {
        title: 'add',
        content: 'Welcome to the add page.'
    });
});

app.post('/insert', urlencodedParser, function(req, res) {
    var category_name = req.body.category_name;
	var category_status = req.body.category_status;
	
	var sql = 'insert into category (category_name,status,create_date) values (?,?,?)';
	var sql_params = [category_name,category_status,new Date().getTime()/1000];
	
	connection.query(sql,sql_params,function(error,result){
		if (error){
			console.log('[select error] -',error.message);
			return;
		}
		console.log(result);
		res.redirect('/');	
	});
});

app.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    var sql = 'delete from category where id=?';
    var sql_params = id;
    
    connection.query(sql,sql_params,function(error,result){
    	console.log(id);	
    	res.redirect('/');	
    });
});

app.post('/update', urlencodedParser, function(req, res) {
	var category_id = req.body.category_id;
    var category_name = req.body.category_name;
	var category_status = req.body.category_status;
	
	var sql = 'update category set category_name=?,status=? where id=?';
	var sql_params = [category_name,category_status,category_id];
	
	connection.query(sql,sql_params,function(error,result){
		if (error){
			console.log('[select error] -',error.message);
			return;
		}
		console.log(result);
		res.redirect('/');	
	});
});

app.get('/blog/list', function(req, res) {
	var sql = 'select id,category_id,title,create_date from blog order by create_date desc';
	
	connection.query(sql,function(error,result){
		console.log(result);
		res.render('blog/list', {
	        title: '博客列表',
	        content: 'Welcome to the list page.',
	        list: result
    	});
	});
});

app.get('/blog/add', function(req, res) {
	var sql = 'select id,category_name from category';
	
    connection.query(sql,function(error,result){
		if (error){
			console.log('[select error] -',error.message);
			return;
		}
		res.render('blog/add', {
        	title: 'add',
        	content: 'Welcome to the add page.',
        	categories: result
    	});
	});
});

app.post('/blog/insert', urlencodedParser, function(req, res) {
	var category_id = req.body.category_id;
	var category_status = req.body.category_status;
	var title = req.body.title;
	var content = req.body.content;
	
	var sql = 'insert into blog (category_id,title,content,status,create_date) values (?,?,?,?,?)';
	var sql_params = [category_id,title,content,category_status,new Date().getTime()/1000];
	
	connection.query(sql,sql_params,function(error,result){
		if (error){
			console.log('[select error] -',error.message);
			return;
		}
		console.log(result);
		res.redirect('/blog/list');	
	});
});

app.listen(8888);
console.log("The server is running on 8888");