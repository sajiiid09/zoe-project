import express from 'express';
import Stripe from 'stripe';
import prisma from '../config/db.js';
import { requireAuth, asyncHandler } from '../middleware/authMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const VENDOR_FEE_AMOUNT = 1000; // 10.00 in smallest currency unit (cents)
const AFFILIATE_FEE_AMOUNT = 1000; // 10.00 in smallest currency unit (cents)
const CURRENCY = 'usd';

const router = express.Router();
export const paymentClient = stripe;

export const createVendorFeeSession = asyncHandler(async (req, res) => {
  if (req.user.role !== 'VENDOR') {
    return res.status(403).json({
      success: false,
      message: 'Only vendor accounts need to pay the registration fee',
    });
  }

  if (req.user.vendorFeePaid) {
    return res.status(400).json({
      success: false,
      message: 'Vendor fee has already been paid',
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: 'Decormade Vendor Registration Fee',
            description: 'One-time fee to open your store on Decormade',
          },
          unit_amount: VENDOR_FEE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: req.user.id,
      type: 'vendor_fee',
    },
    success_url: `${process.env.FRONTEND_URL}/vendor-payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/vendor-payment`,
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { stripeSessionId: session.id },
  });

  res.json({
    success: true,
    data: { url: session.url, sessionId: session.id },
  });
});

export const createAffiliateFeeSession = asyncHandler(async (req, res) => {
  if (req.user.role !== 'AFFILIATE') {
    return res.status(403).json({
      success: false,
      message: 'Only affiliate accounts need to pay the registration fee',
    });
  }

  if (req.user.affiliateFeePaid) {
    return res.status(400).json({
      success: false,
      message: 'Affiliate fee has already been paid',
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: 'Decormade Affiliate Registration Fee',
            description: 'One-time fee to join the Decormade affiliate program',
          },
          unit_amount: AFFILIATE_FEE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: req.user.id,
      type: 'affiliate_fee',
    },
    success_url: `${process.env.FRONTEND_URL}/affiliate-payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/affiliate-payment`,
  });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { affiliateStripeSessionId: session.id },
  });

  res.json({
    success: true,
    data: { url: session.url, sessionId: session.id },
  });
});

/**
 * POST /api/payments/vendor-fee
 * Creates a Stripe Checkout session for the vendor registration fee.
 */
router.post('/vendor-fee', requireAuth, createVendorFeeSession);

router.post('/affiliate-fee', requireAuth, createAffiliateFeeSession);

/**
 * POST /api/payments/vendor-fee/verify
 * Verifies the Stripe session was paid and marks the vendor as paid.
 */
router.post(
  '/vendor-fee/verify',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    if (req.user.vendorFeePaid) {
      return res.json({ success: true, message: 'Already paid' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== 'paid' ||
      session.metadata.userId !== req.user.id ||
      session.metadata.type !== 'vendor_fee'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment not verified',
      });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { vendorFeePaid: true },
    });

    res.json({
      success: true,
      message: 'Vendor fee payment confirmed',
    });
  })
);

router.post(
  '/affiliate-fee/verify',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    if (req.user.affiliateFeePaid) {
      return res.json({ success: true, message: 'Already paid' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== 'paid' ||
      session.metadata.userId !== req.user.id ||
      session.metadata.type !== 'affiliate_fee'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment not verified',
      });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { affiliateFeePaid: true },
    });

    res.json({
      success: true,
      message: 'Affiliate fee payment confirmed',
    });
  })
);

/**
 * POST /api/payments/webhook
 * Stripe webhook – handles checkout.session.completed for vendor fees.
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (endpointSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      event = JSON.parse(req.body.toString());
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (session.metadata?.type === 'vendor_fee' && session.metadata?.userId) {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: { vendorFeePaid: true },
        });
        console.log(`Vendor fee paid for user ${session.metadata.userId}`);
      } else if (session.metadata?.type === 'affiliate_fee' && session.metadata?.userId) {
        await prisma.user.update({
          where: { id: session.metadata.userId },
          data: { affiliateFeePaid: true },
        });
        console.log(`Affiliate fee paid for user ${session.metadata.userId}`);
      }
    }

    res.json({ received: true });
  })
);

/**
 * GET /api/payments/vendor-fee/status
 * Check if the current vendor has paid.
 */
router.get(
  '/vendor-fee/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: { paid: req.user.vendorFeePaid || false },
    });
  })
);

router.get(
  '/affiliate-fee/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: { paid: req.user.affiliateFeePaid || false },
    });
  })
);

export default router;
