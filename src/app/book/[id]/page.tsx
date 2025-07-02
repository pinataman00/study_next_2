import { notFound } from "next/navigation";
import style from "./page.module.css";
// import { useParams } from "next/navigation";
import { BookData, ReviewData } from "@/types";

// import { createReviewAction } from "@/actions/create-review.action"; // ✅ ServerAction 파일 불러오기
import ReviewItem from "@/components/review-item";

import ReviewEditor from "@/components/review-editor";

// ✅ generateStaticParams()에 명시하지 않은 페이지 요청 접수 시, 무조건 404페이지로 전환하기
//※ DB 상에는 id:4에 해당하는 페이지가 존재한다고 해도, 상기 함수에 설정되지 않은 값이라면 없는 페이지로 간주됨! 404!
// export const dynamicParams = false; //반대의 경우, true로 초기화하거나 아니면 기본 값이 true이므로 삭제할 것...

export function generateStaticParams() {
  //⭐ Page설정 > Static Page
  // ✅정적 parameter를 생성하는 함수 -> 다음의 정적 parameter에 해당하는 Page들을 build time에 만듦
  return [{ id: "1" }, { id: "2" }, { id: "3" }]; //⚠️ URL Parameter의 값은 반드시 "문자열"이어야 함!
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`
  );
  if (!response.ok) {
    if (response.status === 404) {
      // ✅ 개선 > 존재하지 않는 값일 경우
      notFound(); //자동으로 404페이지로 redirect함! -> 404페이지 만들기...
    }
    return <div>오류가 발생했습니다...</div>;
  }
  const book: BookData = await response.json();

  const { title, subTitle, description, author, publisher, coverImgUrl } = book; // ✅구조분해할당

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <img src={coverImgUrl} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } } // ⭐ 재검증 - 태그 기준 (create-review.action.ts파일과 함께 보기)
  );

  if (!response.ok) {
    // Error Handler 사용하기 - error.tsx파일
    throw new Error(`Review fetch failed : ${response.statusText}`);
  }

  const reviews: ReviewData[] = await response.json();

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem {...review} key={`review-item-${review.id}`} />
      ))}
    </section>
  );
}

export default async function Page({
  params,
}: {
  // ✅ URL Parameter에 의존 > (default) Dynamic Page임
  //-> Static Page로 변경하는 법...?
  //-> URL Parameter로 들어올 id들을 미리 알려주면 됨...

  // params: Promise<{ id?: string | string[] }>; // URL Parameter > 자동 전달되는 props 중 하나임... ※ catch-all-segment > string[]

  //⚠️ data-cache 설정을 별도로 하지 않아도, 위에서 URL Parameter를 명시한 페이지는 강제로 StaticPage가 됨
  // params: { id: string };
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className={style.container}>
      {/* <BookDetail bookId={params.id} />
      <ReviewEditor bookId={params.id} /> */}
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>
  );
}
