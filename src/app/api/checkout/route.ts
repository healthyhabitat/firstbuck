import { NextResponse } from "next/server";
import { getAppUrl, getStripe, paymentsConfigured } from "@/lib/stripe";

export async function POST() {
  if (!paymentsConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        mock: true,
        url: `${getAppUrl()}/api/unlock/mock`,
        message: "Stripe unset — use mock unlock in development.",
      });
    }
    return NextResponse.json(
      {
        error: "payments_not_configured",
        message:
          "Payments are not configured yet. Set STRIPE_SECRET_KEY to enable $1 unlock.",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "stripe_init_failed" }, { status: 500 });
  }

  const appUrl = getAppUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 100,
            product_data: {
              name: "FirstBuck Full Pack Unlock",
              description:
                "Unlock Markdown download, Gumroad copy, remove watermark, and 1 regenerate.",
            },
          },
        },
      ],
      success_url: `${appUrl}/api/unlock/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/create?canceled=1`,
      metadata: { product: "firstbuck_unlock" },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json(
      { error: "checkout_failed", message: "Could not start checkout." },
      { status: 500 }
    );
  }
}
