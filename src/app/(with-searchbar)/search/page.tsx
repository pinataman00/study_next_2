// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import { BookData } from "@/types";

// import { useSearchParams } from "next/navigation"; // ⚠️ (ReactHook)useSearchParams는 사용하지 않음! 왜냐면 ServerComponent니까!

// ✅ Dynamic -> Static Page 변경하기? > 불가! > QueryString 같은 동적 값에 의존함. FullRouteCache 포기!
//-> 페이지 생성 최적화 방법 > data cache 옵션 설정하기 > force-cache
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams; // ✅현재 페이지에 전달된 QueryString

  const response = await fetch(
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
