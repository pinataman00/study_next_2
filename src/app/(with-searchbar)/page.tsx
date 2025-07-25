import BookItem from "@/components/book-item";
import style from "./page.module.css";
// import books from "@/mock/books.json"; // ✅ 임시 데이터로서 rendering  중임...
import { BookData } from "@/types";
// import { delay } from "@/util/delay";
// import { Suspense } from "react";
// import BookItemSkeleton from "@/components/skeleton/book-item-skeleton";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { Metadata } from "next";

//✅ Route Segment Option
// export const dynamic = ''; //특정 Page의 유형을 "강제로" Static, Dynamic Page로 설정함
/**
 *  유형
 *  1. auto
 *      - 아무것도 강제하지 않음 (동적함수/data-fetching 시 설정된 cache 옵션에 따라 자동으로 설정됨...)
 *      - (default) 기본 값이므로 생략해도 됨
 *  2. force-dynamic
 *      - Page를 강제로 DynamicPage라고 설정함
 *  3. force-static
 *      - Page를 강제로 StaticPage라고 설정함
 *  4. error
 *      - Page를 강제로 StaticPage로 설정함
 *      - 단, 동적함수||caching 되지 않는 data-fetching 등... Static으로 설정하면 안 되는 이유가 있을 경우, build error를 발생시킴
 *
 */
// export const dynamic = "force-dynamic";

//✅ DATA-FETCHING > API 호출하기
/** - 대상 API가 2개 이상일 경우 > Component를 분리함 > 가독성 제고
 * 1. 모든 도서
 * 2. 랜덤 도서 (추천 도서)
 */

// ✅비동기 > async
async function AllBooks() {
  // await delay(1500); //✅ Suspense 적용 > fetching 시간을 일부러 지연시키기

  // const response = await fetch(`http://localhost:12345/book`); // data-fetching로직을 Component안에 작성할 수 있게 됨
  const response = await fetch(
    //✅ 환경변수(.env) 사용하기
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    // ✅ fetch() > cache
    // { cache: "no-store" } //->  ✅DynamicPage가 되는 이유임...
    { cache: "force-cache" } //->  ✅StaticPage로 변경하기 위해 cache설정을 변경함
  ); // data-fetching로직을 Component안에 작성할 수 있게 됨
  if (!response.ok) {
    //✅ 예외처리
    return <div>오류가 발생했습니다...</div>;
  }
  const allBooks: BookData[] = await response.json(); //✅ TypeScript 타입 특정하기

  return (
    <div>
      {allBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

async function RecoBooks() {
  // await delay(3000); //✅ Suspense 적용 > fetching 시간을 일부러 지연시키기
  // const response = await fetch(`http://localhost:12345/book/random`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`, //✅ auto no cache...
    // { cache: "force-cache" } // ✅ 언제나 cache된 data...
    { next: { revalidate: 3 } } // ✅ 3초마다 data 갱신하기... > Full Route Cache 조건 만족
  );
  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }
  const recoBooks: BookData[] = await response.json();

  return (
    <div>
      {recoBooks.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

// export const dynamic = "force-dynamic"; //static -> dynamic 강제 변경 => <Suspense/>도 지우기

//✅ meta data 설정하기 - '약속된 이름의 변수'로서, 해당 변수의 초기값이 곧 metadata의 속성이 됨
export const metadata: Metadata = {
  title: "한입 북스",
  description: "한입 북스에 등록된 도서를 만나보세요",
  openGraph: {
    title: "한입 북스",
    description: "한입 북스에 등록된 도서를 만나보세요",
    images: ["/thumbnail.png"], // ✅ / 경로 > public 디렉터리를 의미함
  },
};

//✅ index page - Static Page로 변경하기...
export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {/* <Suspense fallback={<div>도서를 불러오는 중입니다...</div>}> */}
        {/* <Suspense fallback={<BookListSkeleton count={3} />}> */}
          <RecoBooks />
        {/* </Suspense> */}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {/* <Suspense fallback={<BookListSkeleton count={10} />}> */}
          <AllBooks />
        {/* </Suspense> */}
      </section>
    </div>
  );
}
