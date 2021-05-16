//
// Codigo para navegacion de la pagina 
//

$("#index").click( function (e) {
    e.preventDefault()

    $('html, body').animate({
        scrollTop: $(".info").offset().top}, 2000);
    
    seleccionador(".index")
})

$("#nosotros").click( function (e) {
    e.preventDefault()

    $('html, body').animate({
        scrollTop: $(".nosotros").offset().top}, 1000)
    
    seleccionador(".nosotrosI")
})

$("#pedido").click( function (e) {
    e.preventDefault()

    $('html, body').animate({
        scrollTop: $(".hijo1").offset().top}, 1000)

    seleccionador(".pedido")
})

$("#contacto").click( function (e) {
    e.preventDefault()

    $('html, body').animate({
        scrollTop: $(".contacto1").offset().top}, 1000)
    
    seleccionador(".contactoI")
})

function seleccionador(clase) {
    $(clase).css({
        "background-color": "#FF9B93",
        "color": "#41584B",
    });

    $(clase).mouseout(function (){
        $(clase).css({
        "background-color": "#FFF3B2",
        "color": "#fa8278",
        });
    })
}


// Codigo para fijar el menu
window.onscroll = function() {fijarMenu()};

let navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function fijarMenu() {
  if (window.pageYOffset >= sticky) {
  navbar.classList.add("sticky")
  } else {
  navbar.classList.remove("sticky");
  }
}


///
// Codigo asosiado a la seccion de pedidos
///

let acumuladorCard = [];

$(document).ready(traerDatos);

/**
 * Funcion para agregar las cards al html apartir del array baseDeProductos 
 * @param {} () no aplica parametro ya que se inicia con el onload
 */

let baseDeProductos = []

async function traerDatos (){
    await fetch('js/json.json')
    .then(res => res.json())
    .then(res =>{
        console.log(res)
        res.forEach(element=>{
            let nuevoElemento = {
                sabor: element.sabor,
                precio: element.precio,
                imagen: element.url,
                cantidad: element.cantidad,
            }
           baseDeProductos.push(nuevoElemento);
        })
        console.log(baseDeProductos);     
        console.log(baseDeProductos[1].imagen)
        colocarProductos();   
    }) 
}
   

function colocarProductos (){

    if (localStorage.getItem("pedidoAlmacenado") ){

        baseDeProductos = JSON.parse(localStorage.getItem("pedidoAlmacenado"));
    }
   
    for (let i = 0; i < baseDeProductos.length; i++){
     
        acumuladorCard += 
        `<div class="col-sm-12 col-md-6 col-lg-4 producto">
            <h2 class="card-title"> ${baseDeProductos[i].sabor} </h2>
            <img id= "imgcard" src="${baseDeProductos[i].imagen}">
            <p class="card-text text-center"> $${baseDeProductos[i].precio}</p>
            <div class = "botones">
                <button id = "agregar" class = "boton" onclick="agregarAlPedido(${i})"> Agregar </button>
                <button id = "borrar" class = "boton" onclick="eliminarProducto(${i})"> Eliminar </button>
            </div>
            <p  id="${baseDeProductos[i].sabor}"> Has pedido ${baseDeProductos[i].cantidad} </p>
        </div> `
    }    

    document.getElementById("productosEnVenta").innerHTML=acumuladorCard;

    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
    } else {
        carrito = [];
    }

    $("#vaciar").hide();

    controlCarrito();
}


function controlCarrito() {

        baseDeProductos.forEach(element => {
            detallePedido+= ` 
                       <tr>
                            <td id= "td${element.sabor}" >${element.sabor}</td>
                            <td id= "td${element.sabor}P">$ ${element.cantidad * element.precio}</td>
                            <td id= "td${element.sabor}C">${element.cantidad}</td>
                        </tr>`
        });

    let datos = document.getElementById("detallePedido");
    $(datos).html(detallePedido);

}


/**
 * Funcion para agregar productos al carrito
 * Suma el precio a la variable carrito y va guardando la cantidad solicitada
 * @param {} i ingresa la posicion del objeto dentro del array baseDeProductos
 */

let textoPrecio = "";
let textoCantidad = "";

function agregarAlPedido(i){

    baseDeProductos[i].cantidad++
    let pedido = document.getElementById(`${baseDeProductos[i].sabor}`);
    $(pedido).html(` Has pedido ${baseDeProductos[i].cantidad}`);
    precio = baseDeProductos[i].precio;
    carrito.push(precio);
    
    conteoPedido(baseDeProductos[i])

    localStorage.setItem("pedidoAlmacenado",JSON.stringify(baseDeProductos));
    localStorage.setItem("carrito",JSON.stringify(carrito));
    
}

/**
 * Funcion para eliminar productos al carrito
 * Elimina el precio a la variable carrito y de la cantidad solicitada
 * @param {} i ingresa la posicion del objeto dentro del array baseDeProductos
 */

function eliminarProducto(i){
      
    aux = baseDeProductos[i].cantidad;
    
    if (aux == 0){
        let pedido = document.getElementById(`${baseDeProductos[i].sabor}`);
        $(pedido).html(  ` Has pedido ${baseDeProductos[i].cantidad}
                            <p> No puedes eliminar mas </p>`);
    } else{
        baseDeProductos[i].cantidad-=1;
        let pedido = document.getElementById(`${baseDeProductos[i].sabor}`);
        $(pedido).html(` Has pedido ${baseDeProductos[i].cantidad}`);
        precio = baseDeProductos[i].precio;
        let pos = carrito.indexOf(precio);
        carrito.splice(pos,1);

    }

    conteoPedido(baseDeProductos[i])

    localStorage.setItem("pedidoAlmacenado",JSON.stringify(baseDeProductos));
    localStorage.setItem("carrito",JSON.stringify(carrito));
  
}


function conteoPedido(pos){
    textoPrecio = "#td" + (pos.sabor) + "P";
    textoCantidad = "#td" + (pos.sabor) + "C";

    $(textoPrecio).html("$" + (pos.precio * pos.cantidad));
    $(textoCantidad).html(pos.cantidad); 
}


$('#bloquePedido').mouseout(function (){
    $("#vaciar").hide()
})


$("#bloquePedido").mouseover(function (){

    $("#vaciar").show()
    $("#vaciar").click(function () {
        localStorage.clear();
        baseDeProductos.forEach(element => {
            element.cantidad = 0;
            let pedido = document.getElementById(`${element.sabor}`);
            $(pedido).html(` Has pedido ${element.cantidad}`);
            conteoPedido(element);
        });
        carrito = []
        pedidoTotal();
        
    })
    
})


let i = 0;


function pedidoTotal() {
    let costoDelPedido = 0;
    let cantidadCupcakes = 0;

    carrito.forEach(element =>
        costoDelPedido = costoDelPedido + element)


    baseDeProductos.forEach(element =>
        cantidadCupcakes = cantidadCupcakes + element.cantidad)  
      
    $("#resumen").html(`Tu pedido es de ${cantidadCupcakes} cupcakes por un total de $${costoDelPedido}`)
}

$("#pedidoTotal").click(function (){
    pedidoTotal();
})

      
///
// Codigo asociado a la pagina de contacto
///


function paginaDeContacto (){
    let formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (e) =>{
        e.preventDefault();
        console.log('Has ingressado tu solicitud');
    })
}    

/**
 * Funcion para validar que no ingresen numeros en los datos de nombre y apellido
 *  * @param {} () se activa al reconocer el evento
 */

function validarTexto(event) {
    event.target.value
    if (event.which == 96 || event.which == 97 || event.which == 98 || event.which == 99 || event.which == 100 || event.which == 101 || event.which == 102 || event.which == 103 || event.which == 104 || event.which == 105 || event.which == 48 || event.which == 49 || event.which == 50 || event.which == 51 || event.which == 52 || event.which == 53 || event.which == 54 || event.which == 55 || event.which == 56 || event.which == 57){
        alert("no puedes ingresar numeros")
        console.log(event)
        let array = Array.from(event.target.value);
        array.pop();
        array = array.join('');
        let cambio = document.getElementById('texto');
        cambio.value = array;
        console.log(array)
    }
}

$("#catChef").hide()

$(".contacto").mouseover(function (){
    $("#catChef").fadeIn()
})
