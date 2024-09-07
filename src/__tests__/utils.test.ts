import { parseOptions } from "../utils"

test("sample", () => {
	const actual = parseOptions(["--input", "hoge", "--output", "fuga"])
	expect(actual).toEqual({
		input: "hoge",
		output: "fuga",
	})
})
