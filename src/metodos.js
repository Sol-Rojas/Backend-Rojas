import fs from "fs"; 

class Contenedor {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo
    }
    
    async getAll() { 

        let datosArchivo = []

        if (fs.existsSync(`${this.nombre}.json`)){
            datosArchivo = await fs.promises.readFile(`${this.nombre}.json`, "utf-8") 
            datosArchivo = JSON.parse(datosArchivo)
        } 
        
        return datosArchivo
    }
       
    async save(objeto) { 

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

        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) 

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
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) 
    }

    async deleteAll() {
        if (fs.existsSync(`${this.nombre}.json`)) { 
            await fs.promises.writeFile(`${this.nombre}.json`, "[]")
        } 
    }
}




export default Contenedor