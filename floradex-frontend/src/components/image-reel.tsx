"use client";

type ImageReelProps = {
    image_url: string;
}

export default function ImageReel(props: ImageReelProps) {
    const { image_url } = props;

    return (
        <div className={"bg-black p-3"}>
            <div className={"bg-white p-2 w-1/3"}>
                <img src={image_url}/>
            </div>
        </div>
    )
}