const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const fs=require('fs');
const app=express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({secret:'ultra_agriturismo',resave:false,saveUninitialized:true}));

const ADMIN={user:'admin',pass:'1234'};

function read(p){return JSON.parse(fs.readFileSync(p));}
function write(p,d){fs.writeFileSync(p,JSON.stringify(d,null,2));}

app.get('/',(req,res)=>res.render('index',{prodotti:read('data/prodotti.json')}));
app.get('/shop',(req,res)=>res.render('shop',{prodotti:read('data/prodotti.json')}));

app.post('/ordine',(req,res)=>{
let ordini=read('data/ordini.json');
ordini.push(req.body);
write('data/ordini.json',ordini);
res.redirect('/shop');
});

app.get('/login',(req,res)=>res.render('login'));
app.post('/login',(req,res)=>{
if(req.body.user===ADMIN.user && req.body.pass===ADMIN.pass){
req.session.admin=true;
return res.redirect('/admin');
}
res.redirect('/login');
});

app.get('/admin',(req,res)=>{
if(!req.session.admin)return res.redirect('/login');
res.render('admin',{prodotti:read('data/prodotti.json'),ordini:read('data/ordini.json')});
});

app.post('/add-prodotto',(req,res)=>{
if(!req.session.admin)return res.redirect('/login');
let prodotti=read('data/prodotti.json');
prodotti.push(req.body);
write('data/prodotti.json',prodotti);
res.redirect('/admin');
});

app.listen(3000,()=>console.log('http://localhost:3000'));
