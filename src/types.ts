export type Options = {
	input: string
	output?: string
}
// TODO: 適当な定義なので後で修正
export type OpenAPI = {
	paths: Path
	components: {
		responses: {
			[name: string]: Response
		}
		examples: {
			[name: string]: {
				value: object
			}
		}
	}
}

const Statuses = ["200", "201", "204"] as const
export type Status = (typeof Statuses)[number]
type Path = {
	[path: string]: {
		[method: string]: {
			responses: {
				[S in Status]: Ref | Content
			}
		}
	}
}

type ContentType = "application/json" | "multipart/form-data"
export type Schema = {
	schema: {
		type: string
	}
}
type Content = {
	[Content in ContentType]: {
		[C in Content]: {
			schema: Schema
		}
	}
}[ContentType]

export type ResponseContent = {
	schema: {
		type?: string
	} & Ref
	examples?: {
		[name: string]: Ref
	}
}
type Response = {
	content: {
		[Content in ContentType]+?: ResponseContent
	}
}

export type Ref = {
	$ref: string
}
