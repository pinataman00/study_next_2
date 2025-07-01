import style from "./review-editor.module.css";
import { createReviewAction } from "@/actions/create-review.action";

export default function ReviewEditor({ bookId }: { bookId: string }) {
  //✅ src/actions/create-review.action.ts
  return (
    <section>
      <form className={style.form_container} action={createReviewAction}>
        {/* ✅ input을 사용한 고정 값 전달 방법 */}
        {/* ⚠️ hidden 트릭 사용 시, readOnly 속성도 작성할 것 */}
        <input name="bookId" value={bookId} hidden readOnly />
        <textarea required name="content" placeholder="리뷰 내용" />
        <div className={style.submit_container}>
          <input required name="author" placeholder="작성자" />
          <button type="submit">작성하기</button>
        </div>
      </form>
    </section>
  );
}
