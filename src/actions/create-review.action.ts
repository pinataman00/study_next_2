"use server";
// import Layout from "@/app/(with-searchbar)/layout";
// import { delay } from "@/util/delay";
// import { error } from "console";
// import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateTag } from "next/cache";

//✅ ⭐ Server Action 설정 -> 다음 코드를 실행하는 API가 자동 생성됨
//별도의 action.ts로 관리할 경우, 파일 최상단에 "use server"를 작성함

// ✅  ⭐ ClientComponent + ServerAction - useActionState사용 시, 매개변수 작성 순서에 유의 (state를 가장 먼저 가져옴)
// export async function createReviewAction(state: any, formData: FormData) {
export async function createReviewAction(_: any, formData: FormData) { // ✅ 한편, state는 사용하지 않을 것이므로 _:any라고 작성함

	//✅ formData 값 가져오기 (+ Type 추론 - 데이터가 있을 경우에는 string타입임을 명시하기. toString() 사용)
	const content = formData.get("content")?.toString();
	const author = formData.get("author")?.toString();

	const bookId = formData.get("bookId")?.toString();


	if (!content || !author || !bookId) {
		// return; //이전 방식 - return undefiend
		return { // ✅ ClientComponent+ServerAction 수정... (useActionState의 state값으로 반환함)
			status: false,
			error: "리뷰 내용과 작성자를 입력해주세요",
		}
	}

	try {
		// await delay(2000); //✅ ClientComponent의 ServerAction 관련 > 딜레이 유발... -> 피드백 제공하기. (로딩 UI 등...)
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
			// `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/1`, // ✅ 테스트 > 없는 URL - 오류 유발하기
			{
				method: "POST",
				body: JSON.stringify({ bookId, content, author }),
			}
		);
		// console.log(response.status);
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
		// ⭐ 페이지 재검증
		//1. 특정 주소에 해당하는 페이지만 재검증함
		// revalidatePath(`/book/${bookId}`); //경로에 해당하는 Page를 재검증함 = Page를 다시 생성함
		// //2. 특정 경로의 모든 동적 페이지를 재검증함 (= 모든 도서의 상세 Page를 재검증함)
		// revalidatePath('/book/[id]', "page");
		// //3. 특정 layout을 갖는 모든 페이지를 재검증함
		// revalidatePath('/(with-searchbar)', 'layout');
		// //4. 모든 데이터를 재검증함
		// revalidatePath('/', 'layout'); //'3'의 논리와 같음

		//✅ ClientComponent+ServerAction - 조금 더 꼼꼼한 예외처리...
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		// ⭐ Revalidate 기능
		//5. 태그 기준, 데이터 캐시 재검증하기 > 가장 경제적인 방법임. '방식 1'의 경우 모든 캐시(도서 상세정보 조회 데이터-BookDetail-등)를 삭제하니까...
		revalidateTag(`review-${bookId}`); //data tag? = fetch() 시 사용한 data cache 옵션 (※ ReviewList 컴포넌트 참고)

		return {
			status: true,
			error: "",
		}

	} catch (err) {
		// console.error(err);
		// return;
		return {
			status: false,
			error: `리뷰 저장에 실패했습니다 ${err}`,
		}
	}
}