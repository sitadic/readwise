'use client';

import { Button } from '@/components/ui/button';

const INTERESTS = [
  'mystery',
  'crime',
  'thriller',
  'romance',
  'love',
  'fantasy',
  'magic',
  'science fiction',
  'scifi',
  'horror',
  'adventure',
  'travel',
  'historical fiction',
  'history',
  'young adult',
  'ya',
  'teen',
  'children',
  'kids',
  'science',
  'physics',
  'biology',
  'non-fiction',
  'biography',
  'memoir',
  'self-help',
  'business',
  'economics',
  'poetry'
];


interface InterestsStepProps {
  onNext: () => void;
  onBack: () => void;
  userData: { interests: string[] };
  onUpdate: (data: { interests: string[] }) => void;
}

export function InterestsStep({ onNext, onBack, userData, onUpdate }: InterestsStepProps) {
  const toggleInterest = (interest: string) => {
    const newInterests = userData.interests.includes(interest)
      ? userData.interests.filter(i => i !== interest)
      : [...userData.interests, interest];
    onUpdate({ interests: newInterests });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">What do you like to read?</h2>
        <p className="text-muted-foreground">
          Select your favorite genres to personalize your experience.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {INTERESTS.map((interest) => (
          <Button
            key={interest}
            variant={userData.interests.includes(interest) ? "default" : "outline"}
            className="w-full"
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </Button>
        ))}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1"
          disabled={userData.interests.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}