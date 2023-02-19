import express from "express";
import __dirname from "./utils.js";
import prodRouter from "./routes/products.router.js";
import uploader from "./services/upload.js";
import Contenedor from "./metodos.js";

const app = express();

const server = app.listen(8080,()=> console.log("Ejecutando express"))

app.set("views", `${__dirname}/views`);

app.set("view engine", "ejs");

app.use(express.json()); 

app.use(express.urlencoded({ extended:true }));

app.use(express.static(__dirname + "/public"));

app.use("/api/productos", prodRouter);

const contenedor = new Contenedor("productos")

app.get("/", (req,res)=> {
    res.render("formulario")
})

app.get("/productos", async (req,res)=> {
    const arrayProducts = await contenedor.getAll()
    res.render("productosUpload", {arrayProducts})
})

app.post("/productos", uploader.single("image"), async (req,res) => {
    const producto = req.body;
    producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
    await contenedor.save(producto)
    res.redirect("/") 
})