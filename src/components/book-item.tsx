import type { BookData } from "@/types";
import Link from "next/link";
import style from "./book-item.module.css";

import Image from "next/image"; // ✅ 최적화 > 이미지 최적화

export default function BookItem({
  id,
  title,
  subTitle,
  description,
  author,
  publisher,
  coverImgUrl,
}: BookData) {
  return (
    <Link href={`/book/${id}`} className={style.container}>
      {/*  ✅ 이미지 최적화 */}
      {/* <img src={coverImgUrl} /> */}
      <Image
        src={coverImgUrl}
        width={80}
        height={105}
        alt={`도서 ${title}의 표지 이미지`}
      />
      <div>
        <div className={style.title}>{title}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <br />
        <div className={style.author}>
          {author} | {publisher}
        </div>
      </div>
    </Link>
  );
}
