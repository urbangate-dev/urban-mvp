import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingModalProps {
  isLoading: boolean;
}

//loading modal displayed during transactions
const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg flex flex-col items-center border border-gold">
        <Loader2 className="animate-spin text-gold mb-4" size={48} />
        <p className="text-gold font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingModal;