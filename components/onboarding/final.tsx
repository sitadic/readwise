'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { genConfig } from 'react-nice-avatar';

interface FinalStepProps {
  onBack: () => void;
  userData: {
    name: string;
    interests: string[];
    followedAuthors: string[];
    userId: string;
    avatarConfig: ReturnType<typeof genConfig>;
  };
  onComplete?: () => Promise<void>; // Optional prop for parent component
}

export function FinalStep({ onBack, userData, onComplete }: FinalStepProps) {
  const router = useRouter();
  const { userId } = useAuth();

  const submit = async () => {
    if (!userId) {
      console.error('No userId available');
      return;
    }

    try {
      console.log('Completing onboarding for userId:', userId);
      const response = await fetch('http://127.0.0.1:5000/users/completeOnboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          name: userData.name,
          interests: userData.interests,
          followedAuthors: userData.followedAuthors,
          avatarConfig: userData.avatarConfig,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete onboarding: ${response.status}`);
      }

      const data = await response.json();
      console.log('Onboarding completed:', data);

      // Call onComplete if provided (for parent component)
      if (onComplete) {
        await onComplete();
      }

      router.push('/');
    } catch (error) {
      console.error('ERROR COMPLETING ONBOARDING:', error);
      // Optionally show an error message to the user
      alert('Failed to complete onboarding. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">You're all set, {userData.name}!</h2>
        <p className="text-muted-foreground">Here's what you can do on Readwise:</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 border rounded-lg">
          <BookOpen className="h-6 w-6 mt-1" />
          <div>
            <h3 className="font-semibold">Discover Great Books</h3>
            <p className="text-sm text-muted-foreground">
              Find books in your favorite genres: {userData.interests.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 border rounded-lg">
          <Users className="h-6 w-6 mt-1" />
          <div>
            <h3 className="font-semibold">Connect with Authors</h3>
            <p className="text-sm text-muted-foreground">
              You're following {userData.followedAuthors.length} authors to start with
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 border rounded-lg">
          <MessageSquare className="h-6 w-6 mt-1" />
          <div>
            <h3 className="font-semibold">Join Discussions</h3>
            <p className="text-sm text-muted-foreground">
              Share your thoughts and discuss books with other readers
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={submit} className="flex-1" type="button">
          Get Started
        </Button>
      </div>
    </div>
  );
}