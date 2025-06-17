import { ReactNode } from "react";
import Searchbar from "../../components/searchbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    //테스트
    <div>
      <Searchbar />
      {children}
    </div>
  );
}
