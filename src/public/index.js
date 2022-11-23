const actualizar = document.getElementById("actualizar")

document.getElementById("inputCheckAct").addEventListener("click", () => { 
    actualizar.disabled = actualizar.disabled ? false : true
})

const eliminar = document.getElementById("eliminar")
const inputCampos = document.querySelectorAll(".inputCambiante")

document.getElementById("inputCheckElim").addEventListener("click", () => { 
    if (eliminar.disabled) {
        eliminar.disabled = false
        
        inputCampos.forEach(input => {
            input.disabled = true
        })
    } else {
        eliminar.disabled = true

        inputCampos.forEach(input => {
            input.disabled = false
        })
    }
})

const form = document.getElementById("productosForm")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    if (actualizar.disabled && eliminar.disabled) { 
        fetch("/api/productos", { 
            method: "POST",
            body: formData 
        }).then(res => res.json()).then(res => console.log("Método POST ejecutado\n", res))
    
    }else if (actualizar.disabled == false && eliminar.disabled) { 
        fetch(`/api/productos/${actualizar.value}`, {
            method: "PUT",
            body: formData
        }).then(res => res.json()).then(res => console.log("Método PUT ejecutado\n", res))
        
    } else { 
        fetch(`/api/productos/${eliminar.value}`, {
            method: "DELETE" 
        }).then(res => res.json()).then(res => console.log("Método DELETE ejecutado\n", res))
    }
})