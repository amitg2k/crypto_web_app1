import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/crypto_web_app1/", // Keep base path for both GitHub Pages and custom domain
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.js",
		css: true,
	},
});
