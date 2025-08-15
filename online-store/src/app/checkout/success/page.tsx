import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-white p-12 rounded-lg shadow-lg">
      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900">Thank You for Your Order!</h1>
      <p className="mt-2 text-lg text-gray-600">
        Your order has been placed successfully.
      </p>
      <p className="mt-1 text-gray-600">
        You will receive a confirmation email shortly.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
