import axios from 'axios';
import { User, Transaction } from './types';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const getUser = async (email: string): Promise<User | null> => {
  try {
    const response = await apiClient.get(`/user-info`, { params: { email } });
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const createUser = async (email: string): Promise<User> => {
  const response = await apiClient.post('/create-user', { email });
  return response.data.newUser;
};

export const getTransactions = async (email: string): Promise<Transaction[]> => {
  const response = await apiClient.get(`/user-transactions`, { params: { email } });
  return response.data.transactions;
};

export const createRazorpayOrder = async (amount: number, email: string) => {
  const response = await apiClient.post('/create-session', { amountRequested: amount, email });
  return response.data;
};

export const verifyPayment = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await apiClient.post('/verify-razorpay-order', data);
  return response.data;
};

export const transferFunds = async (data: {
  email: string;
  fromWallet: string;
  toWallet: string;
  balance: number;
}) => {
  const response = await apiClient.post('/create-transfer', data);
  return response.data.user;
};