import { print } from "graphql/language/printer";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { type PageConfig } from "next";
import { saleorApp } from "@/saleor-app";
import {
	CheckoutCompleteDocument,
	type CheckoutCompleteMutationVariables,
	CheckoutFullyPaidDocument,
	type CheckoutFullyPaidSubscription,
} from "generated/graphql";

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};

export const checkoutFullyPaidAsyncWebhook = new SaleorAsyncWebhook<CheckoutFullyPaidSubscription>({
	name: "CheckoutFullyPaid",
	apl: saleorApp.apl,
	event: "CHECKOUT_FULLY_PAID",
	query: CheckoutFullyPaidDocument,
	webhookPath: "/api/checkout-fully-paid",
});

export default checkoutFullyPaidAsyncWebhook.createHandler(async (req, res, ctx) => {
	if (!ctx.payload.event || !("checkout" in ctx.payload.event) || !ctx.payload.event.checkout) {
		return res.status(400).json("Invalid event");
	}
	const checkoutId = ctx.payload.event.checkout.id;

	console.log(`Checkout ${checkoutId} fully paid`);

	const response = await fetch(ctx.authData.saleorApiUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			query: print(CheckoutCompleteDocument),
			variables: { checkoutId } satisfies CheckoutCompleteMutationVariables,
		}),
	});

	if (!response.ok) {
		console.error(`Checkout ${checkoutId} fully paid failed`, response.status, response.statusText);
	}

	return res.status(200).json("OK");
});
