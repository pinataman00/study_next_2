"use client"; // ✅ ClientComponent의 ServerAction

/**
 * 1. 로딩 상태 표현 (loading bar UI 등)
 * 2. form 중복 제출 방지
 */

import style from "./review-editor.module.css";
import { createReviewAction } from "@/actions/create-review.action";
import { useActionState, useEffect } from "react"; // ✅React.js Ver.19부터 추가됨 - form태그의 상태 handling 관련 hook 제공

export default function ReviewEditor({ bookId }: { bookId: string }) {
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  ); // ✅ <form/>의 action 관련임... (action의 상태, serverAction, 초기 값)

  // ✅ 상기 state의 값에 따라 로직이 전개되어야 하므로...
  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  //✅ src/actions/create-review.action.ts
  return (
    <section>
      {/* <form className={style.form_container} action={createReviewAction}> */}
      <form className={style.form_container} action={formAction}>
        {/* ✅ input을 사용한 고정 값 전달 방법 */}
        {/* ⚠️ hidden 트릭 사용 시, readOnly 속성도 작성할 것 */}
        <input name="bookId" value={bookId} hidden readOnly />
        <textarea
          disabled={isPending}
          required
          name="content"
          placeholder="리뷰 내용"
        />
        <div className={style.submit_container}>
          <input
            disabled={isPending}
            required
            name="author"
            placeholder="작성자"
          />

          <button disabled={isPending} type="submit">
            {isPending ? "..." : "작성하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
