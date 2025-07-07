"use client";

import { deleteReviewAction } from "@/actions/delete-review.action";
import { useActionState, useEffect, useRef } from "react";

export default function ReviewItemDeleteButton({
  reviewId,
  bookId,
}: {
  reviewId: number;
  bookId: number;
}) {
  //  ✅ '삭제하기'는 <button/>이 아니므로 onSubmit을 사용할 수 없음... 대신 다음과 같이 구현할 수 있음
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    deleteReviewAction,
    null //state의 기본 값
  );

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input readOnly hidden value={reviewId} name="reviewId" />
      <input readOnly hidden value={bookId} name="bookId" />
      {/*  ✅ ClientComopnent + ServerAction - 중복 제출 방지 */}
      {isPending ? (
        <div>...</div>
      ) : (
        <div onClick={() => formRef.current?.requestSubmit()}>삭제하기</div>
      )}
    </form>
  );
}
