'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authHeaders } from '../../lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', method: 'Standard', fee: 49 });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [billingName, setBillingName] = useState('');
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [stripeInst, setStripeInst] = useState<any>(null);
  const [elementsInst, setElementsInst] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [cardError, setCardError] = useState<string>('');

  useEffect(() => {
    const loadCart = async () => {
      const headers = authHeaders();
      const requestHeaders: Record<string, string> = {};
      if (headers.Authorization) {
        requestHeaders.Authorization = headers.Authorization;
      }
      const response = await fetch(`${API_BASE}/cart`, { headers: requestHeaders });
      const data = await response.json();
      setCart(data.cart || { items: [] });
      setLoading(false);
    };
    loadCart();
  }, []);

  useEffect(() => {
    const initStripeElements = async () => {
      if (paymentMethod !== 'stripe') return;
      try {
        await loadStripeJs();
        const pub = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
        if (!pub) return;
        const stripe = (window as any).Stripe(pub);
        const elements = stripe.elements();
        setStripeInst(stripe);
        setElementsInst(elements);
        if (cardRef.current && !cardElement) {
          const card = elements.create('card');
          card.mount(cardRef.current);
          card.on('change', (e: any) => setCardError(e.error?.message || ''));
          setCardElement(card);
        }
      } catch (err) {
        console.warn('Stripe init error', err);
      }
    };
    initStripeElements();
    return () => {
      try {
        if (cardElement) cardElement.destroy();
      } catch (e) {}
    };
  }, [paymentMethod]);

  const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.total || item.price * item.quantity), 0);
  const total = subtotal + shipping.fee;

  const handleChange = (key: string, value: string | number) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
  };

  const loadRazorpay = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  };

  const loadStripeJs = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Stripe) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Stripe.js'));
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (event: any) => {
    event.preventDefault();
    setMessage('');
    if (!cart.items.length) {
      setMessage('Your cart is empty. Add items before checking out.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'stripe') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const paymentResponse = await fetch(`${API_BASE}/payments/stripe/create-intent`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ amount: total }),
        });
        const paymentData = await paymentResponse.json();

        if (!paymentData.success) {
          throw new Error(paymentData.message || 'Payment initialization failed.');
        }

        const clientSecret = paymentData.paymentIntent.client_secret;
        if (!clientSecret) throw new Error('Missing client secret from payment initialization');

        if (!stripeInst || !cardElement) {
          throw new Error('Stripe not initialized or card component missing');
        }

        const confirmResult = await stripeInst.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement, billing_details: { name: billingName || 'Customer' } },
        });

        if (confirmResult.error) {
          throw new Error(confirmResult.error.message || 'Payment confirmation failed');
        }

        const pi = confirmResult.paymentIntent;

        const orderPayload = {
          shippingDetails: {
            address: {
              line1: shipping.address,
              city: shipping.city,
              postalCode: shipping.postalCode,
            },
            method: shipping.method,
            fee: shipping.fee,
          },
          payment: {
            method: paymentMethod,
            provider: 'stripe',
            status: pi.status === 'succeeded' ? 'paid' : 'pending',
            transactionId: pi.id,
            amount: total,
          },
          items: cart.items.map((item: any) => ({
            product: item.product._id || item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.product?.price || item.price || 0,
            total: item.total || item.quantity * (item.product?.price || item.price || 0),
          })),
        };

        const orderHeaders = authHeaders();
        const orderRequestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (orderHeaders.Authorization) {
          orderRequestHeaders.Authorization = orderHeaders.Authorization;
        }
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: orderRequestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();

        if (!orderData.success) {
          throw new Error(orderData.message || 'Checkout failed.');
        }

        setMessage('Payment successful. Redirecting to orders...');
        router.push('/orders');
      } else if (paymentMethod === 'razorpay') {
        // Create razorpay order and then create the app order record
        const razorHeaders = authHeaders();
        const razorRequestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (razorHeaders.Authorization) {
          razorRequestHeaders.Authorization = razorHeaders.Authorization;
        }
        const razorResp = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
          method: 'POST',
          headers: razorRequestHeaders,
          body: JSON.stringify({ amount: total }),
        });
        const razorData = await razorResp.json();
        if (!razorData || !razorData.order) {
          throw new Error(razorData.message || 'Razorpay order creation failed.');
        }

        const orderPayload = {
          shippingDetails: {
            address: {
              line1: shipping.address,
              city: shipping.city,
              postalCode: shipping.postalCode,
            },
            method: shipping.method,
            fee: shipping.fee,
          },
          payment: {
            method: paymentMethod,
            provider: 'razorpay',
            status: 'pending',
            transactionId: razorData.order.id,
            amount: total,
          },
          items: cart.items.map((item: any) => ({
            product: item.product._id || item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.product?.price || item.price || 0,
            total: item.total || item.quantity * (item.product?.price || item.price || 0),
          })),
        };

        const orderHeaders = authHeaders();
        const orderRequestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (orderHeaders.Authorization) {
          orderRequestHeaders.Authorization = orderHeaders.Authorization;
        }
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: orderRequestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();

        if (!orderData.success) {
          throw new Error(orderData.message || 'Checkout failed.');
        }

        // Load Razorpay SDK and open checkout
        await loadRazorpay();

        const options: any = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: razorData.order.amount,
          currency: razorData.order.currency || 'INR',
          name: 'PINAKK Marketplace',
          description: `Order ${razorData.order.id}`,
          order_id: razorData.order.id,
          handler: async function (response: any) {
            // Verify payment on server and update order status
            const verifyHeaders = authHeaders();
            const verifyRequestHeaders: Record<string, string> = {
              'Content-Type': 'application/json',
            };
            if (verifyHeaders.Authorization) {
              verifyRequestHeaders.Authorization = verifyHeaders.Authorization;
            }
            const verifyResp = await fetch(`${API_BASE}/payments/razorpay/verify`, {
              method: 'POST',
              headers: verifyRequestHeaders,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResp.json();
            if (!verifyData.success) {
              setMessage(verifyData.message || 'Payment verification failed.');
              return;
            }
            setMessage('Payment successful. Redirecting to orders...');
            router.push('/orders');
          },
          prefill: {},
          theme: { color: '#F97316' },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Unsupported payment method');
      }
    } catch (error: any) {
      setMessage(error.message || 'Checkout error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-2 text-slate-600">Confirm your shipping details and complete your order securely.</p>

          <form onSubmit={handleCheckout} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Shipping address</span>
                <input
                  type="text"
                  value={shipping.address}
                  onChange={(event) => handleChange('address', event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
                  placeholder="Street, apartment, or office"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">City</span>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(event) => handleChange('city', event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
                  placeholder="City"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Postal code</span>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(event) => handleChange('postalCode', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
                placeholder="Postal code"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Payment method</span>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
              >
                <option value="cod">Cash on Delivery</option>
                <option value="stripe">Stripe (Card)</option>
                <option value="razorpay">Razorpay (UPI/Card)</option>
              </select>
            </label>
            {paymentMethod === 'stripe' && (
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Name on card</span>
                  <input
                    type="text"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-primary"
                    placeholder="Full name"
                  />
                </label>
                <div>
                  <span className="text-sm font-medium text-slate-700">Card details</span>
                  <div id="card-element" ref={cardRef} className="mt-2 rounded-2xl border border-slate-200 bg-white p-3" />
                  {cardError && <p className="text-sm text-red-500 mt-2">{cardError}</p>}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-secondary px-6 py-4 text-base font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Pay & place order'}
            </button>
            {message && <p className="text-sm text-primary">{message}</p>}
          </form>
        </section>

        <aside className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
            <p className="mt-2 text-slate-600">Review your cart items, shipping fee, and final total before placing the order.</p>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between text-slate-700">
              <span>Items</span>
              <span>{cart.items.length}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span>Shipping</span>
              <span>₹{shipping.fee}</span>
            </div>
            <div className="flex items-center justify-between text-slate-900 text-lg font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Note</p>
            <p className="mt-3 text-sm leading-6">Orders are created after payment initialization. You will be redirected to your orders page after success.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
