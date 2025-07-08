import "./globals.css";
import Link from "next/link";
import style from "./layout.module.css";
import { BookData } from "@/types";
import { ReactNode } from "react";

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
      <div>제작 @GGMA</div>
      <div>{bookCount}개의 도서가 등록돼 있습니다</div>
    </footer>
  );
}
//✅ Dynamic -> Static Page로 변경하기
export default function RootLayout({
  children,
  modal, // ✅ paralllel route
}: Readonly<{
  children: React.ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>
            <Link href={"/"}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          <Footer />
        </div>
        {/* ✅ parallel route */}
        {modal}
        {/*  ✅ intercept route 관련 modal 구현 */}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
