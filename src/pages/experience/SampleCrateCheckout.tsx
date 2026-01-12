import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, CreditCard, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  company: z.string().max(100).optional(),
  address: z.string().min(1, 'Address is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100)
});
type CheckoutFormData = z.infer<typeof checkoutSchema>;
interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  brandName: string;
  size: string;
}
const SAMPLE_FEE_PER_ITEM = 25;
const SampleCrateCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const selectedProducts: SelectedProduct[] = location.state?.selectedProducts || [];
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  });
  const subtotal = selectedProducts.length * SAMPLE_FEE_PER_ITEM;
  const shipping = 0; // Free shipping for samples
  const total = subtotal + shipping;
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setOrderComplete(true);
    toast({
      title: "Sample Crate Ordered!",
      description: "You'll receive a confirmation email shortly."
    });
  };
  if (orderComplete) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center px-8 max-w-lg">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-serif text-4xl mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground mb-8">
            Your sample crate with {selectedProducts.length} piece{selectedProducts.length !== 1 ? 's' : ''} is being prepared. 
            Expect delivery within 3-5 business days.
          </p>
          <div className="space-y-3">
            <button onClick={() => navigate('/discover')} className="btn-luxury-gold w-full">
              Continue Exploring
            </button>
            <button onClick={() => navigate('/')} className="btn-luxury-outline w-full">
              Return Home
            </button>
          </div>
        </motion.div>
      </div>;
  }
  if (selectedProducts.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-8">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl mb-4">No Items Selected</h1>
          <p className="text-muted-foreground mb-8">
            Please select items for your sample crate first.
          </p>
          <button onClick={() => navigate('/experience/sample-crate')} className="btn-luxury-outline">
            Go Back to Selection
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button onClick={() => navigate('/experience/sample-crate')} className="flex items-center gap-2 hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back</span>
          </button>
          <span className="text-luxury-sm tracking-widest">CHECKOUT</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }}>
                <h1 className="font-serif text-3xl mb-8">Shipping Details</h1>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 border border-gold flex items-center justify-center">
                          <span className="text-gold text-sm">1</span>
                        </div>
                        <h2 className="text-luxury-sm tracking-widest uppercase">Contact Information</h2>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">First Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="lastName" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="phone" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">Phone</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <FormField control={form.control} name="company" render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-luxury-xs">Company (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-background border-border" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 border border-gold flex items-center justify-center">
                          <span className="text-gold text-sm">2</span>
                        </div>
                        <h2 className="text-luxury-sm tracking-widest uppercase">Shipping Address</h2>
                      </div>
                      
                      <FormField control={form.control} name="address" render={({
                      field
                    }) => <FormItem>
                            <FormLabel className="text-luxury-xs">Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-background border-border" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="city" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">City</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="state" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">State / Province</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="postalCode" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                        <FormField control={form.control} name="country" render={({
                        field
                      }) => <FormItem>
                              <FormLabel className="text-luxury-xs">Country</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>} />
                      </div>
                    </div>

                    <button type="submit" className="btn-luxury-gold w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : `Complete Order • $${total}`}
                    </button>
                  </form>
                </Form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1
            }} className="bg-card border border-border p-6 sticky top-28">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {selectedProducts.map(product => <div key={product.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-muted overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-luxury-xs text-muted-foreground">{product.brandName}</p>
                        <p className="font-serif truncate">{product.name}</p>
                        <p className="text-luxury-xs text-muted-foreground mt-1">Size: {product.size}</p>
                        <p className="text-gold text-sm mt-1">${SAMPLE_FEE_PER_ITEM} sample fee</p>
                      </div>
                    </div>)}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sample Fees ({selectedProducts.length} items)</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default SampleCrateCheckout;