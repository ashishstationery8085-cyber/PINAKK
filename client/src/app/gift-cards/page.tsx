'use client';

import { useState } from 'react';
import { FiGift, FiCopy, FiCheck, FiMail, FiCalendar } from 'react-icons/fi';

const giftCardDesigns = [
  { id: 1, name: 'Classic Blue', color: 'from-blue-500 to-blue-700', icon: '🎁' },
  { id: 2, name: 'Festive Red', color: 'from-red-500 to-red-700', icon: '🎉' },
  { id: 3, name: 'Golden Premium', color: 'from-yellow-500 to-yellow-700', icon: '⭐' },
  { id: 4, name: 'Nature Green', color: 'from-green-500 to-green-700', icon: '🌿' },
];

const giftCardAmounts = [250, 500, 1000, 2000, 5000];

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [selectedDesign, setSelectedDesign] = useState(1);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateGiftCode = () => {
    return `PINAKK-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handlePurchase = () => {
    alert('Gift card purchase functionality would be integrated with payment gateway');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gift Cards</h1>
        <p className="mt-2 text-slate-600">The perfect gift for any occasion. Let them choose what they love!</p>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3 mb-12">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-3xl mb-2">🎁</div>
          <h3 className="font-semibold text-slate-900 mb-1">Instant Delivery</h3>
          <p className="text-sm text-slate-600">Gift cards are delivered instantly via email</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-3xl mb-2">♾️</div>
          <h3 className="font-semibold text-slate-900 mb-1">No Expiry</h3>
          <p className="text-sm text-slate-600">Our gift cards never expire</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-3xl mb-2">🛍️</div>
          <h3 className="font-semibold text-slate-900 mb-1">Wide Selection</h3>
          <p className="text-sm text-slate-600">Use on any product across our store</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gift Card Preview */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Preview</h2>
          <div className={`bg-gradient-to-br ${giftCardDesigns.find(d => d.id === selectedDesign)?.color} rounded-2xl p-8 text-white shadow-xl`}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm opacity-80">PINAKK GIFT CARD</p>
                <p className="text-2xl font-bold mt-1">₹{selectedAmount}</p>
              </div>
              <div className="text-6xl">{giftCardDesigns.find(d => d.id === selectedDesign)?.icon}</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
              <p className="text-xs opacity-80 mb-1">Gift Card Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg tracking-wider">{generateGiftCode()}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm opacity-80">
              <span>Valid for all products</span>
              <span>No expiry date</span>
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Customize Your Gift Card</h2>
          <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Select Amount</label>
              <div className="grid grid-cols-5 gap-2">
                {giftCardAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      selectedAmount === amount
                        ? 'bg-secondary text-white'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-xs text-slate-600 mb-1">Custom Amount (₹250 - ₹10000)</label>
                <input
                  type="number"
                  min="250"
                  max="10000"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-secondary outline-none"
                />
              </div>
            </div>

            {/* Design Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Choose Design</label>
              <div className="grid grid-cols-4 gap-2">
                {giftCardDesigns.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`aspect-square rounded-lg bg-gradient-to-br ${design.color} flex items-center justify-center text-3xl transition ${
                      selectedDesign === design.id ? 'ring-4 ring-secondary ring-offset-2' : 'hover:scale-105'
                    }`}
                  >
                    {design.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Details */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Recipient Details</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-secondary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sender Details */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Your Details</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-secondary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:border-secondary outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              className="w-full bg-secondary text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              <FiGift /> Purchase Gift Card - ₹{selectedAmount}
            </button>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-12 rounded-xl bg-slate-50 p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Gift Card Terms & Conditions</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>• Gift cards are valid for all products on PINAKK marketplace</li>
          <li>• Gift cards have no expiry date</li>
          <li>• Gift cards cannot be exchanged for cash</li>
          <li>• Lost or stolen gift cards cannot be replaced</li>
          <li>• Gift cards can be used in conjunction with other promotional offers</li>
          <li>• Remaining balance can be used for future purchases</li>
        </ul>
      </div>
    </div>
  );
}
