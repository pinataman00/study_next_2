"use client";

import { useRouter } from "next/navigation"; //✅ import대상 유의
import { startTransition, useEffect } from "react";

//✅ ⚠️ 반드시 ClientComponent
// (이유) Server/Client단 어떤 곳에서 발생한 오류든 cover해야 하기 때문임
//-> ClientComponent = Server/Client 단 모두에서 실행됨

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // ✅ window.location.reload()의 대안
  const router = useRouter();

  useEffect(() => {
    //✅ [React.js] useEffect 복습
    console.error(error.message);
  }, [error]);

  return (
    <div>
      <h3>검색 과정에서 오류가 발생했습니다</h3>
      <button
        onClick={() => {
          // ⚠️ reset() -> "Server Component"를 다시 실행하진 않음
          // -> (BE Server에서 실행하는) data-fetching을 다시 실행하지 않는다는 뜻
          // -> "Client Component 내부에서 발생한 오류"만 복구 시도할 수 있음
          // (server로부터 전달받은 data(가 있다고 상정하고 해당 data)를 이용해 화면을 다시 한 번 rendering할 뿐임)
          //   reset();

          // ✅ (Browser API)새로고침 > Server Component도 다시 실행함
          // -> 이 경우는... 그러나 바람직하진 않음. 각종 data 유실되고 전체 rendering이니까...

          // window.location.reload();

          startTransition(() => {
            //콜백 함수 => 해당 함수 내부의, 'UI 변경 관련 작업'을 일괄 처리함
            router.refresh();
            reset();
          });
          // ✅ router.refresh - 현재 page에서 ServerComponent만 빠르게 업데이트시키는 메서드
          //router.refresh(); //ServerComponent만 새롭게 rendering함 (⚠️단, 비동기적인 메서드임...작업 완료 전에 하기의 비즈니스 로직이 실행될 수 있음)
          //reset();
          //reset - 상기 과정으로 새롭게 rendering된 ServerComponent의 data를 화면에 새롭게 rendering하기
          //현재 page의 에러 상태를 초기화하고, Component들을 다시 rendering하는 역할 수행

          // ✅ router.refresh() -> reset()
          //- 현재 Page가 error 상태에 있다 - Error 상태 = ClientComponent임
          //- router.refresh() - ServerComponent를 다시 rendering해도, ClientComponent인 본 Error Componenet는 사라지지 않음
          //- router.refresh()이후, Error상태를 초기화해주는 reset() 를 호출하는 것
          //=> ServerComponent의 결과 값 재계산 + Error상태 초기화 => (결과) Page 복구
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
