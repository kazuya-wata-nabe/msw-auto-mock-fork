import type { Options, Ref } from "./types"

const isRef = (obj: object | undefined): obj is Ref =>
	Object.hasOwn(obj ?? {}, "$ref")
export const getRefField = (obj: object) => {
	return isRef(obj) ? obj.$ref : ""
}

export const parseOptions = (options: string[]) => {
	const input = options[0]
	const option = options
		.slice(1)
		.flatMap((_, i, a) => {
			return i % 2 ? [] : [a.slice(i, i + 2)]
		})
		.filter(([key]) => key?.startsWith("--"))
		.map(([key, value]) => [key?.slice(2), value])

	const entries = { ...Object.fromEntries(option), input } as Options
	const errors = new Array<string>()
	if (!entries.input) errors.push("input is required")
	if (errors.length) {
		throw new Error(`\n${errors.join("\n")}`)
	}
	return entries
}
