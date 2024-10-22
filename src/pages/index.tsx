import dynamic from "next/dynamic";

// 클라이언트 사이드에서만 렌더링되는 컴포넌트
const ClientOnlyComponent = dynamic(() => import("./components/Game"), {
  ssr: false,
});

const Home = () => {
  return (
    <>
      <ClientOnlyComponent />
    </>
  );
};

export default Home;
