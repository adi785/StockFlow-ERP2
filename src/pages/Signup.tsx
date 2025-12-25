import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { toast } from 'sonner';

export default function SignupPage(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    setLoading(false);
    
    if (error) {
      console.error('Signup error:', error);
      switch (error.message) {
        case 'User already registered':
          toast.error('An account with this email already exists.');
          break;
        case 'Password should be at least 6 characters':
          toast.error('Password must be at least 6 characters long.');
          break;
        default:
          toast.error('An error occurred during signup. Please try again.');
      }
      return;
    }
    
    if (data) {
      toast.success('Signup successful! Please check your email for confirmation.');
      navigate('/login');
    }
  };

  return (
    <AuthLayout title="Create an Account" description="Enter your details to create a new StockFlow account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}