// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { delay } from "@/util/delay";
import { Suspense } from "react";

async function SearchResult({ q }: { q: string }) {
  // ✅ Streaming > Suspense Component

  await delay(1500);
  const response = await fetch(
    //✅ (Streaming) 비동기 함수 > 소요 시간 만큼, 전체 Page의 rendering시간이 지연될 수 있음...
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`,
    { cache: "force-cache" }
  );

  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }

  const books: BookData[] = await response.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  // searchParams: { q?: string };
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    //  ✅ Streaming > Suspense - 내부의 Component가 비동기 작업이 완료되기 전까지, "미완성 상태"로 남겨둠
    //fallback= 대체UI를 대입하면 됨
    //key = 값이 변할 때마다 loading상태로 돌아감 > (React) key값이 바뀜 = Component가 완전히 달라짐||다른 Component가 생겼음, 으로 인식함
    <Suspense
      // key={searchParams.q || ""}
      key={q || ""}
      fallback={<BookListSkeleton count={3} />}
    >
      {/* <SearchResult q={searchParams.q || ""} /> */}
      <SearchResult q={q || ""} />
    </Suspense>
  );
}
