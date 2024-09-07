import { fileURLToPath } from "node:url"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude],
		root: fileURLToPath(new URL("./", import.meta.url)),
		clearMocks: true,
		globals: true,
	},
})
