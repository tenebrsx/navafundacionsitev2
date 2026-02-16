"use client";

/**
 * NavaLogoRef — Programmable NAVA logo with orbiting "NARRATIVA ALTERNATIVA" text.
 *
 * Layout (all centered at SVG origin 0,0):
 *   ┌───┬───┐
 *   │ N │ < │   (< = A rotated -90°)
 *   ├───┼───┤
 *   │ V │ > │   (> = A rotated +90°)
 *   └───┴───┘
 *
 * The text follows a circular path whose radius clears the grid corners
 * and continuously rotates around the center.
 */

import styles from "./NavaLogoRef.module.css";

const COLOR = "#002FA7";

// Each letter is drawn in a ~70×80 box (x: 20–90, y: 10–90).
// Grid cell size = 100. Two cells = 200 total.
// We center the grid at origin, so offset = -100.
const GRID_OFFSET = -100;

// Letter paths (each in a 0–100 local coordinate space)
const PATH_N = "M20 10 V90 H40 V50 L66 90 H90 V10 H70 V50 L44 10 H20Z";
const PATH_A = "M20 90 L55 10 L90 90 H68 L61 70 H49 L42 90 H20Z M52 55 L55 35 L58 55Z";
const PATH_V = "M20 10 L55 90 L90 10 H68 L55 50 L42 10 H20Z";

// The grid diagonal from center to corner is √(100²+100²) ≈ 141.
// We want ~30 units of padding → radius ≈ 170.
const TEXT_RADIUS = 170;

export default function NavaLogoRef() {
    // Build the circular text path centered at (0, 0).
    // Arc path starts at the 9-o'clock position (-r, 0).
    const circlePath = `M 0,0 m -${TEXT_RADIUS},0 a ${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 ${TEXT_RADIUS * 2},0 a ${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 -${TEXT_RADIUS * 2},0`;

    return (
        <div className={styles.wrapper}>
            <svg
                viewBox="-250 -250 500 500"
                className={styles.svg}
            >
                {/* ── Defs ─────────────────────────────── */}
                <defs>
                    <path id="orbitPath" d={circlePath} />
                </defs>

                {/* ── Orbiting text ─────────────────────── */}
                <g className={styles.spin}>
                    <text
                        fill={COLOR}
                        fontSize="16"
                        fontWeight="600"
                        letterSpacing="0.2em"
                        fontFamily="system-ui, sans-serif"
                        textAnchor="middle"
                    >
                        <textPath
                            href="#orbitPath"
                            startOffset="12.5%"
                        >
                            NARRATIVA ALTERNATIVA
                        </textPath>
                    </text>
                </g>

                {/* ── Central logo grid ─────────────────── */}
                <g transform={`translate(${GRID_OFFSET}, ${GRID_OFFSET})`}>
                    {/* Top-left: N */}
                    <path d={PATH_N} fill={COLOR} />

                    {/* Top-right: A rotated –90° → points left ( ‹ ) */}
                    <g transform="translate(100, 0)">
                        <g transform="rotate(-90 55 50)">
                            <path d={PATH_A} fill={COLOR} />
                        </g>
                    </g>

                    {/* Bottom-left: V */}
                    <g transform="translate(0, 100)">
                        <path d={PATH_V} fill={COLOR} />
                    </g>

                    {/* Bottom-right: A rotated +90° → points right ( › ) */}
                    <g transform="translate(100, 100)">
                        <g transform="rotate(90 55 50)">
                            <path d={PATH_A} fill={COLOR} />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
