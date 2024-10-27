export type GameResult = {
  id: string;
  record: number;
};

export const gameResults: GameResult[] = [
  { id: "user1", record: 9.123 },
  { id: "user2", record: 4.567 },
  { id: "user3", record: 2.345 },
  { id: "user4", record: 6.789 },
  { id: "user5", record: 3.21 },
  { id: "user6", record: 8.91 },
  { id: "user7", record: 5.432 },
  { id: "user8", record: 7.654 },
  { id: "user9", record: 0.987 },
  { id: "user10", record: 1.234 },
  { id: "user11", record: 9.876 },
  { id: "user12", record: 6.543 },
  { id: "user13", record: 2.345 },
  { id: "user14", record: 5.678 },
  { id: "user15", record: 3.456 },
  { id: "user16", record: 4.321 },
  { id: "user17", record: 8.765 },
  { id: "user18", record: 7.123 },
  { id: "user19", record: 9.999 },
  { id: "user20", record: 0.456 },
  { id: "user21", record: 6.789 },
  { id: "user22", record: 4.987 },
  { id: "user23", record: 2.765 },
  { id: "user24", record: 5.89 },
  { id: "user25", record: 1.678 },
  { id: "user26", record: 9.111 },
  { id: "user27", record: 3.999 },
  { id: "user28", record: 7.888 },
  { id: "user29", record: 5.432 },
  { id: "user30", record: 8.123 },
];

export const addGameResultData = (newResult: GameResult) => {
  gameResults.push(newResult);
  return [...gameResults]; // 변경된 gameResults를 반환
};
