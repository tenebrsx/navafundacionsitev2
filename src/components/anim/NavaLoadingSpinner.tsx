"use client";

/**
 * NavaLoadingSpinner — Full-ring loading indicator.
 *
 * "NARRATIVA ALTERNATIVA" is repeated twice around a tight circle
 * to form a continuous text ring, spinning like a loading cursor.
 */

import styles from "./NavaLoadingSpinner.module.css";

const COLOR = "#002FA7";
const R = 58;

interface Props {
    fadeOut?: boolean;
}

export default function NavaLoadingSpinner({ fadeOut = false }: Props) {
    // Circle centered at origin, starting at 9 o'clock
    const d = `M 0,0 m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`;

    return (
        <div className={`${styles.backdrop} ${fadeOut ? styles.fadeOut : ""}`}>
            <div className={styles.spinnerWrapper}>
                <svg viewBox="-80 -80 160 160" className={styles.svg}>
                    <defs>
                        <path id="loadingOrbit" d={d} />
                    </defs>

                    <g className={styles.spin}>
                        {/* Two copies fill the full circumference */}
                        <text
                            fill={COLOR}
                            fontSize="9.5"
                            fontWeight="600"
                            letterSpacing="0.22em"
                            fontFamily="system-ui, sans-serif"
                        >
                            <textPath href="#loadingOrbit" startOffset="0%">
                                NARRATIVA ALTERNATIVA ·
                            </textPath>
                        </text>
                        <text
                            fill={COLOR}
                            fontSize="9.5"
                            fontWeight="600"
                            letterSpacing="0.22em"
                            fontFamily="system-ui, sans-serif"
                        >
                            <textPath href="#loadingOrbit" startOffset="50%">
                                NARRATIVA ALTERNATIVA ·
                            </textPath>
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
