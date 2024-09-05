import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import './App.css';

const gridSize = 4;

const createBoard = () => {
  let board = Array.from({ length: gridSize * gridSize }, (_, i) => i);
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
};

const PuzzleGame = () => {
  const [tiles, setTiles] = useState(createBoard());
  const [image, setImage] = useState('/images/IMG_5208.jpg');
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setImage('/images/IMG_5208.jpg');
    setTiles(createBoard());
  }, []);

  useEffect(() => {
    if (gameWon) {
      clearInterval(timerRef.current);
      setModalVisible(true);
      setConfettiVisible(true);
    }
  }, [gameWon]);

  useEffect(() => {
    if (!gameWon && image) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [image, gameWon]);

  const handleTileClick = (index) => {
    if (gameWon) return;

    const emptyIndex = tiles.indexOf(0);
    const isAdjacent = [1, -1, gridSize, -gridSize].includes(index - emptyIndex);

    if (isAdjacent && isValidMove(emptyIndex, index)) {
      let newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(m => m + 1);

      if (checkWin(newTiles)) {
        setGameWon(true);
      }
    }
  };

  const isValidMove = (emptyIndex, clickedIndex) => {
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const clickedRow = Math.floor(clickedIndex / gridSize);
    return (
      emptyRow === clickedRow || Math.abs(emptyIndex - clickedIndex) === gridSize
    );
  };

  const checkWin = (tiles) => {
    const winCondition = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    return tiles.every((tile, index) => tile === winCondition[index]);
  };

  const toggleSolution = () => {
    setShowSolution(prev => !prev);
  };

  const solvePuzzle = () => {
    const solvedTiles = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    if (tiles.join(',') !== solvedTiles.join(',')) {
      setTiles(solvedTiles);
      setGameWon(true);
      setMoves(0);
      setTime(0);
    }
  };

  const startNewGame = () => {
    setGameWon(false);
    setMoves(0);
    setTime(0);
    setTiles(createBoard());
    setModalVisible(false);
    setConfettiVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setConfettiVisible(false);
  };

  return (
    <div className="game-container">
      <h1>Пятнашки для моей милашки</h1>
      <div className="stats-container">
        <div className="stats">
          <p>Время: <span>{Math.floor(time / 60)}:{time % 60}</span></p>
        </div>
        <div className="stats">
          <p>Ходы: <span>{moves}</span></p>
        </div>
      </div>
      <div className="game-board">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === 0 ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
            style={{
              backgroundImage: tile !== 0 ? `url(${image})` : 'none',
              backgroundPosition: tile !== 0 ? `${(tile % gridSize) * -100}px ${(Math.floor(tile / gridSize)) * -100}px` : 'none',
            }}
          >
            {tile === 0 && !image && ' '}
          </div>
        ))}
        {showSolution && image && (
          <div className="solution-image" style={{ backgroundImage: `url(${image})` }}></div>
        )}
      </div>
      <div className="controls">
        <button onClick={() => setTiles(createBoard())}>Перемешать</button>
        <button onClick={toggleSolution}>{showSolution ? 'Скрыть решение' : 'Показать решение'}</button>
        <button onClick={solvePuzzle}>Автоматическое решение</button>
      </div>

      {confettiVisible && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Умничка!</h2>
            <p>Мое золотце, моя умница, моя красавица! <br/>Ты гений! Как ты решила это? <br/>Еще никто на этом сайте не мог решить это!<br/><br/>Время: {Math.floor(time / 60)}:{time % 60} - Ходов: {moves}</p>
            <button onClick={startNewGame}>Новая игра</button>
            <button onClick={closeModal}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
