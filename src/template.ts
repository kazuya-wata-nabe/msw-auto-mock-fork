type Operation = {
	path: string
	method: string
	status: string
	response: string
	example: string
}

type OperationCollection = Operation[]

const transformToHandlerCode = (
	operationCollection: OperationCollection,
): string => {
	return operationCollection
		.map(op => {
			return [
				`http.${op.method}(\`${op.path}\`, ({ response }) => {`,
				`  return response(${op.status}).${op.response}(${op.example})`,
				"},",
			]
				.map(str => "  ".concat(str))
				.join("\n")
		})
		.join("\n")
}

export const mockTemplate = (
	operationCollection: OperationCollection,
	examples: object,
) =>
	`
/**
 * This file is AUTO GENERATED
 * fork from [msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock)
 */
import { createOpenApiHttp } from "openapi-msw"
import type { paths } from "@/schema"

export const http = createOpenApiHttp<paths>()

export const handlers = [
${transformToHandlerCode(operationCollection)}
]

const examples = ${JSON.stringify(examples, null, 2)} as const
`.trimStart()
