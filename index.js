import express from "express";
import mysql from 'mysql2/promise';
import methodOverride from "method-override";
import path from "node:path";
import { fileURLToPath } from 'url';

const app = express();
const port =3000;

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})

//connection to mysql local server 
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'node_js',
  password:'12345'
});

app.get("/",async (req,res)=>{
    try{
        const [results, fields]= await connection.query("SELECT COUNT(*) as count FROM user");
        res.render("count.ejs" ,{data:results[0].count});
    }catch(err){console.log(err);}
    
});

app.get("/user",async (req,res)=>{
    try{
    const [results,fields]=await connection.query("SELECT * FROM user");
    // console.log(results);
    // console.log(fields);
    res.render("user.ejs",{data:results});
    }catch(err){console.log(err);}
})

app.get("/user/:id",async (req,res)=>{
    let {id}= req.params;
    try{
        const [results,fields] = await connection.query(`SELECT * FROM user WHERE id="${id}"`);
        // console.log(`SELECT * FROM user WHERE id="${id}"`);
        console.log(results);
        console.log(results[0].username);
        res.render("edit.ejs",{data:results[0]});
    }catch(err) {console.log(err);}
})

app.patch("/user/:id",async (req,res)=>{
    let {id}= req.params;
    let {username}=req.body;
    console.log(username);
    try{
        const query = `UPDATE user SET username="${username}" WHERE id="${id}"`;
        const [results,fields] = await connection.query(query);
        // console.log(results);
        // console.log(fields);
    }catch(err) {console.log(err);}
    res.redirect("/user");
})

// connection.end();