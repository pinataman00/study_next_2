"use client";
import { useEffect } from "react";

//✅ 반드시 ClientComponent - Server/Client단 어떤 곳에서 발생한 오류든 cover해야 하기 때문임
//-> ClientComponent = Server/Client 단 모두에서 실행됨

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    //✅ [React.js] useEffect 복습
    console.error(error.message);
  }, [error]);

  return (
    <div>
      <h3>오류가 발생했습니다</h3>
      <button
        onClick={() => {
          // ⚠️ reset() -> Server Component를 다시 실행하진 않음
          // -> data-fetching을 다시 실행하지 않는다는 뜻
          // -> Client Component 내부에서 발생한 오류만 복구 시도할 수 있음
          // server로부터 전달받은 data를 이용해 화면을 다시 한 번 rendering할 뿐임
          //   reset();
          // ✅ 새로고침 > Server Component도 다시 실행함
          // -> 이 경우는... 그러나 바람직하진 않음. 각종 data 유실되고 전체 rendering이니까...

          window.location.reload();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
