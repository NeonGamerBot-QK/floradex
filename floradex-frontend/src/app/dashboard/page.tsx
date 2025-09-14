import Image from "next/image";
import Link from "next/link";

export default function File() {
  return (
    <div className="grid grid-cols-2 gap-12 pt-10">
      <div className="bg-space-cadet rounded-lg justify-self-center">
          <h1 className={"text-xl"}>
            Your Dashboard
          </h1>
          <div className={"grid grid-cols-2 gap-20"}>
            <div className={"p-3 rounded-xl text-xl bg-mindaro text-space-cadet"}>
              <Link 
                href={"/catalog"}>  
                  Species
            </Link>
            </div>

            <div className={"p-3 rounded-xl text-xl bg-mindaro text-space-cadet"}>
              <Link 
                href={"/gambling"}>
                  The Garden
              </Link>
            </div>
          </div>
        </div>
      <div className={"justify-self-end pr-12 w-200"}>
        <img className={" object-fit: fill rounded-lg"} src="/banner.JPG" />
      </div>
    </div>
  );
}
