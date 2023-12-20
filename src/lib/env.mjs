// @ts-check
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	isServer: typeof window === "undefined" || process.env.NODE_ENV === "test",
	/*
	 * Serverside Environment variables, not available on the client.
	 * Will throw if you access these variables on the client.
	 */
	server: {
		ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
		SECRET_KEY: z.string().min(8, { message: "Cannot be too short" }),
		APL: z.enum(["saleor-cloud", "file"]).optional().default("file"),
		CI: z.coerce.boolean().optional().default(false),
		APP_DEBUG: z
			.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
			.optional()
			.default("error"),
		REST_APL_ENDPOINT: z.string().optional(),
		REST_APL_TOKEN: z.string().optional(),
		APP_IFRAME_BASE_URL: z.string().optional(),
		APP_API_BASE_URL: z.string().optional(),
	},

	/*
	 * Environment variables available on the client (and server).
	 *
	 * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
	 */
	client: {},

	/*
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 *
	 * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
	 */
	runtimeEnv: {
		ENV: process.env.ENV,

		SECRET_KEY: process.env.SECRET_KEY,
		APL: process.env.APL,
		CI: process.env.CI,
		APP_DEBUG: process.env.APP_DEBUG,
		REST_APL_ENDPOINT: process.env.REST_APL_ENDPOINT,
		REST_APL_TOKEN: process.env.REST_APL_TOKEN,
	},
});
