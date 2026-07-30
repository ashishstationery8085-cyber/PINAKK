'use client';

import { useState } from 'react';
import { FiCopy, FiCheck, FiUsers, FiGift, FiShare2, FiMail } from 'react-icons/fi';

export default function ReferralPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [referralEmail, setReferralEmail] = useState('');
  
  const referralCode = 'PINAKK' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://pinakk.com/referral/${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const stats = [
    { label: 'Total Referrals', value: 12, icon: FiUsers, color: 'text-blue-600' },
    { label: 'Successful Referrals', value: 8, icon: FiCheck, color: 'text-green-600' },
    { label: 'Rewards Earned', value: '₹800', icon: FiGift, color: 'text-orange-600' },
    { label: 'Pending Rewards', value: '₹200', icon: FiGift, color: 'text-yellow-600' },
  ];

  const recentReferrals = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', status: 'completed', date: '2024-07-15', reward: 100 },
    { name: 'Priya Patel', email: 'priya@example.com', status: 'completed', date: '2024-07-12', reward: 100 },
    { name: 'Amit Kumar', email: 'amit@example.com', status: 'pending', date: '2024-07-10', reward: 100 },
    { name: 'Sneha Singh', email: 'sneha@example.com', status: 'completed', date: '2024-07-08', reward: 100 },
    { name: 'Vikram Joshi', email: 'vikram@example.com', status: 'pending', date: '2024-07-05', reward: 100 },
  ];

  const sendInvite = () => {
    if (referralEmail) {
      alert(`Invitation sent to ${referralEmail}`);
      setReferralEmail('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Refer & Earn</h1>
        <p className="mt-2 text-slate-600">Invite friends and earn rewards for every successful referral!</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg bg-slate-100 ${stat.color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Referral Code & Link */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4">Your Referral Code</h3>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
            <p className="text-3xl font-bold tracking-wider text-center">{referralCode}</p>
          </div>
          <button
            onClick={() => copyToClipboard(referralCode)}
            className="w-full bg-white text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition flex items-center justify-center gap-2"
          >
            {copiedCode === referralCode ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy Code
              </>
            )}
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold text-lg mb-4">Your Referral Link</h3>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4 mb-4">
            <p className="text-sm break-all">{referralLink}</p>
          </div>
          <button
            onClick={() => copyToClipboard(referralLink)}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            {copiedCode === referralLink ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy Link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Send Invite */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">Send Invitation</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={referralEmail}
            onChange={(e) => setReferralEmail(e.target.value)}
            placeholder="Enter friend's email address"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:border-secondary outline-none"
          />
          <button
            onClick={sendInvite}
            className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center gap-2"
          >
            <FiMail /> Send Invite
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <FiShare2 /> Share on WhatsApp
          </button>
          <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
            <FiShare2 /> Share on Facebook
          </button>
          <button className="flex-1 bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2">
            <FiShare2 /> Share on Twitter
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
        <h3 className="font-semibold text-slate-900 mb-4">How It Works</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">1</div>
            <h4 className="font-semibold text-slate-900 mb-2">Share Your Link</h4>
            <p className="text-sm text-slate-600">Share your unique referral code or link with friends</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">2</div>
            <h4 className="font-semibold text-slate-900 mb-2">Friend Signs Up</h4>
            <p className="text-sm text-slate-600">Your friend uses your link to create an account and makes first purchase</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">3</div>
            <h4 className="font-semibold text-slate-900 mb-2">Both Get Rewarded</h4>
            <p className="text-sm text-slate-600">You earn ₹100 and your friend gets ₹50 discount</p>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Referrals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">Reward</th>
              </tr>
            </thead>
            <tbody>
              {recentReferrals.map((referral, idx) => (
                <tr key={idx} className="border-b border-slate-100">
                  <td className="py-3 px-4 text-sm text-slate-900">{referral.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{referral.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{referral.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      referral.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-900">₹{referral.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 rounded-xl bg-slate-50 p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Referral Program Terms & Conditions</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>• You earn ₹100 for every successful referral who makes their first purchase</li>
          <li>• Your friend gets ₹50 discount on their first order</li>
          <li>• Rewards are credited after the referred user completes their first purchase</li>
          <li>• Minimum purchase amount for referral to qualify is ₹299</li>
          <li>• Self-referrals are not allowed and will be voided</li>
          <li>• PINAKK reserves the right to modify or terminate the referral program at any time</li>
        </ul>
      </div>
    </div>
  );
}
