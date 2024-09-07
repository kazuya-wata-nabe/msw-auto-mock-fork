import { readFileSync, writeFileSync } from "node:fs"
import * as path from "node:path"
import { load } from "js-yaml"
import { mockTemplate } from "./template"
import type { OpenAPI, ResponseContent } from "./types"
import { getRefField, parseOptions } from "./utils"

const getExample = (obj: ResponseContent | undefined): string => {
	const [first] = Object.values(obj?.examples ?? {})
	const examplePath = first?.$ref ?? ""
	const schema = examplePath.split("/").at(-1)
	const example = schema ? `examples.${schema}.value` : ""

	const isArray = obj?.schema.type === "array"
	if (isArray && example) {
		return `[...${example}]`
	}
	return example
}

const pathWithOp = (paths: OpenAPI["paths"]) => (path: string) => {
	const methods = Object.keys(paths[path] ?? {})
	return methods.map(method => {
		const responses = paths[path]?.[method]?.responses ?? {
			200: { $ref: "" },
			201: { $ref: "" },
		}
		const status =
			Object.keys(responses).find(code => code.startsWith("20")) ?? ""
		const ref = getRefField(responses[200] ?? responses[201])
		const content = ref.split("/").at(-1)
		const response = content ? "json" : "empty"
		return {
			path,
			method,
			status,
			content,
			response,
		}
	})
}

const createOpCollection = ({ paths, components }: OpenAPI) => {
	const op = pathWithOp(paths)
	const _opCollection = Object.keys(paths).flatMap(path => op(path))
	const examples = Object.keys(components.responses).map(response => {
		const example = getExample(
			components.responses[response]?.content["application/json"],
		)
		return {
			key: response,
			example,
		}
	})

	return _opCollection.map(op => {
		const target = examples.find(e => e.key === op.content)
		const example = target?.example ?? ""
		return { ...op, example }
	})
}

export const main = (doc: OpenAPI, output?: string) => {
	const opCollection = createOpCollection(doc)
	const handlers = mockTemplate(opCollection, doc.components.examples)
	if (output) {
		writeFileSync(
			path.resolve(process.cwd(), `${output}/handlers.ts`),
			handlers,
		)
	} else {
		console.debug(handlers)
	}
}

const [, , ...options] = process.argv
const { input, output } = parseOptions(options)
const doc = load(readFileSync(input, "utf8")) as OpenAPI
main(doc, output)
