import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { type AppManifest } from "@saleor/app-sdk/types";
import packageJson from "../../../package.json";
import { checkoutFullyPaidAsyncWebhook } from "./checkout-fully-paid";
import { env } from "@/lib/env.mjs";

export default createManifestHandler({
	async manifestFactory({ appBaseUrl }) {
		const iframeBaseUrl = env.APP_IFRAME_BASE_URL ?? appBaseUrl;
		const apiBaseURL = env.APP_API_BASE_URL ?? appBaseUrl;

		const manifest: AppManifest = {
			id: "saleor.app.checkout-complete",
			name: "Checkout Complete App",
			tokenTargetUrl: `${apiBaseURL}/api/register`,
			appUrl: iframeBaseUrl,
			permissions: ["HANDLE_PAYMENTS", "HANDLE_CHECKOUTS", "MANAGE_CHECKOUTS"],
			version: packageJson.version,
			requiredSaleorVersion: ">=3.15",
			homepageUrl: "https://github.com/saleor/checkout-complete-app",
			supportUrl: "https://github.com/saleor/checkout-complete-app/issues",
			webhooks: [checkoutFullyPaidAsyncWebhook.getWebhookManifest(apiBaseURL)],
			extensions: [],
		};

		return manifest;
	},
});
