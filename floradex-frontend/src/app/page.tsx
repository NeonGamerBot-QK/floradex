import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={""}>
      <div className={"justify-self-center flex flex-col m-10 gap-10"}>
        <div
          className={"text-9xl p-5 mt-32 text-background rounded-xl rotate-2"}
        >
          <img
            src="/floradex.svg"
            alt={"floradex logo"}
            draggable={false}
            className={"animate-bounce"}
          />
        </div>
        <div className={"flex flex-row gap-4"}>
          <Link
            className={"p-5 rounded-xl text-xl bg-mindaro text-space-cadet"}
            href={"/login"}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
