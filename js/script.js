//Selecciono el header .item-container
const header = document.querySelector("header")

//Creo la section titulo
const titulo = document.createElement("section")
titulo.classList = "titulo"
header.appendChild(titulo)

//Agrego el h1 a la section titulo
const h1 = document.createElement("h1")
h1.innerText = "Lista de Compras"
titulo.appendChild(h1)

//Selecciono el main
const main = document.querySelector("main")

//Agrego la section para agregar items a la lista
const seccionLista = document.createElement("section")
seccionLista.classList = "agregarItem"
main.appendChild(seccionLista)

//Agrego un label, un input y un button a la section para agregar items
const label1 = document.createElement("label")
label1.innerText = "Agregar item: "
seccionLista.appendChild(label1)

const input1 = document.createElement("input")
input1.type = "text"
seccionLista.appendChild(input1)

const button1 = document.createElement("button")
button1.innerText = "Agregar"
seccionLista.appendChild(button1)

//Agrego la section items al main, donde aparecen todos los items de la lista
const seccionItems = document.createElement("section")
seccionItems.classList = "items"
main.appendChild(seccionItems)


//====================== SECCIÓN DE UTILIDADES (copiar / importar) ======================
const seccionUtilidades = document.createElement("section")
seccionUtilidades.classList = "utilidades"
main.appendChild(seccionUtilidades)

// --- Bloque: copiar lista ---
const copiarContainer = document.createElement("div")
copiarContainer.classList = "copiar-lista"
seccionUtilidades.appendChild(copiarContainer)

const labelCopiar = document.createElement("label")
labelCopiar.innerText = "Copiar items de esta lista"
copiarContainer.appendChild(labelCopiar)

const buttonCopiar = document.createElement("button")
buttonCopiar.innerText = "Copiar items"
copiarContainer.appendChild(buttonCopiar)

// --- Bloque: pegar / importar lista ---
const importarContainer = document.createElement("div")
importarContainer.classList = "importar-lista"
seccionUtilidades.appendChild(importarContainer)

const labelImportar = document.createElement("label")
labelImportar.innerText = "Pegar una lista que te pasaron:"
importarContainer.appendChild(labelImportar)

const textareaImportar = document.createElement("textarea")
textareaImportar.rows = 4
textareaImportar.placeholder = "Un item por línea o separados por comas..."
importarContainer.appendChild(textareaImportar)

const buttonImportar = document.createElement("button")
buttonImportar.innerText = "Agregar a mi lista"
importarContainer.appendChild(buttonImportar)

//=============================Funcion para agregar elementos al Storage y al DOM===========================

// Función para agregar un nuevo elemento al almacenamiento local
function agregarElementoAlLocalStorage(texto, completado = false) {
    const newItem = {
        texto: texto.trim(),
        completado: completado
    }

    if (newItem.texto === "") return

    let listaItems = JSON.parse(localStorage.getItem("listaItems")) || []

    // Evitar duplicados (sin importar mayúsculas/minúsculas)
    let valor = listaItems.some(obj => obj.texto.toLowerCase() == newItem.texto.toLowerCase())

    if (!valor) {
        listaItems.push(newItem)
        // Orden alfabético
        listaItems.sort((a, b) =>
            (a.texto.toLowerCase() > b.texto.toLowerCase()) ? 1 :
            (a.texto.toLowerCase() < b.texto.toLowerCase()) ? -1 : 0
        )
        localStorage.setItem("listaItems", JSON.stringify(listaItems))
    }
}

// Función para cargar la lista de elementos desde el almacenamiento local
function cargarListaDesdeLocalStorage() {
    const listaItems = JSON.parse(localStorage.getItem("listaItems")) || []

    // limpio primero
    seccionItems.innerHTML = ""

    listaItems.forEach(function (item, index) {
        // Crear el contenedor para el tick y el item
        const itemContainer = document.createElement("div")
        itemContainer.classList.add("item-container")

        //Primero creo el tick a la izquierda del item
        const tick = document.createElement("input")
        tick.type = "checkbox"
        tick.checked = item.completado

        // Guardo el estado del tick en el almacenamiento local
        tick.addEventListener("change", function () {
            item.completado = tick.checked
            localStorage.setItem("listaItems", JSON.stringify(listaItems))
        })

        //Luego creo el item a la derecha del tick
        const listItem = document.createElement("p")
        listItem.innerText = item.texto

        // Creo el botón de eliminar
        const botonEliminarItem = document.createElement("button")
        botonEliminarItem.innerText = "Eliminar"
        botonEliminarItem.classList.add("eliminar-item")
        botonEliminarItem.setAttribute("data-index", index)

        // Agrego el tick, el item y el boton eliminar de cada item a un contenedor
        itemContainer.appendChild(tick)
        itemContainer.appendChild(listItem)
        itemContainer.appendChild(botonEliminarItem)

        // Agrego el contenedor a la sección de items
        seccionItems.appendChild(itemContainer)
    })
}

// Evento de click para eliminar un elemento individual
seccionItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("eliminar-item")) {
        const index = parseInt(event.target.getAttribute("data-index"))
        eliminarElemento(index)
    }
})

// Evento de click para agregar elementos
button1.addEventListener("click", function () {
    //capturo el texto ingresado en el input
    const textoItem = input1.value

    //Verificación del input con algún texto
    if (textoItem !== "") {
        agregarElementoAlLocalStorage(textoItem)

        // Limpio el input y enfoco nuevamente en el input para seguir escribiendo
        input1.value = ""
        input1.focus()

        // Recargo la lista desde el almacenamiento local
        cargarListaDesdeLocalStorage()
    }
})

//Función eliminar un solo item
function eliminarElemento(index) {
    let listaItems = JSON.parse(localStorage.getItem("listaItems")) || []
    // Elimino el elemento del arreglo, según su índice
    listaItems.splice(index, 1)
    localStorage.setItem("listaItems", JSON.stringify(listaItems))

    // Recargo la lista
    cargarListaDesdeLocalStorage()
}

// ===================== COPIAR LISTA =====================
buttonCopiar.addEventListener("click", function () {
    const listaItems = JSON.parse(localStorage.getItem("listaItems")) || []

    if (listaItems.length === 0) {
        alert("No hay items para copiar.")
        return
    }

    // Podés cambiar el formato si querés
    // Ejemplo: poner ✓ o ✗ según completado
    const texto = listaItems
        .map(item => (item.completado ? "✔ " : "") + item.texto)
        .join("\n")

    navigator.clipboard.writeText(texto)
        .then(() => alert("Lista copiada al portapapeles ✅"))
        .catch(() => alert("No se pudo copiar 😢"))
})

// ===================== IMPORTAR / PEGAR LISTA =====================
buttonImportar.addEventListener("click", function () {
    const textoPegado = textareaImportar.value

    if (textoPegado.trim() === "") {
        alert("Pegá primero una lista 😉")
        return
    }

    // Aceptamos listas separadas por saltos de línea o por comas
    let candidatos = []
    if (textoPegado.includes("\n")) {
        candidatos = textoPegado.split("\n")
    } else {
        candidatos = textoPegado.split(",")
    }

    candidatos = candidatos
        .map(t => t.trim())
        .filter(t => t !== "")

    // Los vamos agregando uno por uno al localStorage (ya evita duplicados)
    candidatos.forEach(itemTexto => {
        agregarElementoAlLocalStorage(itemTexto)
    })

    // limpio textarea
    textareaImportar.value = ""

    // recargo vista
    cargarListaDesdeLocalStorage()
})

// Cargo la lista al cargar la página
window.addEventListener("load", cargarListaDesdeLocalStorage)