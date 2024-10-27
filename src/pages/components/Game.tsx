import { gameResults, addGameResultData, GameResult } from "@/data/gameResults";
import GameButton from "@/pages/components/GameButton";
import GameHeaderText from "@/pages/components/GameHeaderText";
import GameResultBoard from "@/pages/components/GameResultBoard";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export enum GameStatus {
  BeforeGameStart = "beforeGameStart",
  CountDown = "countDown",
  GameStart = "gameStart",
  GameFinished = "gameFinished",
  ShowGameFinishedMessage = "showGameFinishedMessage",
  ShowGameResultBoard = "showGameResultBoard",
}

type InGameState = {
  showFirstMessage: boolean;
  gameStatus: GameStatus;
  countedTime: number;
  distance: number;
  brightness: number;
  backgroundPosition: number;
};

const initialStates = {
  showFirstMessage: false,
  gameStatus: GameStatus.BeforeGameStart,
  countedTime: 3,
  distance: 1500, // 초기 높이
  brightness: 30,
  backgroundPosition: 0,
};

const Game = () => {
  const INITIAL_HEIGHT = 1500;
  const DEFAULT_PLAY_TIME = 5;
  const DROP_SPEED = INITIAL_HEIGHT / DEFAULT_PLAY_TIME;
  const INITIAL_BACKGROUND_POSITION = 0;

  // 노란선의 위치
  const yellowLineBackgroundPosition = 85; // 배경의 85%에 노란선 위치
  const BACKGROUND_MOVING_SPEED =
    yellowLineBackgroundPosition / DEFAULT_PLAY_TIME;

  // 게임 내 사용 상태
  const [inGameState, setInGameState] = useState<InGameState>(initialStates);
  // 유저 게임 결과
  const [userResults, setUserResults] = useState<GameResult[]>(gameResults);
  const requestRef = useRef<number>(); // 매 프레임마다 애니메이션 업데이트
  const fallStartTimeRef = useRef<number | null>(null); // 애니메이션 시작 시점부터 경과시간 기록

  // 게임 상태를 변화시키는 함수
  const changeInGameState = (newState: Partial<InGameState>) => {
    setInGameState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  // 게임 상태를 초기화하는 resetGame 함수
  const resetState = () => {
    setInGameState(initialStates); // 초기 상태로 전체 초기화
    fallStartTimeRef.current = null; // ref 값 초기화
  };

  // 카운트다운을 시작하는 함수
  const startCountdown = () => {
    changeInGameState({
      gameStatus: GameStatus.CountDown,
      countedTime: 3,
    }); // 카운트다운 초기화
  };

  // 게임이 시작될 때 설정하는 함수
  const startGame = () => {
    changeInGameState({
      gameStatus: GameStatus.GameStart,
      brightness: 100,
    });
  };

  // 게임 시작 버튼 클릭 시 낙하 시작
  const startFalling = () => {
    fallStartTimeRef.current = null; // 낙하 시작 시점을 초기화
    requestRef.current = requestAnimationFrame(fall); // 애니메이션 프레임 시작
  };

  // useEffect로 카운트다운 관리
  useEffect(() => {
    if (
      inGameState.countedTime > 0 &&
      inGameState.gameStatus === GameStatus.CountDown
    ) {
      const timeout = setTimeout(() => {
        setInGameState((prev) => ({
          ...prev,
          countedTime: prev.countedTime - 1,
        }));
      }, 1000);

      return () => clearTimeout(timeout); // cleanup 함수
    } else if (
      inGameState.countedTime === 0 &&
      inGameState.gameStatus === GameStatus.CountDown
    ) {
      startGame(); // 게임시작
    }
  }, [inGameState.gameStatus, inGameState.countedTime]);

  // 배경 이동 함수
  const fall = (timestamp: number) => {
    if (!fallStartTimeRef.current) fallStartTimeRef.current = timestamp; // 첫 프레임 시작 시간 기록

    const elapsedTime = (timestamp - fallStartTimeRef.current) / 1000; // 경과 시간 (초)
    const newBackgroundPosition =
      INITIAL_BACKGROUND_POSITION + elapsedTime * BACKGROUND_MOVING_SPEED; // 경과 시간에 따른 배경 위치 계산
    const newDistance = Math.abs(INITIAL_HEIGHT - elapsedTime * DROP_SPEED);
    changeInGameState({
      backgroundPosition: newBackgroundPosition,
      distance: newDistance,
    });
    requestRef.current = requestAnimationFrame(fall); // 다음 프레임 요청
  };

  // 낙하 중지 및 거리 계산
  const stopBag = useCallback((currentDistance: number) => {
    const newResult = {
      id: "user-me",
      record: Number(currentDistance.toFixed(3)),
    };

    const updatedGameResults = addGameResultData(newResult);
    setUserResults(updatedGameResults);

    // 게임 상태 변경
    changeInGameState({
      gameStatus: GameStatus.GameFinished,
    });
  }, []);

  const showGameResultBoard = () => {
    changeInGameState({
      gameStatus: GameStatus.ShowGameResultBoard,
    });
  };
  const reStartGame = () => {
    changeInGameState({
      gameStatus: GameStatus.BeforeGameStart,
    });
  };

  // 사용자가 정지 하지 않는 경우: 일정 범위를 지나면 애니메이션 중지
  useEffect(() => {
    if (inGameState.backgroundPosition >= yellowLineBackgroundPosition + 5) {
      stopBag(inGameState.distance);
    }
  }, [inGameState.backgroundPosition, inGameState.distance, stopBag]);

  useEffect(() => {
    switch (inGameState.gameStatus) {
      case GameStatus.BeforeGameStart:
        resetState();
        const messageInterval = setInterval(() => {
          setInGameState((prev) => ({
            ...prev,
            showFirstMessage: !prev.showFirstMessage,
          }));
        }, 2000);

        return () => clearInterval(messageInterval);
      case GameStatus.CountDown:
        //별도 useEffect 사용
        break;
      case GameStatus.GameStart:
        startFalling();
        break;
      case GameStatus.GameFinished:
        cancelAnimationFrame(requestRef.current!);
        const timer = setTimeout(() => {
          changeInGameState({
            gameStatus: GameStatus.ShowGameFinishedMessage,
          });
        }, 1500);
        return () => clearTimeout(timer);
      case GameStatus.ShowGameFinishedMessage:
        break;
      case GameStatus.ShowGameResultBoard:
        break;
    }
  }, [inGameState.gameStatus]);

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
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat transition-transform"
        style={{
          backgroundImage: `url('/sky.png')`,
          backgroundPosition: `0px ${inGameState.backgroundPosition}%`,
          filter: `brightness(${inGameState.brightness}%)`,
        }}
      ></div>

      <GameHeaderText
        gameStatus={inGameState.gameStatus}
        showFirstMessage={inGameState.showFirstMessage}
        distance={inGameState.distance}
        top3Results={top3Results}
      />

      {inGameState.gameStatus === GameStatus.CountDown && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-6xl">
          {inGameState.countedTime}
        </div>
      )}

      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-24 h-24">
        <Image
          src="/gucci_bag.jpeg"
          alt="Gucci Bag"
          width={96}
          height={96}
          className="rounded-full border-4 border-white"
        />
        {inGameState.gameStatus === GameStatus.GameStart && (
          <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-lg">
            <span>{inGameState.distance.toFixed(3)}m</span>
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 border-[10px] border-transparent border-t-black"></div>
          </div>
        )}
      </div>

      <GameResultBoard
        gameStatus={inGameState.gameStatus}
        top3Results={top3Results}
        myBestRecord={myBestRecord}
      />

      <GameButton
        gameStatus={inGameState.gameStatus}
        startCountdown={startCountdown}
        countedTime={inGameState.countedTime}
        distance={inGameState.distance}
        stopBag={stopBag}
        showGameResultBoard={showGameResultBoard}
        reStartGame={reStartGame}
      />
    </div>
  );
};

export default Game;
