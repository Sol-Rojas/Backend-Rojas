import express from "express";
import __dirname from "./utils.js"
import prodRouter from "./routes/products.router.js"

const app = express();

const server = app.listen(8080,()=> console.log("Ejecutando express"))

app.use(express.json()); 

app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname + "/public"));

app.use("/api/productos", prodRouter);