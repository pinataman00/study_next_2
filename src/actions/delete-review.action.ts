"use server"

import { revalidateTag } from "next/cache";

export async function deleteReviewAction(_: any, formData: FormData) {
	//당해 ServerAction을,
	//ClientComponent에서 useActionState()와 함께 사용 시...
	//위와 같이 매개변수를 작성함

	//form 값 가져오기
	const reviewId = formData.get("reviewId")?.toString();
	//revalidate 기능 구현을 위해...
	const bookId = formData.get("bookId")?.toString();

	// 예외 처리
	if (!reviewId) {
		return {
			status: false,
			error: "삭제할 리뷰가 없습니다",
		}
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/${reviewId}`, {
			method: "DELETE",
		});

		if (!response.ok) {
			throw new Error(response.statusText); //catch 블록으로 넘기기
		}

		revalidateTag(`review-${bookId}`)

		return {
			status: true,
			error: "",
		}

	} catch (err) {
		return {
			status: false,
			error: `리뷰 삭제에 실패했습니다 ${err}`
		}
	}
}