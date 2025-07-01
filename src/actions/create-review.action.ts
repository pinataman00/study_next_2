"use server";
import { revalidatePath } from "next/cache";

//✅ ⭐ Server Action 설정 -> 다음 코드를 실행하는 API가 자동 생성됨
//별도의 action.ts로 관리할 경우, 파일 최상단에 "use server"를 작성함

export async function createReviewAction(formData: FormData) {

	//✅ formData 값 가져오기 (+ Type 추론 - 데이터가 있을 경우에는 string타입임을 명시하기. toString() 사용)
	const content = formData.get("content")?.toString();
	const author = formData.get("author")?.toString();

	const bookId = formData.get("bookId")?.toString();

	// console.log(bookId, content, author);

	if (!content || !author || !bookId) {
		return;
	}

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
			{
				method: "POST",
				body: JSON.stringify({ bookId, content, author }),
			}
		);
		console.log(response.status);
		//⭐ 재검증하기 = Next.js의 Server에 revalidate(경로)의 '경로'에 해당하는 Page를 재검증하라 = 재생성하라, 요청함
		//= ServerAction의 결과를 화면에 바로 반영할 수 있음
		/**
		 *  ⚠️ 유의사항 (2가지)
		 * 1. revalidatePath()는 오직 Server측에서만 호출할 수 있음
		 * - ServerAction||ServerComponent에서만 호출할 수 있음 (ClientComponent에서는 안 됨)
		 * 2. '경로'에 해당되는 Page 전체를 재검증(재생성)함 = Page에 포함된 cache도 무효화함
		 * - data-fetching 시 cache 옵션을 force-cache로 설정해도, 무효화(삭제)됨
		 * 3. full-route-cache도 삭제됨
		 * ※ 테스트는 prd 모드로 진행해야 함...
		 * Page를 재생성할 뿐, 재생성한 Page를 full-route-cache에 저장하지는 않음 (.next/server/app/book/1.html)
		 * 상기, full-route-cache는 사실상 무효화/삭제된 cache임
		 * 
		 */
		revalidatePath(`/book/${bookId}`); //⭐ 경로에 해당하는 Page를 재검증함 = Page를 다시 생성함
	} catch (err) {
		console.error(err);
		return;
	}
}