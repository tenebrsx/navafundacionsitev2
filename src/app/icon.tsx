import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

// Paths from NavaLogoRef — the NAVA monogram (N, <, V, >)
const PATH_N = "M20 10 V90 H40 V50 L66 90 H90 V10 H70 V50 L44 10 H20Z";
const PATH_A = "M20 90 L55 10 L90 90 H68 L61 70 H49 L42 90 H20Z M52 55 L55 35 L58 55Z";
const PATH_V = "M20 10 L55 90 L90 10 H68 L55 50 L42 10 H20Z";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#002FA7",
                    borderRadius: "20%",
                }}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="-100 -100 200 200"
                >
                    <g transform="translate(-100, -100)">
                        {/* N — top left */}
                        <path d={PATH_N} fill="white" />
                        {/* A rotated –90° — top right */}
                        <g transform="translate(100, 0)">
                            <g transform="rotate(-90 55 50)">
                                <path d={PATH_A} fill="white" />
                            </g>
                        </g>
                        {/* V — bottom left */}
                        <g transform="translate(0, 100)">
                            <path d={PATH_V} fill="white" />
                        </g>
                        {/* A rotated +90° — bottom right */}
                        <g transform="translate(100, 100)">
                            <g transform="rotate(90 55 50)">
                                <path d={PATH_A} fill="white" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        ),
        { ...size }
    );
}
