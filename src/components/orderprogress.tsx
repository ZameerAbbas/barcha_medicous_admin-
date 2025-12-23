'use client'

import React from 'react';
import { Progress } from "./ui/progress"
import { Truck, Home, XCircle, Clock } from 'lucide-react';

interface OrderProgressProps {
  currentStatus: string;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ currentStatus }) => {
  const stages = ['pending', 'inroute', 'delivered', 'cancelled'];

  const getProgressPercentage = () => {
    const currentIndex = stages.indexOf(currentStatus);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'inroute':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Home className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-2 ">
      <div className="flex justify-between mb-1">
        {stages.map((status) => (
          <div key={status} className="flex flex-col items-center text-xs">
            {getStatusIcon(status)}
            <span className="capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <Progress value={getProgressPercentage()} className="w-full h-3 rounded-full" />
    </div>
  );
};

export default OrderProgress;
