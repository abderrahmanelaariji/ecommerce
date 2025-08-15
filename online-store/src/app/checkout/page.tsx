'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createOrder } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  postalCode: z.string().min(4, { message: 'Postal code must be at least 4 characters.' }),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const { cartItems, totalPrice, itemCount, dispatch } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', address: '', city: '', postalCode: '' },
  });

  useEffect(() => {
    // Redirect user if cart is empty
    if (itemCount === 0 && !isSubmitting) {
      router.replace('/');
    }
  }, [itemCount, router, isSubmitting]);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (itemCount === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: data,
        items: cartItems,
        total: totalPrice,
      };

      await createOrder(orderPayload);

      toast.success("Order placed successfully!", {
        description: "You will receive a confirmation email shortly.",
      });
      dispatch({ type: 'CLEAR_CART' });
      router.push('/checkout/success');
    } catch (error) {
      console.error("Failed to submit order", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (itemCount === 0) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Order Summary */}
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
          {cartItems.map(item => (
            <div key={item.product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="md:col-span-1">
        <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl> <Input placeholder="John Doe" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl> <Input placeholder="you@example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Address</FormLabel> <FormControl> <Input placeholder="123 Main St" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>City</FormLabel> <FormControl> <Input placeholder="Anytown" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="postalCode" render={({ field }) => ( <FormItem> <FormLabel>Postal Code</FormLabel> <FormControl> <Input placeholder="12345" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutPage;
