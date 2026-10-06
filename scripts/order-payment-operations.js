export function installDemoOrderPaymentOperation({ registerAction }) {
  registerAction('/orders/pay-demo', (_req, res) => res.status(409).json({ code: 'PAYMENT_MUST_START_IN_CART' }));
}
