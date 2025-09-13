import Image from "next/image";

export default function Home() {
  return (
    <div className={""}>
      <div className={"justify-self-center flex flex-col m-10"}>
        <div
          className={"text-9xl p-5 mt-32 text-background rounded-xl rotate-2"}
        >
          <img src="/floradex.svg" />
        </div>
        <div></div>
      </div>
    </div>
  );
}
