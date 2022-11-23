import { Router } from "express"; 
import Contenedor from "../metodos.js";
import uploader from "../services/upload.js";

const router = Router(); 

const metodo = new Contenedor("productos");

router.get("/", async (req, res) => { 
    const result = await metodo.getAll()
    res.send({ result })
})

router.get("/:idProducto", async (req, res) => { 
    const { idProducto } = req.params

    const result = await metodo.getById(parseInt(idProducto))

    if (result === null) {
        res.send({ error: "Producto no encontrado"})
    } else {
        res.send({ result })
    }   
})

router.post("/", uploader.single("image"), async (req, res) => { 
    const producto = req.body;
    if (req.file) { 
        producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
        const result = await metodo.save(producto)
        
        res.send({ status: "sucess", message: "Producto agregado", result })

    } else if (producto.image) { 
        const result = await metodo.save(producto)

        res.send({ status: "sucess", message: "Producto agregado", result })
    } else {
        res.send({ error: "Datos ingresados incorrectamente"})
    }
})

router.put("/:idProducto", uploader.single("image"), async (req, res) => {
    const { idProducto } = req.params;

    const producto = req.body;
    
    const datosArchivo = await metodo.getAll()

    if (datosArchivo.some(objeto => objeto.id == idProducto)) { 
        if (req.file) { 
            producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
            const objetoActualizado = {
                title: producto.title,
                price: producto.price,
                image: producto.image,
                id: parseInt(idProducto)
            }
            await metodo.update(objetoActualizado, idProducto)
            res.send({ status: "sucess", message: `Producto con id ${idProducto} actualizado`})
        
        } else if (producto.image) { 
            await metodo.update(producto, idProducto)
            res.send({ status: "sucess", message: `Producto con id ${idProducto} actualizado`})
        
        } else {
            res.send({ error: "Datos ingresados incorrectamente"})
        }
    } else {
        res.send({ error: "Producto no encontrado"})
    }
})

router.delete("/:idProducto", async (req, res) => {
    const { idProducto } = req.params
    const datosArchivo = await metodo.getAll()
    
    if (datosArchivo.some(objeto => objeto.id == idProducto)) { 
        await metodo.deleteById(parseInt(idProducto))
        res.send({ status: "sucess", message: `Producto con id ${idProducto} eliminado` })
    } else {
        res.send({ error: "Producto no encontrado" })
    }
})

export default router;
