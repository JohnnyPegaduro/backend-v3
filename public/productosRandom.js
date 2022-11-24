//* PRODUCTOS RANDOM - LISTADO

document.addEventListener("DOMContentLoaded", (e) =>{
    fetchData();
})

const fetchData = async () => {
    try {
        const res = await fetch("/api/productos-test");
        const data = await res.json();
        renderProducts(data);
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}

const renderProducts = (productos) => {
    return fetch("tabla-productos.hbs")
    .then((res) => res.text())
    .then((tabla) =>{
        const template = Handlebars.compile(tabla)
        const html = template ({ productos });
        document.getElementById("productos").innerHTML = html;
    })
}