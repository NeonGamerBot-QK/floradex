import Image from "next/image";

export default function File() {
    return (
        <div className="grid grid-cols-2 gap-12 pt-10">
            <div className="bg-space-cadet rounded-lg justify-self-center">
                <div className={"text-xl"}>
                    <h1 className={"text-400"}>hello hello hello hello hello hello hello hello</h1>
                </div>
            </div>
            <div className={"justify-self-end pr-12 w-200"}>
                <img className={" object-fit: fill rounded-lg"} src="/banner.JPG"/>
            </div>
        </div>


    
    )
}