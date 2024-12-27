import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

class Nodo {
  constructor(operaciones, resultado, numerosDisponibles) {
    this.operaciones = operaciones.slice();
    this.resultado = resultado;
    this.numerosDisponibles = numerosDisponibles.slice();
  }

  getOperaciones() {
    return this.operaciones;
  }

  addOperacion(operacion) {
    this.operaciones.push(operacion);
  }

  getResultado() {
    return this.resultado;
  }

  setResultado(resultado) {
    this.resultado = resultado;
  }

  getNumerosDisponibles() {
    return this.numerosDisponibles;
  }

  getNumeroDisponible(i) {
    return this.numerosDisponibles[i];
  }
  combinarNumerosDisponibles(i,j,res) {
    this.numerosDisponibles.splice(i,1);
    this.numerosDisponibles.splice(j-1,1);
    this.numerosDisponibles.push(res);
  }
}

function App() {

  const [casillasSeleccionadas, setCasillasSeleccionadas] = useState([]);
  const [resultado, setResultado] = useState("");

  function renderNumeros() {
    const listNumbers = [1,2,3,4,5,6,7,8,9,10,25,50,75,100];
    return (listNumbers.map((number) => {
      return (<button onClick={(e) => addCasilla(e, number)} className='casilla'>{number}</button>);
    })); 
  }

  function addCasilla(e, number) {
    if (casillasSeleccionadas.length < 6) {
      setCasillasSeleccionadas([...casillasSeleccionadas, number]);
    }
  }

  function renderCasillasSeleccionadas() {
    return (
      <div className='block-casillas-sel'>
        {casillasSeleccionadas.map((number) => {
          return (<button onClick={(e) => borrarCasillaSeleccionada(number)}className='casillaSeleccionada'><a className='text-casilla-sel'>{number}</a></button>);
        })}
      </div>
    ); 
  }

  function borrarCasillaSeleccionada(number) {
    let copiaCasillas = casillasSeleccionadas;
    console.log("borrar");
    const index = copiaCasillas.indexOf(number);
    if (index > -1) { 
      copiaCasillas.splice(index, 1); 
    }
    setCasillasSeleccionadas(copiaCasillas);
    console.log("cas", casillasSeleccionadas);
  }
  const handleChange = (event) => {
    const value = event.target.value;
    setResultado(value);
  };

  function buscarSoluciones() {
    let copiaCasillasSeleccionadas = casillasSeleccionadas;
    let operaciones = [];
    console.log("hola");
    //busquedaRecursiva(copiaCasillasSeleccionadas,operaciones, 0);
    const startTime = performance.now();
    branchAndBound(copiaCasillasSeleccionadas);
    const endTime = performance.now();
    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
    console.log("fin");
  }

  function permiteDivision(a,b) {
    return a %b  == 0;
  }

  function permiteResta(a,b) {
    return a > b;
  }

  function generarHijos(nodo) {
    let hijos = [];
    const tamanioNumerosDisponibles = nodo.numerosDisponibles.length;
    for (let i= 0; i<tamanioNumerosDisponibles-1; i++) {
      for (let j= i+1; j<tamanioNumerosDisponibles; j++) {
        const numDisponibleI = nodo.getNumeroDisponible(i);
        const numDisponibleJ = nodo.getNumeroDisponible(j);
        const operaciones = nodo.getOperaciones();
        const numerosDisponibles = nodo.getNumerosDisponibles();
        
        const suma = numDisponibleI + numDisponibleJ;
        let hijoSuma = new Nodo(operaciones, suma, numerosDisponibles);
        hijoSuma.addOperacion(`${numDisponibleI}+${numDisponibleJ}=${suma}`);
        hijoSuma.combinarNumerosDisponibles(i,j,suma);
        hijos.push(hijoSuma);
        if (permiteResta(numDisponibleI, numDisponibleJ)) {
          const resta = numDisponibleI - numDisponibleJ;
          let hijoResta = new Nodo(operaciones, resta, numerosDisponibles);
          hijoResta.addOperacion(`${numDisponibleI}-${numDisponibleJ}=${resta}`);
          hijoResta.combinarNumerosDisponibles(i,j,resta);
          hijos.push(hijoResta);
        }
        if (permiteResta(numDisponibleJ, numDisponibleI)) {
          const resta = numDisponibleJ - numDisponibleI;
          let hijoResta = new Nodo(operaciones, resta, numerosDisponibles);
          hijoResta.addOperacion(`${numDisponibleJ}-${numDisponibleI}=${resta}`);
          hijoResta.combinarNumerosDisponibles(i,j,resta);
          hijos.push(hijoResta);
        }
        const multiplicacion = numDisponibleI * numDisponibleJ;
        let hijoMultiplicacion = new Nodo(operaciones, multiplicacion, numerosDisponibles);
        hijoMultiplicacion.addOperacion(`${numDisponibleI}x${numDisponibleJ}=${multiplicacion}`);
        hijoMultiplicacion.combinarNumerosDisponibles(i,j,multiplicacion);
        hijos.push(hijoMultiplicacion);
        if (permiteDivision(numDisponibleI, numDisponibleJ)) {
          const division = numDisponibleI / numDisponibleJ;
          let hijoDivision = new Nodo(operaciones, division, numerosDisponibles);
          hijoDivision.addOperacion(`${numDisponibleI}/${numDisponibleJ}=${division}`);
          hijoDivision.combinarNumerosDisponibles(i,j,division);
          hijos.push(hijoDivision);
        }
        if (permiteDivision(numDisponibleJ, numDisponibleI)) {
          const division = numDisponibleJ / numDisponibleI;
          let hijoDivision = new Nodo(operaciones, division, numerosDisponibles);
          hijoDivision.addOperacion(`${numDisponibleJ}/${numDisponibleI}=${division}`);
          hijoDivision.combinarNumerosDisponibles(i,j,division);
          hijos.push(hijoDivision);
        }  
      }
    }
    return hijos;
  }

  function branchAndBound(numerosDisponibles) {
    const nodoPadre = new Nodo([], 0, numerosDisponibles);
    let nodos = generarHijos(nodoPadre);
    while (nodos.length> 0) {
      const nodoHijo = nodos[0];
      nodos.shift();
      if (nodoHijo.getResultado() == Number(resultado)) {
        console.log(nodoHijo.getOperaciones());
      } else if (nodoHijo.getOperaciones().length < 5){
        let nodosHijos = generarHijos(nodoHijo);
        nodos = nodos.concat(nodosHijos);
      }
    }
  }

  function busquedaRecursiva(numerosDisponibles, operaciones, ultimaOperacionRes) {
    if (ultimaOperacionRes==Number(resultado)) {
      console.log(operaciones);
    } else if (operaciones.length == 5) {
      let a = 1;
    } else {
      for(let i= 0; i<numerosDisponibles.length-1; i++) {
        for(let j= i+1; j<numerosDisponibles.length; j++) {
          let suma = numerosDisponibles[i] + numerosDisponibles[j];
          let copiaNumerosDisponibles = numerosDisponibles.slice();
          let copiaOperaciones = operaciones.slice();
          copiaOperaciones.push(copiaNumerosDisponibles[i]+"+"+copiaNumerosDisponibles[j]+"="+suma);
          copiaNumerosDisponibles.splice(i,1);
          copiaNumerosDisponibles.splice(j-1,1);
          copiaNumerosDisponibles.push(suma);
          busquedaRecursiva(copiaNumerosDisponibles, copiaOperaciones, suma);
          if (permiteResta(numerosDisponibles[i], numerosDisponibles[j])) {
            let resta = numerosDisponibles[i] - numerosDisponibles[j];
            let copiaNumerosDisponibles = numerosDisponibles.slice();
            let copiaOperaciones = operaciones.slice();
            copiaOperaciones.push(copiaNumerosDisponibles[i]+"-"+copiaNumerosDisponibles[j]+"="+resta);
            copiaNumerosDisponibles.splice(i,1);
            copiaNumerosDisponibles.splice(j-1,1);
            copiaNumerosDisponibles.push(resta);      
            busquedaRecursiva(copiaNumerosDisponibles, copiaOperaciones, resta);
          }
          if (permiteResta(numerosDisponibles[j], numerosDisponibles[i])) {
            let resta = numerosDisponibles[j] - numerosDisponibles[i];
            let copiaNumerosDisponibles = numerosDisponibles.slice();
            let copiaOperaciones = operaciones.slice();
            copiaOperaciones.push(copiaNumerosDisponibles[j]+"-"+copiaNumerosDisponibles[i]+"="+resta);
            copiaNumerosDisponibles.splice(i,1);
            copiaNumerosDisponibles.splice(j-1,1);
            copiaNumerosDisponibles.push(resta);     
            busquedaRecursiva(copiaNumerosDisponibles, copiaOperaciones, resta);
          }
          let multiplicacion = numerosDisponibles[i] * numerosDisponibles[j];
          let copiaNumerosDisponiblesMult = numerosDisponibles.slice();
          let copiaOperacionesMult = operaciones.slice();
          copiaOperacionesMult.push(copiaNumerosDisponiblesMult[i]+"x"+copiaNumerosDisponiblesMult[j]+"="+multiplicacion);
          copiaNumerosDisponiblesMult.splice(i,1);
          copiaNumerosDisponiblesMult.splice(j-1,1);
          copiaNumerosDisponiblesMult.push(multiplicacion);       
          busquedaRecursiva(copiaNumerosDisponiblesMult, copiaOperacionesMult, multiplicacion);
          if (permiteDivision(numerosDisponibles[i], numerosDisponibles[j])) {
            let division = numerosDisponibles[i]/numerosDisponibles[j];
            let copiaNumerosDisponibles = numerosDisponibles.slice();
            let copiaOperaciones = operaciones.slice();
            copiaOperaciones.push(copiaNumerosDisponibles[i]+"/"+copiaNumerosDisponibles[j]+"="+division);
            copiaNumerosDisponibles.splice(i,1);
            copiaNumerosDisponibles.splice(j-1,1);
            copiaNumerosDisponibles.push(division);           
            busquedaRecursiva(copiaNumerosDisponibles, copiaOperaciones, division);
          }
          if (permiteDivision(numerosDisponibles[j], numerosDisponibles[i])) {
            let division = numerosDisponibles[j]/numerosDisponibles[i];
            let copiaNumerosDisponibles = numerosDisponibles.slice();
            let copiaOperaciones = operaciones.slice();
            copiaOperaciones.push(copiaNumerosDisponibles[j]+"/"+copiaNumerosDisponibles[i]+"="+division);
            copiaNumerosDisponibles.splice(i,1);
            copiaNumerosDisponibles.splice(j-1,1);
            copiaNumerosDisponibles.push(division); 
            busquedaRecursiva(copiaNumerosDisponibles, copiaOperaciones, division);
          }
        }
      }
    }
  }

  function reiniciar() {
    setResultado("");
    setCasillasSeleccionadas([]);
  }
  
  return (
    <>
      <input class='resultado' onChange={handleChange} value={resultado}/>
      <div>
        {renderNumeros()}
        {renderCasillasSeleccionadas()}
        <button className='buscar' onClick={buscarSoluciones}>BUSCAR SOLUCIONES</button>
        <button className='buscar' onClick={reiniciar}>REINICIAR</button>
      </div>
    </>
  )
}

export default App
