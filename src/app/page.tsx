'use client';

import { useState } from 'react';
import { User, Transaction } from '@/lib/types';
import { getUser, createUser } from '@/lib/api';
import toast from 'react-hot-toast';
import Dashboard from '@/components/Dashboard'; 
import Header from '@/components/Header';
import { LoaderCircle } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    setIsLoading(true);
    try {
      let user = await getUser(email);
      if (!user) {
        toast.success("New user detected. Creating your wallet...");
        user = await createUser(email);
      }
      setCurrentUser(user);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to login or create user.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome to Your Wallet</h2>
                <p className="text-center text-gray-500 mt-2">Enter your email to access or create your wallet.</p>
                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Access Wallet
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
            <Dashboard user={currentUser} />
        </main>
    </div>
  );
}