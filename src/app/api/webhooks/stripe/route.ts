import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function priceIdToPlan(priceId: string): "pro" | "institutional" | null {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_INSTITUTIONAL_PRICE_ID) return "institutional";
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = getServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (userId && session.subscription) {
        // Fetch the subscription to get the price ID
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId ? priceIdToPlan(priceId) : null;

        if (plan) {
          await supabase
            .from("profiles")
            .update({
              plan,
              stripe_customer_id: session.customer as string,
            })
            .eq("id", userId);

          console.log(`Updated user ${userId} to plan: ${plan}`);
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = priceId ? priceIdToPlan(priceId) : null;

      if (plan && subscription.status === "active") {
        await supabase
          .from("profiles")
          .update({ plan })
          .eq("stripe_customer_id", customerId);

        console.log(`Subscription updated for customer ${customerId}: ${plan}`);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("stripe_customer_id", customerId);

      console.log(`Subscription cancelled for customer ${customerId}, downgraded to free`);
      break;
    }

    default:
      console.log("Unhandled webhook event:", event.type);
  }

  return NextResponse.json({ received: true });
}
