"use client";
import { useEffect } from "react";

const images = [
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
  "/sample.jpg",
];

export default function Upload() {
  useEffect(() => {
    // Hide scrollbars for all browsers
    const style = document.createElement("style");
    style.innerHTML = `
			.hide-scrollbar {
				scrollbar-width: none; /* Firefox */
				-ms-overflow-style: none; /* IE and Edge */
			}
			.hide-scrollbar::-webkit-scrollbar {
				display: none; /* Chrome, Safari, Opera */
			}
		`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          alignItems: "center",
          gap: "0px",
          height: "300px",
          width: "100%",
          padding: "16px 0",
        }}
        className="hide-scrollbar"
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              width: 400,
              height: 300,
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={src}
              alt={`photo-${idx}`}
              style={{
                width: 380,
                height: 240,
                objectFit: "cover",
                zIndex: 2,
                marginLeft: -5,
                position: "relative",
              }}
              draggable={false}
            />
            <img
              src="/movietape.svg"
              alt="movietape frame"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
