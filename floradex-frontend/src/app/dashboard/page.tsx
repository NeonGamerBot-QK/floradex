import Image from "next/image";
import Link from "next/link";

export default function File() {
  return (
    <div>
    <img 
      className={"pt-4"}
      src="/floradex.svg">

    </img>
    <div className="grid grid-cols-2 gap-12 pt-6">
      <div className="bg-yinmin-blue rounded-lg justify-self-center p-5">
          <h1 className={"text-4xl"}>
            Your Dashboard
          </h1>

          <img className={"w-40"} 
            src="/window.svg">
          </img>

          <div className={"grid grid-cols-2 gap-46 pt-4"}>
            <div className={"justify-self-center px-17 py-2 rounded-xl text-3xl bg-mindaro text-space-cadet"}>
              <Link 
                href={"/catalog"}>  
                  Species
            </Link>
            </div>

            <div className={"justify-self-center px-11 py-2 rounded-xl text-3xl bg-mindaro text-space-cadet"}>
              <Link 
                href={"/gambling"}>
                  The Garden
              </Link>
            </div>
          </div>
        </div>
      <div className={"justify-self-end pr-8 w-200"}>
        <img className={" object-fit: fill rounded-lg"} src="/banner.JPG" />
      </div>
    </div>
    </div>
  );
}
