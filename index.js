const fs = require("fs"); 

class Contenedor {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo
    }
    
    // Devolver array con todos los objetos presentes en el archivo
    async getAll() { 
        let datosArchivo = []
        try {
            datosArchivo = await fs.promises.readFile(`${this.nombre}.json`, "utf-8") 
            datosArchivo = JSON.parse(datosArchivo)
        } catch(error) {  console.log(error) 
        }
        return datosArchivo
    }
       
    // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
    async save(objeto) { 
        let datosArchivo = await this.getAll()
        let addId        
        if (datosArchivo.length === 0) {
            // Define a esta variable como 1 ya que queremos que el primer objeto tenga id igual a 1
            addId = 1 
        } else {
            // Los siguientes objetos tendrán un id igual al id del último objeto del array+1
            addId = datosArchivo[datosArchivo.length-1].id + 1 
        }
        // Le agrega al objeto el id mencionado
        objeto.id = addId 
        // Agregar el objeto actualizado al array
        datosArchivo.push(objeto) 
        // Convertir a formato json
        datosArchivo = JSON.stringify(datosArchivo, null, "\t") 
        // Actualizar archivo con el nuevo objeto agregado
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) 
        // Retorna el id asignado
        return addId 
    }

    // Recibe un id y devuelve el objeto con ese id, o null si no está
    async getById(id) { 
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    // Elimina del archivo el objeto con el id buscado
    async deleteById(id) { 
        let datosArchivo = await this.getAll()
        datosArchivo = datosArchivo.filter(objeto => objeto.id !== id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        // Actualizar array en el archivo
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) 
    }

    async deleteAll() {
        try { 
            await fs.promises.readFile(`${this.nombre}.json`, "utf-8")
            await fs.promises.writeFile(`${this.nombre}.json`, "[]")
        } catch(error) {
            console.log(error)
        }
    }
}

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

// Poner a prueba los métodos definidos 
const pruebaDeMetodos = async () => { 
    try {
      // Agregar cuatro productos con método save

        // Crear archivo y agrega el producto1 con id igual a 1
        const primerId = await contenedor.save(producto1) 
        console.log(`El id del objeto agregado : ${primerId}`)
    
        // Agrega el producto2 con id igual a 2
        const segundoId = await contenedor.save(producto2) 
        console.log(`El id del objeto agregado : ${segundoId}`)
    
        const tercerId = await contenedor.save(producto3)
        console.log(`El id del objeto agregado : ${tercerId}`)

        // Agrega el producto2 otra vez, pero ahora con id igual a 4 
        const cuartoId = await contenedor.save(producto2)
        console.log(`El id del objeto agregado : ${cuartoId}`)
        
        // Muestro por consola los objetos gracias al método getById
        console.log("\nLos objetos son:")

        const objeto1 = await contenedor.getById(primerId)
        console.table(objeto1)
    
        const objeto2 = await contenedor.getById(segundoId)
        console.table(objeto2)

        const objeto3 = await contenedor.getById(tercerId)
        console.table(objeto3)
    
        const objeto4 = await contenedor.getById(cuartoId)
        console.table(objeto4)

        // Muestro por consola todos los objetos gracias al método getAll
        const todosLosObjetos = await contenedor.getAll()
        console.log("\nLa siguiente tabla muestra todos los objetos:")
        console.table(todosLosObjetos)

        // Eliminar dos objetos con método deleteById
        await contenedor.deleteById(tercerId)
        await contenedor.deleteById(cuartoId)
        console.log(`\nTodos los objetos sin los objetos con id ${tercerId} y ${cuartoId}:`)
        console.table(await contenedor.getAll())

        // Elimino todos los objetos gracias al método deleteAll()
        await contenedor.deleteAll()
        console.log(`\nLista borrada`)

        // Mostrar lista borrada
        console.log(await contenedor.getAll())

    } catch(error) {
        console.log(error)
    }
}

pruebaDeMetodos()