import { delay } from "@/util/delay";

//✅ (Streaming) Loading.tsx의 영향을 받음 > 자동으로 Streaming됨
export default async function Page() {
  await delay(2000);
  return <div>setting page</div>;
}
