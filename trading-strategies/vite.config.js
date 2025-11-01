import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/", // Changed to root path for custom domain
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.js",
		css: true,
	},
});
