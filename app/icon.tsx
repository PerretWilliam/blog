import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="8" fill="white" />
        <g transform="translate(8,8)">
          <path d="M24 0 L36 0 L28 24 L20 24 Z" fill="#0ea5a4" />
          <rect x="28" y="22" width="4" height="10" fill="#f59e0b" rx="1" />
          <text x="-2" y="46" fontSize="10" fill="#fb923c">
            &lt;
          </text>
          <text x="44" y="46" fontSize="10" fill="#f472b6">
            &gt;
          </text>
        </g>
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
