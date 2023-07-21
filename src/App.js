import React, { useState } from "react";

// Componente funcional Square: Representa un botón en el tablero del juego.
const Square = ({ value, onSquareClick }) => {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Componente funcional Board: Representa el tablero del juego.
function Board({ xIsNext, squares, onPlay }) {
  // Función que maneja el clic en un cuadro del tablero
  const handleClick = (i) => {
    // Si ya hay un ganador o el cuadro ya está ocupado, no hacer nada
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Crear una copia del arreglo "squares" para actualizar el estado sin mutarlo directamente
    const nextSquares = squares.slice();
    // Asignar "X" u "O" dependiendo del turno del jugador
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // Llamar a la función "onPlay" con el nuevo estado del tablero
    onPlay(nextSquares);
  }

  // Calcular si hay un ganador en el tablero actual
  const winner = calculateWinner(squares);
  let status;
  // Actualizar el estado "status" según si hay un ganador o no
  if (winner) {
    status = `Ganador jugador: ${winner}`;
  } else {
    status = `Siguiente jugador: ${xIsNext ? "X" : "O"}`;
  }

  // Renderizar el tablero y los cuadros (Square)
  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

// Componente funcional Game: Representa el juego "Tres en línea".
export default function Game() {
  // Estado para mantener el historial de movimientos y el movimiento actual
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Función que maneja el evento de realizar un movimiento
  function handlePlay(nextSquares) {
    // Crear una nueva copia del historial de movimientos con el nuevo estado del tablero
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Actualizar el estado "history" con el nuevo historial
    setHistory(nextHistory);
    // Actualizar el estado "currentMove" para reflejar el movimiento actual
    setCurrentMove(nextHistory.length - 1);
  }

  // Función que maneja el evento de saltar a un movimiento anterior
  function jumpTo(nextMove) {
    // Actualizar el estado "currentMove" para cambiar al movimiento seleccionado
    setCurrentMove(nextMove);
  }

  // Crear una lista de botones para saltar a movimientos anteriores
  const moves = history.map((squares, move) => {
    let description;
    // Crear la descripción para cada movimiento en la lista de movimientos
    if (move > 0) {
      description = `Ir al movimiento #${move}`;
    } else {
      description = `Ir al inicio del juego`;
    }
    // Renderizar el botón para cada movimiento en la lista de movimientos
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  // Renderizar el juego con el tablero (Board) y la lista de movimientos (moves)
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>
        <ol>
          <li>{(currentMove === 0)
            ? <p>{`Estas comenzando el juego`}</p>
            : <p>{`Estas en el movimiento #${currentMove}`}</p>}
          </li>
        </ol>
      </div>
    </div>
  )
}

// Función para calcular si hay un ganador en el tablero.
const calculateWinner = (squares) => {
  // Lista de posibles combinaciones ganadoras en el tablero
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Verificar si hay un ganador en alguna de las líneas
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null; // Si no hay ganador, retornar null
}
