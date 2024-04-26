import { print } from "graphql/language/printer";
import { SaleorAsyncWebhook } from "@saleor/app-sdk/handlers/next";
import { type PageConfig } from "next";
import { saleorApp } from "@/saleor-app";
import {
	CheckoutCompleteDocument,
	type CheckoutCompleteMutationVariables,
	CheckoutFullyPaidDocument,
	type CheckoutFullyPaidEventFragment,
	type CheckoutCompleteMutation,
} from "generated/graphql";

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};

export const checkoutFullyPaidAsyncWebhook = new SaleorAsyncWebhook<CheckoutFullyPaidEventFragment>(
	{
		name: "CheckoutFullyPaid",
		apl: saleorApp.apl,
		event: "CHECKOUT_FULLY_PAID",
		query: CheckoutFullyPaidDocument,
		webhookPath: "/api/checkout-fully-paid",
	},
);

export default checkoutFullyPaidAsyncWebhook.createHandler(async (req, res, ctx) => {
	console.log("CheckoutFullyPaid", ctx.payload);
	if (!ctx.payload || !("checkout" in ctx.payload) || !ctx.payload.checkout) {
		return res.status(400).json("Invalid event");
	}
	const checkoutId = ctx.payload.checkout.id;

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

	try {
		const json = (await response.json()) as CheckoutCompleteMutation;
		if (json?.checkoutComplete?.errors?.length ?? 0 > 0) {
			console.error(`Checkout ${checkoutId} fully paid failed`, json?.checkoutComplete?.errors);
		}
	} catch (err) {
		console.error(`Checkout ${checkoutId} fully paid failed - unparsable response`);
	}

	return res.status(200).json("OK");
});
