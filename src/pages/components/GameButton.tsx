import { GameResult } from "@/data/gameResults";
import { GameStatus } from "@/pages/components/Game";

const GameButton = ({
  gameStatus,
  startCountdown,
  countedTime,
  distance,
  stopBag,
  showGameFinishedMessage,
  showGameResultBoard,
  toggleShowGameResultBoard,
  reStartGame,
}: {
  gameStatus: GameStatus;
  startCountdown: () => void;
  countedTime: number;
  distance: number;
  stopBag: (distance: number) => void;
  showGameFinishedMessage: boolean;
  showGameResultBoard: boolean;
  toggleShowGameResultBoard: () => void;
  reStartGame: () => void;
}) => {
  return (
    <>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        {gameStatus === GameStatus.BeforeGameStart && (
          <button
            onClick={startCountdown}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-full"
          >
            낙하 준비 중...
          </button>
        )}
        {gameStatus === GameStatus.CountDown && (
          <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
            {countedTime}초 뒤 낙하
          </button>
        )}
        {gameStatus === GameStatus.GameStart &&
          (distance <= 400 ? (
            <button
              onClick={() => stopBag(distance)}
              className="px-6 py-3 bg-red-500 rounded-full font-bold text-white text-center"
            >
              멈춰라!
            </button>
          ) : (
            <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
              떨어지는중...
            </button>
          ))}
        {gameStatus === GameStatus.GameFinished &&
          !showGameFinishedMessage &&
          !showGameResultBoard && (
            <button className="px-6 py-3 font-bold rounded-full bg-gray-500 text-white text-center">
              멈췄다!
            </button>
          )}
        {gameStatus === GameStatus.GameFinished && showGameFinishedMessage && (
          <button
            onClick={toggleShowGameResultBoard}
            className="px-6 py-3 font-bold rounded-full bg-purple-600 text-white text-center"
          >
            내 당첨 결과 확인하기
          </button>
        )}
        {gameStatus === GameStatus.GameFinished && showGameResultBoard && (
          <button
            onClick={reStartGame}
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
