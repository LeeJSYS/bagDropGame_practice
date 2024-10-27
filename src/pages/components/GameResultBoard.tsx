import { GameResult } from "@/data/gameResults";
import { GameStatus } from "@/pages/components/Game";

const GameResultBoard = ({
  gameStatus,
  top3Results,
  myBestRecord,
}: {
  gameStatus: GameStatus;
  top3Results: GameResult[];
  myBestRecord: GameResult;
}) => {
  return (
    <>
      {/* 게임결과보드 */}
      {gameStatus === GameStatus.ShowGameResultBoard && (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-4/5 bg-white rounded-xl shadow-xl p-6 z-50">
            {/* 순위 차이 텍스트 */}
            <h2 className="text-center text-xl font-bold text-gray-700 mb-4">
              오늘의 순위
            </h2>

            {/* 순위표 헤더 */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-200 rounded-lg font-bold text-gray-700 mb-2">
              <span>순위</span>
              <span>이름</span>
              <span>기록</span>
            </div>

            {/* 순위표 내용 */}
            <div className="space-y-2">
              {top3Results.map((result, index) => (
                <div
                  key={`${index}-${result.id}-${result.record}`}
                  className="flex justify-between items-center px-4 py-3 rounded-lg bg-gray-100 text-black"
                >
                  <span>{index + 1}위</span>
                  <span>{result.id}</span>
                  <span className="font-mono">{result.record.toFixed(3)}m</span>
                </div>
              ))}
            </div>

            {/* 내 최고 기록 */}
            <div className="flex justify-between items-center mt-4 p-3 bg-gray-200 rounded-lg text-gray-700">
              <span className="font-bold">내 최고 기록</span>
              <span className="font-mono">
                {myBestRecord.record.toFixed(3)}m
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameResultBoard;
