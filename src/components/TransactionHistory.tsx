import React from 'react';
import { Transaction } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-flex items-center gap-1";
    if (status === 'SUCCESS') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle size={12}/> Success</span>;
    }
    if (status === 'FAILED') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle size={12}/> Failed</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock size={12}/> Pending</span>;
};

const TransactionHistory = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No transactions found.</p>;
  }

  return (
    <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Transaction</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-full mr-4 ${tx.transactionType === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {tx.transactionType === 'CREDIT' ? <ArrowDownLeft size={16}/> : <ArrowUpRight size={16}/>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{tx.product_name}</div>
                                                <div className="text-gray-500">{tx.reason}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${tx.transactionType === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.transactionType === 'CREDIT' ? '+' : '-'} {new Intl.NumberFormat('en-IN', { style: 'currency', currency: tx.currency }).format(tx.amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><StatusBadge status={tx.status} /></td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TransactionHistory;