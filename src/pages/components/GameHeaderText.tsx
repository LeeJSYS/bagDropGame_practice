import { GameResult } from "@/data/gameResults";
import { GameStatus } from "@/pages/components/Game";

const GameHeaderText = ({
  gameStatus,
  showFirstMessage,
  distance,
  top3Results,
}: {
  gameStatus: GameStatus;
  showFirstMessage: boolean;
  distance: number;
  top3Results: GameResult[]; // Replace 'any' with the appropriate type
}) => {
  return (
    <>
      {/* 상단 텍스트 */}
      {gameStatus === GameStatus.BeforeGameStart && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-center text-xl font-bold">
          {showFirstMessage
            ? "진짜 구찌 가방을 받아요"
            : "구찌 가방을 선에 가깝게 멈추세요"}
        </div>
      )}
      {gameStatus === GameStatus.GameFinished && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-center text-xl font-bold">
          잘 했어요! 내 기록은 {distance.toFixed(3)}m
        </div>
      )}
      {gameStatus === GameStatus.ShowGameFinishedMessage && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-center text-xl font-bold">
          노란 선에 가장 가까운 1명은 구찌 가방을 받아요
        </div>
      )}
      {gameStatus === GameStatus.ShowGameResultBoard && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-center text-xl font-bold">
          1위와 나는{" "}
          {Math.abs(
            Math.round(distance * 1000 - top3Results[0].record * 1000) / 1000
          )}
          m 차이에요!
        </div>
      )}
    </>
  );
};

export default GameHeaderText;
