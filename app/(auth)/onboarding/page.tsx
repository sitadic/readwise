"use client";

import { useEffect, useState } from "react";
import { OnboardingLayout } from "../../../components/onboarding/layout";
import { WelcomeStep } from "../../../components/onboarding/welcome";
import { InterestsStep } from "../../../components/onboarding/intrest";
import { RecommendationsStep } from "../../../components/onboarding/recommendation";
import { FinalStep } from "../../../components/onboarding/final";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { genConfig } from "react-nice-avatar";

export default function Onboarding() {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [userOnboard, setUserOnboard] = useState<boolean | null>(null);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    interests: [] as string[],
    followedAuthors: [] as string[],
    userId: "",
    avatarConfig: genConfig(),
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const checkOnboardStatus = async () => {
      if (!userId) return;

      try {
        console.log("Checking onboard status for userId:", userId);
        const response = await fetch("http://127.0.0.1:5000/users/onboardStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Onboard status check failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Onboard status response:", data);
        setUserOnboard(data.onboarded);
      } catch (error) {
        console.error("ERROR CHECKING ONBOARD STATUS:", error);
        setUserOnboard(false);
      }
    };

    if (isSignedIn === false) {
      console.log("User not signed in, redirecting to sign-in");
      router.push("/sign-in");
      return;
    }

    if (userId) {
      setUserData((prev) => ({ ...prev, userId }));
      checkOnboardStatus();
    }
  }, [isSignedIn, userId, router]);

  useEffect(() => {
    if (userOnboard === true) {
      console.log("User already onboarded, redirecting to home");
      router.push("/");
    }
  }, [userOnboard, router]);

  if (!isSignedIn || userOnboard === null) {
    return null;
  }

  return (
    <OnboardingLayout step={step} totalSteps={4}>
      {step === 1 && (
        <WelcomeStep
          onNext={nextStep}
          userData={userData}
          onUpdate={updateUserData}
        />
      )}
      {step === 2 && (
        <InterestsStep
          onNext={nextStep}
          onBack={prevStep}
          userData={userData}
          onUpdate={updateUserData}
        />
      )}
      {step === 3 && (
        <RecommendationsStep
          onNext={nextStep}
          onBack={prevStep}
          userData={userData}
          onUpdate={updateUserData}
        />
      )}
      {step === 4 && (
        <FinalStep
          onBack={prevStep}
          userData={userData}
          onComplete={async () => {
            try {
              console.log("Completing onboarding for userId:", userId);
              const response = await fetch("http://127.0.0.1:5000/users/completeOnboarding", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId,
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
              console.log("Onboarding completed:", data);
              setUserOnboard(true); // Trigger redirect to home
            } catch (error) {
              console.error("ERROR COMPLETING ONBOARDING:", error);
            }
          }}
        />
      )}
    </OnboardingLayout>
  );
}