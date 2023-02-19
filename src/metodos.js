import fs from "fs"; 
import __dirname from "./utils.js"

const direccion = (name) => `${__dirname}/json/${name}.json`

class Contenedor {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo
    }
    
    async getAll() { 

        let datosArchivo = []

        if (fs.existsSync(direccion(this.nombre))){
            datosArchivo = await fs.promises.readFile(direccion(this.nombre), "utf-8") 
            datosArchivo = JSON.parse(datosArchivo)
        } 
        
        return datosArchivo
    }
        
    async save(objeto) { 
      
        objeto.price = objeto.price == undefined ? undefined : parseFloat(objeto.price)

        let datosArchivo = await this.getAll()

        let addId        

        if (datosArchivo.length === 0) {
            addId = 1 
        } else {
            addId = datosArchivo[datosArchivo.length-1].id + 1 
        }

        objeto.id = addId 

        datosArchivo.push(objeto) 

        datosArchivo = JSON.stringify(datosArchivo, null, "\t") 

        await fs.promises.writeFile(direccion(this.nombre), datosArchivo) 

        return addId 
    }

    async getById(id) { 
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    async deleteById(id) { 

        let datosArchivo = await this.getAll()

        datosArchivo = datosArchivo.filter(objeto => objeto.id !== id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(direccion(this.nombre), datosArchivo) 
    }

    async deleteAll() {
        if (fs.existsSync(direccion(this.nombre))) { 
            await fs.promises.writeFile(direccion(this.nombre), "[]")
        } 
    }

    async update(objetoAct, id) {
        let datosArchivo = await this.getAll()

        const indiceObjeto = datosArchivo.findIndex(objeto => objeto.id == id)

        objetoAct.id = id 
        datosArchivo[indiceObjeto] = objetoAct
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(direccion(this.nombre), datosArchivo)
    }
}


export default Contenedor