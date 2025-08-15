"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const google_1 = require("next/font/google");
require("./globals.css");
const geistSans = (0, google_1.Geist)({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = (0, google_1.Geist_Mono)({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
exports.metadata = {
    title: "DeFi Regulatory Compliance Platform",
    description: "AI-powered regulatory compliance and risk management for institutional DeFi",
};
function RootLayout({ children, }) {
    return ((0, jsx_runtime_1.jsx)("html", { lang: "en", children: (0, jsx_runtime_1.jsx)("body", { className: `${geistSans.variable} ${geistMono.variable} antialiased`, children: children }) }));
}
//# sourceMappingURL=layout.js.map