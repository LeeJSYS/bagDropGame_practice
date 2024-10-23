import { gameResults, addGameResultData, GameResult } from "@/data/gameResults";
import GameButton from "@/pages/components/GameButton";
import GameHeaderText from "@/pages/components/GameHeaderText";
import GameResultBoard from "@/pages/components/GameResultBoard";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const initialStates = {
  showFirstMessage: false,
  gameStatus: "beforeGameStart",
  countedTime: 3,
  distance: 1500, // 초기 높이
  brightness: 30,
  backgroundPosition: 0,
  isYellowLineVisible: false,
};

const Game = () => {
  const INITIAL_HEIGHT = 1500;
  const DEFAULT_PLAY_TIME = 5;
  const DROP_SPEED = INITIAL_HEIGHT / DEFAULT_PLAY_TIME;
  const INITIAL_BACKGROUND_POSITION = 0;

  // 노란선의 위치
  const yellowLineBackgroundPosition = 85; // 배경의 85%에 노란선 위치
  //   const yellowLinePosition = 0; // 0m인 지점에 노란선 위치
  const BACKGROUND_MOVING_SPEED =
    yellowLineBackgroundPosition / DEFAULT_PLAY_TIME;

  const [showFirstMessage, setShowFirstMessage] = useState(
    initialStates.showFirstMessage
  );
  const [gameStatus, setGameStatus] = useState<string>(
    initialStates.gameStatus
  );
  const [countedTime, setCountedTime] = useState(initialStates.countedTime);
  const [distance, setDistance] = useState(initialStates.distance); // 초기 높이 1500m
  const [brightness, setBrightness] = useState(initialStates.brightness); // 기본 밝기
  const [backgroundPosition, setBackgroundPosition] = useState<number>(
    initialStates.backgroundPosition
  );
  /*
  const [isYellowLineVisible, setIsYellowLineVisible] = useState(
    initialStates.isYellowLineVisible
  );
  */
  const [userResults, setUserResults] = useState<GameResult[]>(gameResults);

  const requestRef = useRef<number>(); // 매 프레임마다 애니메이션 업데이트
  const fallStartTimeRef = useRef<number | null>(null); // 애니메이션 시작 시점부터 경과시간 기록

  // 게임 상태를 초기화하는 resetGame 함수
  const resetGame = () => {
    setShowFirstMessage(initialStates.showFirstMessage);
    setGameStatus(initialStates.gameStatus);
    setCountedTime(initialStates.countedTime);
    setDistance(initialStates.distance);
    setBrightness(initialStates.brightness);
    setBackgroundPosition(initialStates.backgroundPosition);
    // setIsYellowLineVisible(initialStates.isYellowLineVisible);

    // 애니메이션 프레임도 중지
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current!);
    }
    fallStartTimeRef.current = null;
  };

  // 게임 시작 버튼 클릭 시 카운트다운 시작
  const startGame = () => {
    setGameStatus("countDown");
    setCountedTime(3); // 카운트다운을 3으로 초기화

    const countdownInterval = setInterval(() => {
      setCountedTime((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setGameStatus("gameStart");
          startFalling(); // 카운트다운이 끝나면 가방이 떨어짐
          setBrightness(100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 게임 시작 버튼 클릭 시 낙하 시작
  const startFalling = () => {
    fallStartTimeRef.current = null; // 낙하 시작 시점을 초기화
    requestRef.current = requestAnimationFrame(fall); // 애니메이션 프레임 시작
  };

  // 배경 이동 함수
  const fall = (timestamp: number) => {
    if (!fallStartTimeRef.current) fallStartTimeRef.current = timestamp; // 첫 프레임 시작 시간 기록

    const elapsedTime = (timestamp - fallStartTimeRef.current) / 1000; // 경과 시간 (초)
    const newBackgroundPosition =
      INITIAL_BACKGROUND_POSITION + elapsedTime * BACKGROUND_MOVING_SPEED; // 경과 시간에 따른 배경 위치 계산
    const newDistance = Math.abs(INITIAL_HEIGHT - elapsedTime * DROP_SPEED);
    setBackgroundPosition(newBackgroundPosition); // 배경 위치 업데이트
    setDistance(newDistance); // 거리 값 업데이트
    requestRef.current = requestAnimationFrame(fall); // 다음 프레임 요청
  };

  // 낙하 중지 및 거리 계산
  const stopBag = useCallback(
    (currentUserResults: GameResult[], currentDistance: number) => {
      setGameStatus("gameFinished");
      setUserResults([
        ...currentUserResults,
        { id: "user-me", record: Number(currentDistance.toFixed(3)) },
      ]);
      addGameResultData({
        id: "user-me",
        record: Number(currentDistance.toFixed(3)),
      });
    },
    []
  );

  const showGameResultBoard = () => {
    setGameStatus("showGameResultBoard");
  };

  // 2초마다 메시지 변경
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setShowFirstMessage((prev) => !prev);
    }, 2000);

    return () => clearInterval(messageInterval); // 컴포넌트 언마운트 시 클리어
  }, []);

  useEffect(() => {
    if (gameStatus === "gameFinished") {
      const timer = setTimeout(() => {
        setGameStatus("showGameFinishedMessage");
        clearTimeout(timer);
      }, 1500);
    }
  }, [gameStatus]);

  useEffect(() => {
    // 게임 중지
    if (
      gameStatus === "gameFinished" ||
      backgroundPosition >= yellowLineBackgroundPosition + 5 // 노란선이 상단 도달하는것 구현 미비
    ) {
      cancelAnimationFrame(requestRef.current!); // 애니메이션 중지
      stopBag(userResults, distance); // 노란선이 화면 상단에 가면 자동으로 게임 멈춤
      return;
    }
  }, [gameStatus, backgroundPosition, userResults, distance, stopBag]);

  const getTop3Results = useCallback((results: GameResult[]) => {
    return results
      .slice() // 원본 배열을 수정하지 않기 위해 복사본 생성
      .sort((a, b) => a.record - b.record) // record를 숫자로 변환하여 오름차순 정렬
      .slice(0, 3); // 상위 3개만 추출
  }, []);

  const getMyBestRecord = useCallback((results: GameResult[]) => {
    return results
      .filter((elem) => elem.id === "user-me")
      .sort((a, b) => a.record - b.record)[0];
  }, []);

  const top3Results = useMemo(
    () => getTop3Results(userResults),
    [getTop3Results, userResults]
  );
  const myBestRecord = useMemo(
    () => getMyBestRecord(userResults),
    [getMyBestRecord, userResults]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-blue-500">
      {/* 배경 - 배경 이미지가 위로 이동하면서 슬라이드 */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat transition-transform"
        style={{
          backgroundImage: `url('/sky.png')`, // 하늘 이미지 적용
          backgroundPosition: `0px ${backgroundPosition}%`, // 배경 이미지의 위치 조정
          filter: `brightness(${brightness}%)`, // 하늘 밝기 조정
        }}
      ></div>

      <GameHeaderText
        gameStatus={gameStatus}
        showFirstMessage={showFirstMessage}
        distance={distance}
        top3Results={top3Results}
      />

      {/* 카운트다운 */}
      {gameStatus === "countDown" && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-6xl">
          {countedTime}
        </div>
      )}

      {/* 구찌 가방 */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-24 h-24">
        <Image
          src="/gucci_bag.jpeg"
          alt="Gucci Bag"
          className="rounded-full border-4 border-white"
        />
        {/* 실시간 거리 표시 */}
        {gameStatus === "gameStart" && (
          <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-lg">
            <span>{distance.toFixed(3)}m</span>
            {/* 말풍선의 아래쪽 화살표 */}
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 border-[10px] border-transparent border-t-black"></div>
          </div>
        )}
      </div>

      {/* 노란선 */}
      {/* {isYellowLineVisible && (
        <div
          className="absolute w-full h-2 bg-yellow-500"
          style={{
            bottom: `${(backgroundPosition / 100) * window.innerHeight}px`, // 노란선이 배경 위치에 맞춰 이동
          }}
        ></div>
      )} */}

      <GameResultBoard
        gameStatus={gameStatus}
        top3Results={top3Results}
        myBestRecord={myBestRecord}
      />

      {/* 하단 버튼 */}
      <GameButton
        gameStatus={gameStatus}
        startGame={startGame}
        countedTime={countedTime}
        distance={distance}
        stopBag={stopBag}
        showGameResultBoard={showGameResultBoard}
        resetGame={resetGame}
        userResults={userResults}
      />
    </div>
  );
};

export default Game;
