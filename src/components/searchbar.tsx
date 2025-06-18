"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; //✅ (AppRouter)
import style from "./serachbar.module.css";

export default function Searchbar() {
  const router = useRouter();
  //
  //⚠️ useSearchParams() 비동기 작업임 -> Client단에서 QueryString을 전달해야 종료되는 비동기 함수임...
  const searchParams = useSearchParams(); // ✅🌈useSearchParams? -queryString을 가져오는 기능
  //⚠️ (Terminal) npm run build 시 오류 발생 - build 시에는 query string이 없으니까!
  //-> build time에 useSearchParams()를 통해 QueryString을 불러오려고 하여 문제가 발생함
  //-> build time에는 해당 페이지가 배제되도록 설정할 수 있음... > 오직 Client단에서만 실행되도록 설정하기...
  /*
   ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/search". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
  */
  const [search, setSearch] = useState("");

  const q = searchParams.get("q"); //특정 queryString을 불러올 수 있음

  // router.query.q; //✅ (참고) PageRouter의 router객체는 query란 property가 제공됐었음 != AppRouter의 router객체에는 해당 property가 없음!

  useEffect(() => {
    setSearch(q || "");
  }, [q]);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    if (!search || q === search) return;
    router.push(`/search?q=${search}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className={style.container}>
      <input value={search} onChange={onChangeSearch} onKeyDown={onKeyDown} />
      <button onClick={onSubmit}>검색</button>
    </div>
  );
}
