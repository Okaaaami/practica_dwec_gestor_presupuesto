// TODO: Crear las funciones, objetos y variables indicadas en el enunciado

// TODO: Variable global

"use strict"

var presupuesto = 0;
let gastos = [];
let idGasto = 0;

function actualizarPresupuesto(numero) {
    if(numero > 0){
        presupuesto = numero;
        return numero;
    }else{
        console.log("error: el numero es menor que 0");
        return -1;
    }
}

function mostrarPresupuesto() {
    // TODO
    return (`Tu presupuesto actual es de ${presupuesto} €`);
}

function listarGastos(){
    return gastos;
}
//
function anyadirGasto(gasto){
    gasto.id = idGasto;
    idGasto++;
    gastos.push(gasto);
}
//
function borrarGasto(id){
    for(var i = 0; i < gastos.length; i++){
        if(gastos[i].id === id){
            gastos.splice(i,1);
        }
    }
}
//
function calcularTotalGastos(){
    let valorGastos = 0;
    for(var i = 0; i < gastos.length; i++){
        valorGastos += gastos[i].valor;
    }
    return valorGastos;
}
//
function calcularBalance(){
    return (presupuesto - calcularTotalGastos())
}
//
function filtrarGastos({fechaDesde, fechaHasta, valorMinimo, valorMaximo, descripcionContiene, etiquetasTiene}){
    
    let retArray = gastos;
    retArray = gastos.filter(function(gasto){
        let boolean = true;
        let booleanEti = false;
        if(fechaDesde){
            if(gasto.fecha < Date.parse(fechaDesde)){
                boolean = false;
            }
        }
        if(fechaHasta){
            if(gasto.fecha > Date.parse(fechaHasta)){
                boolean = false;
            }
        }
        if(valorMinimo){
            if(gasto.valor < valorMinimo){
                boolean = false;
            }
        }
        if(valorMaximo){
            if(gasto.valor > valorMaximo){
                boolean = false;
            }
        }
        if(descripcionContiene){
            if(!gasto.descripcion.toLowerCase().includes(descripcionContiene.toLowerCase())){
                boolean = false;
            }
        }
        if(etiquetasTiene){
            for(var i = 0; i < etiquetasTiene.length; i++){
                if(gasto.etiquetas.includes(etiquetasTiene[i])){
                    booleanEti = true;
                }
            }
            if(!booleanEti){
                boolean = false
            }
        }
        return boolean;
    })
    return retArray;

}
//
function agruparGastos(periodo = `mes`, etiqueta2, fechaDesde2, fechaHasta2){

    let arrayInicial = filtrarGastos({fechaDesde : fechaDesde2, fechaHasta : fechaHasta2, etiquetasTiene : etiqueta2});

    let arrayFinal = arrayInicial.reduce(function(acc,gasto){

    let periodoObtenido = gasto.obtenerPeriodoAgrupacion(periodo);
    
    if(!isNaN(acc[periodoObtenido])){
        acc[periodoObtenido] += gasto.valor;
    }
    else{
        acc[periodoObtenido] = gasto.valor;
    }
    return acc;
    },{});
    return arrayFinal;

}
//      
function CrearGasto(descripcion,valor,fecha,...etiqueta) {

    if(valor < 0 || typeof(valor) !== `number`){
        valor = 0; 
    }
    if([...etiqueta] === `undefined`){
        this.etiquetas = [];
    }else{
        this.etiquetas = [...etiqueta]
    }
    if(fecha == undefined){
        this.fecha = Date.now();
    }else{
        if(isNaN(Date.parse(fecha))){
            this.fecha = Date.now();
        }else{
            this.fecha = Date.parse(fecha);
        }
    }

        this.descripcion= `${descripcion}`,
        this.valor = valor,

    //
    this.mostrarGastoCompleto = function(){

        var texto = ``;
        for(let eti of this.etiquetas) {
            texto += `- ${eti}\n`;
        }
        return (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${new Date(this.fecha).toLocaleString()}\nEtiquetas:\n${texto}`)
    },
    //
    this.actualizarFecha = function(fecha){
        if(!isNaN(Date.parse(fecha))){
            this.fecha = Date.parse(fecha);
        }
    }
    //
    this.anyadirEtiquetas = function(...etis){
        for(var i = 0; i < etis.length; i++){
            if(!this.etiquetas.includes(etis[i])){
                this.etiquetas.push(etis[i]);
            }
        }
    }
    //
    this.borrarEtiquetas = function(...etis){
        for(var i = 0; i < etis.length; i++){
            for(var j = 0; j < this.etiquetas.length; j++){
                if(etis[i] === this.etiquetas[j]){
                    this.etiquetas.splice(j,1);
                }
            }
        }
    }
    //
    
    this.obtenerPeriodoAgrupacion = function(periodo){
        let res;
        let f = new Date(this.fecha);
        let mes = parseInt(f.getMonth())+ 1;
        let day;

        if(parseInt(f.getDate()) < 10){
            day =  `0${parseInt(f.getDate())}`
        }else{
            day = parseInt(f.getDate());
        }
        if(periodo === "dia"){
            if(mes < 10){
                    res = f.getFullYear() + `-0` + mes + `-` + day;
                
            }else{
                res = f.getFullYear() + `-` + mes + `-` + day;
            }
        }

        if(periodo === "mes"){
            if(mes < 10){
                res = f.getFullYear() + `-0` + mes;
            }else{
                res = f.getFullYear() + `-` + mes;
            }
        }

        if(periodo === "anyo"){
            res = f.getFullYear();
        }
        return res;
    }
    //
    this.mostrarGasto = function(){
        return (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
    },
    //
    this.actualizarDescripcion  = function(descripcion){
        this.descripcion = descripcion;
    },
    //
    this.actualizarValor = function(valor){
        if(valor >= 0 && typeof(valor) === `number`){
            this.valor = valor;
        }
    }
    //
}

function transformarListadoEtiquetas(etiquetas){
    let a = etiquetas.split(/[,.:;\s]/).filter(z => z != "");
    return a;
}
function cargarGastos(gastosAlmacenamiento) {
    // gastosAlmacenamiento es un array de objetos "planos"
    // No tienen acceso a los métodos creados con "CrearGasto":
    // "anyadirEtiquetas", "actualizarValor",...
    // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
  
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let g of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
        // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento
        // al gasto rehidratado
        // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
        Object.assign(gastoRehidratado, g);
        // Ahora "gastoRehidratado" tiene las propiedades del gasto
        // almacenado y además tiene acceso a los métodos de "CrearGasto"
          
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado)
    }
}

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos    
}