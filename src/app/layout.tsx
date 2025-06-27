import "./globals.css";
import Link from "next/link";
import style from "./layout.module.css";
import { BookData } from "@/types";

async function Footer() {
  const response = await fetch(
    // ✅ data-fetching > 강제 cache 설정! (미설정 시, no-cache됨 -> DynamicPage가 됨...)
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" }
  );
  if (!response.ok) {
    return <footer>제작 @winterlood</footer>;
  }
  const books: BookData[] = await response.json();
  const bookCount = books.length;

  return (
    <footer>
      <div>제작 @winterlood</div>
      <div>{bookCount}개의 도서가 등록돼 있습니다</div>
    </footer>
  );
}
//✅ Dynamic -> Static Page로 변경하기
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>
            <Link href={"/"}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          {/* <footer>제작 @winterlood</footer> */}
          {/* TODO 250627) Footer 임시 주석 처리... */}
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
}
