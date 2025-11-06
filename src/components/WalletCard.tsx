import React from 'react';
import { PiggyBank, BrainCircuit, BotMessageSquare, DatabaseZap, Megaphone } from 'lucide-react';

interface WalletCardProps {
  title: string;
  balance: number;
  currency: string;
  icon: 'main' | 'ai' | 'bot' | 'data' | 'ad';
}

const icons = {
  main: <PiggyBank className="h-8 w-8 text-white" />,
  ai: <BrainCircuit className="h-8 w-8 text-white" />,
  bot: <BotMessageSquare className="h-8 w-8 text-white" />,
  data: <DatabaseZap className="h-8 w-8 text-white" />,
  ad: <Megaphone className="h-8 w-8 text-white" />,
};

const bgColors = {
    main: 'from-indigo-500 to-blue-500',
    ai: 'from-purple-500 to-pink-500',
    bot: 'from-green-500 to-teal-500',
    data: 'from-yellow-500 to-orange-500',
    ad: 'from-red-500 to-rose-500',
}

const WalletCard: React.FC<WalletCardProps> = ({ title, balance, currency, icon }) => {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${bgColors[icon]} p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        {icons[icon]}
      </div>
      <p className="mt-4 text-3xl font-bold">
        {new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
        }).format(balance)}
      </p>
    </div>
  );
};

export default WalletCard;