import express from "express";
import Contenedor from "./metodos.js";

const app = express();

const server = app.listen(8080,()=> console.log("Ejecutando express"))

const producto1 = {
    name: "Producto 1",
    price: 400,
    img: "https://dummyimage.com/600x400/5ba1ba/ffffff&text=Hello+world"
}

const producto2 = {
    name: "Producto 2",
    price: 400,
    img: "https://dummyimage.com/600x400/5ba1ba/ffffff&text=Hello+world"
}

const producto3 = {
    name: "Producto 3",
    price: 400,
    img: "https://dummyimage.com/600x400/5ba1ba/ffffff&text=Hello+world"
}

const contenedor = new Contenedor("products") 

const getProducts = async () => { 
    let productos = await contenedor.getAll()
    if (productos.length === 0) {
        await contenedor.save(producto1)
        contenedor.save(producto2)
        await contenedor.save(producto3) 
        productos = await contenedor.getAll()
    }
    return productos
}

// Ruta para devolver un array con todos los productos 
app.get("/productos", async (req, res) => {
    const productos = await getProducts()
    res.send(productos)
})

// Ruta para devolver un producto al azar
app.get("/productoRandom", async (req, res) => { 
    const productos = await getProducts()
    const productoRandom = productos[parseInt(productos.length*Math.random())]
    res.send(productoRandom)
})
