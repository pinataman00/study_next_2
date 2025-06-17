import BookItem from "@/components/book-item";
import style from "./page.module.css";
import books from "@/mock/books.json"; // ✅ 임시 데이터로서 rendering  중임...
import { BookData } from "@/types";

//✅ DATA-FETCHING > API 호출하기
/** - 대상 API가 2개 이상일 경우 > Component를 분리함 > 가독성 제고
 * 1. 모든 도서
 * 2. 랜덤 도서 (추천 도서)
 */

// ✅비동기 > async
async function AllBooks() {
  // const response = await fetch(`http://localhost:12345/book`); // data-fetching로직을 Component안에 작성할 수 있게 됨
  const response = await fetch(
    //✅ 환경변수(.env) 사용하기
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    // ✅ fetch() > cache
    { cache: "no-store" }
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
  // const response = await fetch(`http://localhost:12345/book/random`);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`, //✅ auto no cache...
    // { cache: "force-cache" } // ✅ 언제나 cache된 data...
    { next: { revalidate: 3 } } // ✅ 3초마다 data 갱신하기...
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

export default function Home() {
  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {/* {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))} */}
        <RecoBooks />
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {/* {allBooks.map((book: BookData) => (
          <BookItem key={book.id} {...book} />
        ))} */}
        <AllBooks />
      </section>
    </div>
  );
}
