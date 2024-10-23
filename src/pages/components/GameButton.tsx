import { GameResult } from "@/data/gameResults";

const GameButton = ({
  gameStatus,
  startGame,
  countedTime,
  distance,
  stopBag,
  showGameResultBoard,
  resetGame,
  userResults,
}: {
  gameStatus: string;
  startGame: () => void;
  countedTime: number;
  distance: number;
  stopBag: (userResults: GameResult[], distance: number) => void;
  showGameResultBoard: () => void;
  resetGame: () => void;
  userResults: GameResult[];
}) => {
  return (
    <>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        {gameStatus === "beforeGameStart" && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-full"
          >
            낙하 준비 중...
          </button>
        )}
        {gameStatus === "countDown" && (
          <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
            {countedTime}초 뒤 낙하
          </button>
        )}
        {gameStatus === "gameStart" &&
          (distance <= 400 ? (
            <button
              onClick={() => stopBag(userResults, distance)}
              className="px-6 py-3 bg-red-500 rounded-full font-bold text-white text-center"
            >
              멈춰라!
            </button>
          ) : (
            <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
              떨어지는중...
            </button>
          ))}
        {gameStatus === "gameFinished" && (
          <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
            멈췄다!
          </button>
        )}
        {gameStatus === "showGameFinishedMessage" && (
          <button
            onClick={showGameResultBoard}
            className="px-6 py-3 font-bold rounded-full bg-purple-600 text-white text-center"
          >
            내 당첨 결과 확인하기
          </button>
        )}
        {gameStatus === "showGameResultBoard" && (
          <button
            onClick={resetGame}
            className="px-6 py-3 font-bold rounded-full bg-purple-600 text-white text-center"
          >
            다시 도전하기
          </button>
        )}
      </div>
    </>
  );
};

export default GameButton;
