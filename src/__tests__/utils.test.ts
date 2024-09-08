import { parseOptions } from "../utils"

test("sample", () => {
	const actual = parseOptions(["hoge", "--output", "fuga"])
	expect(actual).toEqual({
		input: "hoge",
		output: "fuga",
	})
})
