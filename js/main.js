//
// Seccion para navegacion de la pagina 
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


// Codigo para resaltar la opcion del menu
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
let sticky = navbar.offsetTop;

function fijarMenu() {
  if (window.pageYOffset >= sticky) {
  navbar.classList.add("sticky")
  } else {
  navbar.classList.remove("sticky");
  }
}

//
// Iniciando variables
//

let acumuladorCard = [];
let baseDeProductos = [];
let productosCarrito = [];
let textoPrecio = "";
let textoCantidad = "";
let i = 0;


///
// Codigo asociado a la seccion de pedidos
///


/**
 * Declaracion de Objeto
 */

class CupCake {
    constructor(sabor, precio, imagen, cantidad) {
        this.sabor = sabor;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = cantidad;
    }
}

$(document).ready(traerDatos);


// Funcion para traer los datos del .json y crear array baseDeProductos
async function traerDatos (){
    await fetch('js/json.json')
    .then(res => res.json())
    .then(res =>{
        res.forEach(element=>{
            let nuevoElemento = new CupCake (
                element.sabor,
                element.precio,
                element.url,
                element.cantidad,
            )
           baseDeProductos.push(nuevoElemento);
        })   
        colocarProductos();   
    }) 
}
   
/**
 * Funcion para agregar las cards al html apartir del array baseDeProductos 
 * @param {} () no aplica parametro ya que se inicia con el onload
 */

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
    $("#mercadoPago").hide()

    controlCarrito();
}


//Funcion que va mostrando el pedido 
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

// Funcion que va modificand el resumen de pedido
function conteoPedido(pos){
    textoPrecio = "#td" + (pos.sabor) + "P";
    textoCantidad = "#td" + (pos.sabor) + "C";

    $(textoPrecio).html("$" + (pos.precio * pos.cantidad));
    $(textoCantidad).html(pos.cantidad); 
}

// Ocultar botones de vaciar carrito
$('#bloquePedido').mouseout(function (){
    $("#vaciar").hide()
})

// Funcion para mostrar botones de  vaciar carrito
// Se incluye codigo donde se vacia el carrito y con este el Storage
$("#bloquePedido").mouseover(function (){

    $("#vaciar").show()
    $("#vaciar").click(function () {
        localStorage.clear();
        productosCarrito = [];
        baseDeProductos.forEach(element => {
            element.cantidad = 0;
            let pedido = document.getElementById(`${element.sabor}`);
            $(pedido).html(` Has pedido ${element.cantidad}`);
            conteoPedido(element);
        })
        carrito = [];
        pedidoTotal();   
        $("#mercadoPago").hide();
    })   
})


// Funcion para totalizar pedido 
function pedidoTotal() {
    let costoDelPedido = 0;
    let cantidadCupcakes = 0;

    carrito.forEach(element =>
        costoDelPedido = costoDelPedido + element)

    baseDeProductos.forEach(element =>
        cantidadCupcakes = cantidadCupcakes + element.cantidad)  
      
    $("#resumen").html(`Tu pedido es de ${cantidadCupcakes} cupcakes por un total de $${costoDelPedido}`);
}

// Aplicando MercadoPago

async function enviarPedido () {
    
    baseDeProductos.forEach(element => {    
        if (element.cantidad > 0){
            productosCarrito.push(element);
        }
    });

    const jsonMP = productosCarrito.map((element) => {
        let nuevoElemento = {
            title: element.sabor,
            description: "producto",
            picture_url: element.imagen,
            category_id: "sin categoria",
            quantity: element.cantidad,
            currency_id: "CLP",
            unit_price: Number(element.precio)
        };
        return nuevoElemento;
      });

    
    if (productosCarrito.length > 0){
        let data = await fetch ('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST', 
            headers: {
                "Authorization": "Bearer TEST-8957954100028902-060121-8ff2e0ccee29f17c7e1d0c4b07d423de-765799328"
            },
            body: JSON.stringify({items: jsonMP}),
        });
        let responseMP = await data.json();
        window.open(responseMP.init_point, "ventana de pago");
    } else {
        $("#resumen").html( 'No tienes ningun producto agregado');
    }
}

// Eventos con el usuario para tomar el pedido 
$("#entregaPedido").hide();

$("#pedidoTotal").click(function (){
    pedidoTotal();
    $("#mercadoPago").show();
})

$("#mercadoPago").click(function (){
    pedidoTotal();
    $("#entregaPedido").modal()
})

$("#cerrarInfo").click(function(){
    $("#entregaPedido").modal('hide');
});

$("#irMercadoPago").click(function(){
    enviarPedido();
});

      
///
// Codigo asociado a la seccion de contacto
///


function paginaDeContacto (){
    let formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (e) =>{
        e.preventDefault();
        console.log('Has ingresado tu solicitud');
    })
}    

/**
 * Funcion para validar que no ingresen numeros en los datos de nombre y apellido
 *  * @param {} () se activa al reconocer el evento
 */

function validacionNombre(e) {
    let key = e.keyCode || e.which;
      tecla = String.fromCharCode(key).toLowerCase();
      letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
      especiales = [8, 37, 39, 46, 222];
      tecla_especial = false;

    for (let i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      return false;
    }
}


// Funcion para agregar API de Whatsapp
function whatsApp () {
    let nombreApellido = document.getElementById('texto');
        window.location.href=`https://api.whatsapp.com/send/?phone=56945820564&text=Hola ${nombreApellido.value} !!!, En que podemos ayudarte?`    
}

$("#wsp").click(function (){
    whatsApp();
})

$("#catChef").hide()

$(".contacto").mouseover(function (){
    $("#catChef").fadeIn()
    $(".contacto").mousemove(function (e){
        let img = document.getElementById('dogChef');
        document.onmousemove=function (e) {
            img.style.left=e.clientX-80 + 'px';
        }
    }) 
})



