"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; //✅ (AppRouter)
import style from "./serachbar.module.css";

export default function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅🌈useSearchParams? -queryString을 가져오는 기능
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
