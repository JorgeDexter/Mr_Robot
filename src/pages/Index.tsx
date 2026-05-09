import React from 'react';
import { Waves as Wave } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Index = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="flex items-center justify-center mb-4">
                    <Wave className="w-8 h-8 text-indigo-500 mr-2" />
                    <h1 className="text-3xl font-bold text-gray-800">Hello World!</h1>
                </div>
                <p className="text-gray-600 mb-6">Welcome to your React application</p>
                <WalletMultiButton
                    style={{
                        backgroundColor: '#27272a',
                        color: '#ffffff',
                        borderRadius: '8px',
                    }}
                />
            </div>
        </div>
    );
};

export default Index;
