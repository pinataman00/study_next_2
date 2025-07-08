"use client";

import { ReactNode, useEffect, useRef } from "react";
import style from "./modal.module.css";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: ReactNode }) {
  // ✅ createPortal()
  /*
	
		- browser에 존재하는, 'modal-root'란 ID를 갖는 DOM요소 아래에,
		<dialog> 태그가 rendering됨
	

		-> <dialog>로 표현될 Modal은 화면 전체를 뒤덮어야 함!
		-> 따라서 특정 Page의 Component로 구현하는 대신,
		browser상의 특정 DOM요소 아래에 고정적으로 modal 요소를 rendering하는 방식으로 구현할 것임
	*/

  const dialogRef = useRef<HTMLDialogElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      dialogRef.current?.scrollTo({
        top: 0, // ✅ scroll 최상단
      });
    }
  }, []); // ✅ 본 Component가 mount된 순간 실행될 로직

  return createPortal(
    <dialog
      onClose={() => router.back()}
      onClick={(e) => {
        //모달의 배경이 클릭된 경우, "뒤로 가기"
        if ((e.target as any).nodeName === "DIALOG") {
          router.back();
        }
      }}
      className={style.modal}
      ref={dialogRef}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root") as HTMLElement
  );
}
