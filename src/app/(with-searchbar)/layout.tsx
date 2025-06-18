import { ReactNode, Suspense } from "react";
import Searchbar from "../../components/searchbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* ⚠️ <Suspense/> 대상 Component의 비동기 작업이 마무리될 때까지는, 대체 UI를 출력하며, 대상 Component는 suspense(미완성) 상태로 남아있게 됨
      -> (Streaming 섹션에서 심화) 내장Component - build time에는 존재하지 않는 값을 활용&&ReactHook을 상용하는, ClientComponent 감싸주기 
      -> Server단에서의 사전 rendering 과정에서 해당 Component는 완전히 배제되며, 오직 Client단에서만 rendering되는 Component로 설정됨
      */}
      {/* <div>Loading...</div> 대체 UI 설정 */}
      <Suspense fallback={<div>Loading...</div>}>
        <Searchbar />
      </Suspense>
      {children}
    </div>
  );
}
