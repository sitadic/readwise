'use client';

import { BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}

export function OnboardingLayout({ children, step, totalSteps }: OnboardingLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BookOpen className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Readwise</h1>
        </div>
        
        <Progress value={progress} className="mb-8" />
        
        <div className="bg-card p-6 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}