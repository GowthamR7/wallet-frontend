'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';
import { User, Transaction } from '@/lib/types';
import { getTransactions, createRazorpayOrder, verifyPayment, transferFunds, getUser } from '@/lib/api';
import WalletCard from './WalletCard';
import TransactionHistory from './TransactionHistory';
import { Plus, Send, LoaderCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [fromWallet, setFromWallet] = useState('balance');
  const [toWallet, setToWallet] = useState('ai_avatar_balance');

  const wallets = [
    { key: 'balance', name: 'Main Wallet' },
    { key: 'ai_avatar_balance', name: 'AI Avatar' },
    { key: 'broadcast_bot_balance', name: 'Broadcast Bot' },
    { key: 'data_scrap_balance', name: 'Data Scrap' },
    { key: 'meta_ad_balance', name: 'Meta Ad' },
  ];

  const fetchData = useCallback(async () => {
    try {
      const [userData, transactionsData] = await Promise.all([
        getUser(user.email),
        getTransactions(user.email)
      ]);
      if (userData) setUser(userData);
      setTransactions(transactionsData);
    } catch (error) {
      toast.error('Failed to fetch latest data.');
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addMoneyAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }
    const toastId = toast.loading('Initiating payment...');

    try {
      const orderData = await createRazorpayOrder(amount, user.email);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Wallet Top-Up',
        description: `Add money to your wallet`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            toast.loading('Verifying payment...', { id: toastId });
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Your balance will be updated shortly.', { id: toastId });
            setAddMoneyAmount('');
            await fetchData(); 
          } catch (err) {
            toast.error('Payment verification failed.', { id: toastId });
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      toast.dismiss(toastId);

    } catch (error) {
      toast.error('Could not create Razorpay order.', { id: toastId });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount.');
        return;
    }
    if (fromWallet === toWallet) {
        toast.error('Cannot transfer to the same wallet.');
        return;
    }

    const toastId = toast.loading('Processing transfer...');
    try {
        const updatedUser = await transferFunds({
            email: user.email,
            fromWallet,
            toWallet,
            balance: amount
        });
        setUser(updatedUser);
        toast.success('Transfer successful!', { id: toastId });
        setTransferAmount('');
    } catch (error: any) {
        toast.error(error.response?.data?.error || 'Transfer failed.', { id: toastId });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><LoaderCircle className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WalletCard title="Main Balance" balance={user.balance} currency={user.currency} icon="main" />
        <WalletCard title="AI Avatar Balance" balance={user.ai_avatar_balance} currency={user.currency} icon="ai" />
        <WalletCard title="Broadcast Bot Balance" balance={user.broadcast_bot_balance} currency={user.currency} icon="bot" />
        <WalletCard title="Data Scrap Balance" balance={user.data_scrap_balance} currency={user.currency} icon="data" />
        <WalletCard title="Meta Ad Balance" balance={user.meta_ad_balance} currency={user.currency} icon="ad" />
      </div>

   
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center"><Plus size={20} className="mr-2 text-indigo-600"/> Add Money to Main Wallet</h3>
          <form onSubmit={handleAddMoney} className="mt-4 flex items-center gap-4">
            <input
              type="number"
              value={addMoneyAmount}
              onChange={(e) => setAddMoneyAmount(e.target.value)}
              placeholder="Amount in INR"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Add</button>
          </form>
        </div>

 
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center"><Send size={20} className="mr-2 text-indigo-600"/> Transfer Between Wallets</h3>
            <form onSubmit={handleTransfer} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">From</label>
                        <select value={fromWallet} onChange={e => setFromWallet(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {wallets.map(w => <option key={w.key} value={w.key}>{w.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">To</label>
                        <select value={toWallet} onChange={e => setToWallet(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {wallets.map(w => <option key={w.key} value={w.key}>{w.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Transfer</button>
                </div>
            </form>
        </div>
      </div>

      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">Transaction History</h3>
        <TransactionHistory transactions={transactions} />
      </div>
    </>
  );
};

export default Dashboard;