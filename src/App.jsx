import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

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
    busquedaRecursiva(copiaCasillasSeleccionadas,operaciones, 0);
    console.log("fin");
  }

  function permiteDivision(a,b) {
    if (a %b  == 0) {
      return true;
    } else {
      return false;
    }
  }

  function permiteResta(a,b) {
    return a > b;
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
