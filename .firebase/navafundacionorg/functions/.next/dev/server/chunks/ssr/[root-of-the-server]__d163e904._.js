module.exports = [
"[project]/nava-website/src/app/favicon.ico.mjs { IMAGE => \"[project]/nava-website/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/nava-website/src/app/favicon.ico.mjs { IMAGE => \"[project]/nava-website/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/nava-website/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/nava-website/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/nava-website/src/app/movements/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MovementsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nava-website/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function MovementsPage() {
    const movements = [
        {
            name: "La Lucha Continua",
            type: "Performance",
            artist: "Coletivo Sur"
        },
        {
            name: "Tropical Gothic",
            type: "Exhibition",
            artist: "Maria Sanchez"
        },
        {
            name: "Concrete Jungle",
            type: "Installation",
            artist: "Studio 402"
        },
        {
            name: "Paper Beats Rock",
            type: "Publication",
            artist: "Index Press"
        },
        {
            name: "Fuego Lento",
            type: "Gastronomy",
            artist: "Chef Tifa"
        },
        {
            name: "Sonic Waves",
            type: "Sound Art",
            artist: "DJ Ruido"
        },
        {
            name: "Digital Diaspora",
            type: "VR Experience",
            artist: "Tech Lab SD"
        },
        {
            name: "Barrio Stories",
            type: "Photography",
            artist: "Juan Perez"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-4xl md:text-7xl font-black uppercase tracking-tighter",
                children: [
                    "Current ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-stroke-black text-transparent md:text-black",
                        children: "Movements"
                    }, void 0, false, {
                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                        lineNumber: 16,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nava-website/src/app/movements/page.tsx",
                lineNumber: 15,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-black",
                children: movements.map((move, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-black hover:bg-nava-green transition-colors duration-200 cursor-pointer px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-baseline gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-xs md:text-sm w-8",
                                        children: [
                                            "0",
                                            index + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                        lineNumber: 26,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-2xl md:text-4xl font-bold uppercase group-hover:italic transition-all",
                                        children: move.name
                                    }, void 0, false, {
                                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                        lineNumber: 27,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                lineNumber: 25,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 md:gap-12 mt-2 md:mt-0 pl-12 md:pl-0 font-mono text-xs md:text-sm uppercase",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-black text-white px-2 py-0.5 rounded-full group-hover:bg-white group-hover:text-black transition-colors",
                                        children: move.type
                                    }, void 0, false, {
                                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                        lineNumber: 33,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nava$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-32 text-right",
                                        children: move.artist
                                    }, void 0, false, {
                                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                        lineNumber: 34,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nava-website/src/app/movements/page.tsx",
                                lineNumber: 32,
                                columnNumber: 25
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/nava-website/src/app/movements/page.tsx",
                        lineNumber: 21,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/nava-website/src/app/movements/page.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nava-website/src/app/movements/page.tsx",
        lineNumber: 14,
        columnNumber: 9
    }, this);
}
}),
"[project]/nava-website/src/app/movements/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/nava-website/src/app/movements/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d163e904._.js.map