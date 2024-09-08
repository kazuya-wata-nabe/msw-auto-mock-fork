import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	outDir: "dist",
	format: ["esm"],
	splitting: false,
	sourcemap: false,
	dts: false,
	clean: true,
})
