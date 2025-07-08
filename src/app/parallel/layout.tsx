import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({
  children,
  sidebar,
  feed,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  feed: ReactNode;
}) {
  return (
    <div>
      <div>
        {/* ✅ 
		- 각각의 slot이 '이전의 Page'를 유지하는 경우는...
		오직 LinkComponent로써 CSR(Client Side Rendering)방식으로 Page를 rendering할 때만 해당됨
		- 주소창에 직접 URI를 입력할 경우(/새로고침 시)에는... 404에러 발생 > 왜냐면 아예 새로 rendering할 때는 '이전 Page'라는 게 없으니까!
		-> ✅ 오류 방지를 위해, default.tsx 파일 생성 필요
		*/}
        <Link href="/parallel">parallel</Link>
        &nbsp;
        <Link href="/parallel/setting">parallel</Link>
      </div>
      <br />
      {sidebar}
      {feed}
      {children}
    </div>
  );
}
