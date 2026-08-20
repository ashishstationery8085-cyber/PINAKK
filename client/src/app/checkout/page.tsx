'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authHeaders } from '../../lib/auth';
import { FiMapPin, FiTruck, FiCreditCard, FiCheck, FiArrowRight, FiArrowLeft, FiLock, FiShield, FiRefreshCw } from 'react-icons/fi';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api';

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deliveryParam = searchParams?.get('delivery') || 'home';
  
  const [cart, setCart] = useState<any>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  
  // Step 1: Address
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    saveAddress: false,
  });
  
  // Step 2: Shipping
  const [shippingMethod, setShippingMethod] = useState(deliveryParam === 'pickup' ? 'pickup' : 'home');
  const [shippingFee, setShippingFee] = useState(deliveryParam === 'pickup' ? 0 : 49);
  
  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [billingName, setBillingName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [stripeInst, setStripeInst] = useState<any>(null);
  const [elementsInst, setElementsInst] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [cardError, setCardError] = useState<string>('');

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = {};
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const response = await fetch(`${API_BASE}/cart`, { headers: requestHeaders });
        const data = await response.json();
        setCart(data.cart || { items: [] });
        
        if (!data.cart?.items?.length) {
          router.push('/cart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
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
  const tax = (subtotal + shippingFee) * 0.18;
  const total = subtotal + shippingFee + tax;

  const handleAddressChange = (key: string, value: string | boolean) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
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

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode) {
        setMessage('Please fill in all required address fields.');
        return false;
      }
      if (address.phone.length !== 10) {
        setMessage('Please enter a valid 10-digit phone number.');
        return false;
      }
    }
    if (step === 2) {
      if (!shippingMethod) {
        setMessage('Please select a shipping method.');
        return false;
      }
    }
    if (step === 3) {
      if (!paymentMethod) {
        setMessage('Please select a payment method.');
        return false;
      }
      if (paymentMethod === 'stripe' && !billingName) {
        setMessage('Please enter the name on your card.');
        return false;
      }
      if (paymentMethod === 'razorpay' && !upiId) {
        setMessage('Please enter your UPI ID.');
        return false;
      }
      if (paymentMethod === 'wallet' && !selectedWallet) {
        setMessage('Please select a wallet.');
        return false;
      }
      if (paymentMethod === 'netbanking' && !selectedBank) {
        setMessage('Please select a bank.');
        return false;
      }
    }
    setMessage('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCheckout = async () => {
    if (!validateStep(3)) return;
    
    setProcessing(true);
    setMessage('');

    try {
      const orderPayload = {
        shippingDetails: {
          address: {
            fullName: address.fullName,
            phone: address.phone,
            line1: address.addressLine1,
            line2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
          method: shippingMethod,
          fee: shippingFee,
        },
        payment: {
          method: paymentMethod,
          provider: paymentMethod === 'cod' ? 'cod' : paymentMethod,
          status: 'pending',
          transactionId: null,
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

      if (paymentMethod === 'cod') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message || 'Checkout failed.');
        setMessage('Order placed successfully! Redirecting...');
        setTimeout(() => router.push('/orders'), 2000);
      } else if (paymentMethod === 'stripe') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const paymentResponse = await fetch(`${API_BASE}/payments/stripe/create-intent`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ amount: total }),
        });
        const paymentData = await paymentResponse.json();
        if (!paymentData.success) throw new Error(paymentData.message || 'Payment initialization failed.');
        
        const clientSecret = paymentData.paymentIntent.client_secret;
        if (!clientSecret || !stripeInst || !cardElement) throw new Error('Payment setup failed.');
        
        const confirmResult = await stripeInst.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement, billing_details: { name: billingName } },
        });
        if (confirmResult.error) throw new Error(confirmResult.error.message || 'Payment failed.');
        
        orderPayload.payment.status = 'paid';
        orderPayload.payment.transactionId = confirmResult.paymentIntent.id;
        
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message || 'Order creation failed.');
        
        setMessage('Payment successful! Redirecting...');
        setTimeout(() => router.push('/orders'), 2000);
      } else if (paymentMethod === 'razorpay') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const razorResp = await fetch(`${API_BASE}/payments/razorpay/create-order`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ amount: total, upiId }),
        });
        const razorData = await razorResp.json();
        if (!razorData?.order) throw new Error(razorData.message || 'Razorpay order creation failed.');
        
        orderPayload.payment.transactionId = razorData.order.id;
        
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message || 'Order creation failed.');
        
        await loadRazorpay();
        const options: any = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: razorData.order.amount,
          currency: razorData.order.currency || 'INR',
          name: 'PINAKK Marketplace',
          description: `Order ${razorData.order.id}`,
          order_id: razorData.order.id,
          handler: async function (response: any) {
            const verifyResp = await fetch(`${API_BASE}/payments/razorpay/verify`, {
              method: 'POST',
              headers: requestHeaders,
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyResp.json();
            if (!verifyData.success) {
              setMessage(verifyData.message || 'Payment verification failed.');
              setProcessing(false);
              return;
            }
            setMessage('Payment successful! Redirecting...');
            setTimeout(() => router.push('/orders'), 2000);
          },
          theme: { color: '#F97316' },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (paymentMethod === 'wallet') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const walletResp = await fetch(`${API_BASE}/payments/wallet/create-order`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ amount: total, wallet: selectedWallet }),
        });
        const walletData = await walletResp.json();
        if (!walletData?.success) throw new Error(walletData.message || 'Wallet payment failed.');
        
        orderPayload.payment.status = 'paid';
        orderPayload.payment.transactionId = walletData.transactionId;
        
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message || 'Order creation failed.');
        
        setMessage('Payment successful! Redirecting...');
        setTimeout(() => router.push('/orders'), 2000);
      } else if (paymentMethod === 'netbanking') {
        const headers = authHeaders();
        const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
        if (headers.Authorization) {
          requestHeaders.Authorization = headers.Authorization;
        }
        const bankResp = await fetch(`${API_BASE}/payments/netbanking/create-order`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify({ amount: total, bank: selectedBank }),
        });
        const bankData = await bankResp.json();
        if (!bankData?.success) throw new Error(bankData.message || 'Net banking payment failed.');
        
        orderPayload.payment.status = 'pending';
        orderPayload.payment.transactionId = bankData.transactionId;
        
        const orderResponse = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: requestHeaders,
          body: JSON.stringify(orderPayload),
        });
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.message || 'Order creation failed.');
        
        setMessage('Order placed! Complete payment on bank page. Redirecting...');
        setTimeout(() => router.push('/orders'), 2000);
      }
    } catch (error: any) {
      setMessage(error.message || 'Checkout error. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">Loading checkout...</div>;

  const steps = [
    { id: 1, title: 'Shipping Address', icon: FiMapPin },
    { id: 2, title: 'Shipping Method', icon: FiTruck },
    { id: 3, title: 'Payment', icon: FiCreditCard },
    { id: 4, title: 'Review', icon: FiCheck },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-600">Complete your order in {4 - currentStep + 1} steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${
                currentStep >= step.id 
                  ? 'border-secondary bg-secondary text-white' 
                  : 'border-slate-200 text-slate-400'
              }`}>
                {currentStep > step.id ? <FiCheck /> : <step.icon />}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${currentStep > step.id ? 'bg-secondary' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Main Content */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="123456"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={address.saveAddress}
                    onChange={(e) => handleAddressChange('saveAddress', e.target.checked)}
                    className="rounded border-slate-300 text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm text-slate-700">Save this address for future orders</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Shipping Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'home', name: 'Home Delivery', desc: 'Standard delivery in 3-5 business days', fee: 49, icon: '🚚' },
                  { id: 'express', name: 'Express Delivery', desc: 'Fast delivery in 1-2 business days', fee: 99, icon: '⚡' },
                  { id: 'pickup', name: 'Store Pickup', desc: 'Pick up at our store - Free', fee: 0, icon: '🏪' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setShippingMethod(method.id);
                      setShippingFee(method.fee);
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      shippingMethod === method.id 
                        ? 'border-secondary bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold text-slate-900">{method.name}</p>
                          <p className="text-sm text-slate-600">{method.desc}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{method.fee === 0 ? 'FREE' : `₹${method.fee}`}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Payment Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: '💵' },
                  { id: 'razorpay', name: 'UPI', desc: 'Pay using any UPI app', icon: '📱' },
                  { id: 'stripe', name: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                  { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                  { id: 'wallet', name: 'Wallet', desc: 'Paytm, PhonePe, Amazon Pay', icon: '👛' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      paymentMethod === method.id
                        ? 'border-secondary bg-orange-50' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{method.name}</p>
                        <p className="text-sm text-slate-600">{method.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Card Payment */}
                {paymentMethod === 'stripe' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Name on Card</label>
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary mb-4"
                      placeholder="John Doe"
                    />
                    <div id="card-element" ref={cardRef} className="rounded-lg border border-slate-200 bg-white p-3" />
                    {cardError && <p className="text-sm text-red-500 mt-2">{cardError}</p>}
                  </div>
                )}

                {/* UPI Payment */}
                {paymentMethod === 'razorpay' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                      placeholder="yourname@upi"
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter your UPI ID (e.g., mobile@upi or name@paytm)</p>
                  </div>
                )}

                {/* Wallet Payment */}
                {paymentMethod === 'wallet' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Wallet</label>
                    <select
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                    >
                      <option value="">Select wallet</option>
                      <option value="paytm">Paytm</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="amazonpay">Amazon Pay</option>
                      <option value="googlepay">Google Pay</option>
                      <option value="mobikwik">MobiKwik</option>
                    </select>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary"
                    >
                      <option value="">Select bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="canara">Canara Bank</option>
                      <option value="union">Union Bank of India</option>
                      <option value="indian">Indian Bank</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                <FiLock className="text-secondary" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Review Your Order</h2>
              
              {/* Shipping Address */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
                <p className="text-slate-700">
                  {address.fullName}<br />
                  {address.phone}<br />
                  {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}<br />
                  {address.city}, {address.state} - {address.postalCode}<br />
                  {address.country}
                </p>
              </div>

              {/* Shipping Method */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Shipping Method</h3>
                <p className="text-slate-700">
                  {shippingMethod === 'home' && 'Home Delivery (Standard)'}
                  {shippingMethod === 'express' && 'Express Delivery'}
                  {shippingMethod === 'pickup' && 'Store Pickup'}
                </p>
              </div>

              {/* Payment Method */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Payment Method</h3>
                <p className="text-slate-700 capitalize">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Order Items ({cart.items.length})</h3>
                <div className="space-y-3">
                  {cart.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                      <div className="h-12 w-12 bg-slate-200 rounded flex items-center justify-center text-xl">📦</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.product?.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">₹{item.total || item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FiRefreshCw className="text-secondary" />
                <span>Easy 7-day returns available</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition"
              >
                <FiArrowLeft /> Back
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                Continue <FiArrowRight />
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Place Order'} <FiShield />
              </button>
            )}
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="rounded-xl bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-slate-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Tax (18% GST)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-900 font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FiLock className="text-green-600" />
              <span>Secure SSL Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-green-600" />
              <span>Your data is protected</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
