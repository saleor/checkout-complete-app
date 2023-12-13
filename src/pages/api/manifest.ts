import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { type AppManifest } from "@saleor/app-sdk/types";
import packageJson from "../../../package.json";

export default createManifestHandler({
	async manifestFactory(context) {
		const manifest: AppManifest = {
			id: "saleor.app.checkout-complete",
			name: "Checkout Complete App",
			tokenTargetUrl: `${context.appBaseUrl}/api/register`,
			appUrl: context.appBaseUrl,
			permissions: ["HANDLE_PAYMENTS"],
			version: packageJson.version,
			requiredSaleorVersion: ">=3.15",
			homepageUrl: "https://github.com/saleor/saleor-app-payment-stripe",
			supportUrl: "https://github.com/saleor/saleor-app-payment-stripe/issues",
			webhooks: [],
			extensions: [],
		};

		return manifest;
	},
});
