import { ImageResponse } from "next/og";

// Route segment config
// export const runtime = "edge"; // Removed to fix dev mode 404
export const dynamic = "force-static"; // Required for static export

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: "#F5F5F7", // Whitish background
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "20%",
                }}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 100 120"
                    style={{
                        overflow: "visible"
                    }}
                >
                    {/* The "N" path from the main logo */}
                    <path
                        d="M 20 100 V 20 L 80 100 V 20"
                        fill="transparent"
                        stroke="#002FA7"
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
