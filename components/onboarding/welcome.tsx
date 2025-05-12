'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCcwIcon } from 'lucide-react';
import ReactNiceAvatar, { genConfig } from 'react-nice-avatar';
import { useEffect } from 'react';

const defaultAvatarConfig = genConfig({
  sex: 'man',
});

interface WelcomeStepProps {
  onNext: () => void;
  userData: {
    name: string;
    avatarConfig: ReturnType<typeof genConfig>;
  };
  onUpdate: (data: { name: string; avatarConfig: ReturnType<typeof genConfig> }) => void;
}

const HAIR_STYLES = ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'];
const HAIR_COLORS = ['#000', '#fff', '#f9c9b6', '#ab8876', '#78311f'];
const FACE_COLORS = ['#f9c9b6', '#ecad80', '#9e5622', '#4c1b07'];
const EAR_SIZE = ['small', 'big'];
const EYE_STYLE = ['circle', 'oval', 'smile'];
const GLASSES_STYLE = ['none', 'round', 'square'];
const NOSE_STYLE = ['short', 'long', 'round'];
const MOUTH_STYLE = ['smile', 'laugh', 'peace'];
const SHIRT_STYLE = ['hoody', 'short', 'polo'];
const SEX = ['man', 'woman'];

export function WelcomeStep({ onNext, userData, onUpdate }: WelcomeStepProps) {
  const avatarConfig = userData.avatarConfig || defaultAvatarConfig;

  useEffect(() => {
    if (!userData.avatarConfig) {
      console.error('avatarConfig is undefined', userData);
    }
  }, [userData]);

  const regenerateAvatar = () => {
    onUpdate({
      ...userData,
      avatarConfig: genConfig({
        sex: Math.random() > 0.5 ? 'man' : 'woman',
      }),
    });
  };

  const updateAvatarConfig = (key: string, value: string) => {
    onUpdate({
      ...userData,
      avatarConfig: {
        ...avatarConfig,
        [key]: value,
      },
    });
  };

  return (
    <div className="dark bg-black text-white min-h-screen p-6 space-y-6 rounded-xl shadow-lg">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Welcome to Readwise</h2>
        <p className="text-gray-400">
          Join our community of book lovers and discover your next great read.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Avatar Preview */}
        <div className="relative">
          <ReactNiceAvatar style={{ width: 100, height: 100 }} {...avatarConfig} />
          <Button
            size="icon"
            variant="outline"
            className="absolute -bottom-1 -right-3 rounded-full border-white text-white hover:bg-white hover:text-black"
            onClick={regenerateAvatar}
          >
            <RefreshCcwIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Avatar Customization */}
        <div className="w-full space-y-4">
          {/* Hair Section */}
          <div className="space-y-2">
            <Label className="text-white">Hair</Label>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.hairStyle}
                onChange={(e) => updateAvatarConfig('hairStyle', e.target.value)}
              >
                {HAIR_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-5 gap-1">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${avatarConfig.hairColor === color ? 'border-2 border-blue-400' : 'border border-gray-600'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateAvatarConfig('hairColor', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gender & Face */}
          <div className="space-y-2">
            <Label className="text-white">Gender & Skin Tone</Label>
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.sex}
                onChange={(e) => updateAvatarConfig('sex', e.target.value)}
              >
                {SEX.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-5 gap-1">
                {FACE_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${avatarConfig.faceColor === color ? 'border-2 border-blue-400' : 'border border-gray-600'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateAvatarConfig('faceColor', color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Face Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Eyes</Label>
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.eyeStyle}
                onChange={(e) => updateAvatarConfig('eyeStyle', e.target.value)}
              >
                {EYE_STYLE.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Glasses</Label>
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.glassesStyle}
                onChange={(e) => updateAvatarConfig('glassesStyle', e.target.value)}
              >
                {GLASSES_STYLE.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Nose</Label>
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.noseStyle}
                onChange={(e) => updateAvatarConfig('noseStyle', e.target.value)}
              >
                {NOSE_STYLE.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-white">Mouth</Label>
              <select
                className="w-full rounded-md border bg-gray-900 text-white p-2"
                value={avatarConfig.mouthStyle}
                onChange={(e) => updateAvatarConfig('mouthStyle', e.target.value)}
              >
                {MOUTH_STYLE.map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shirt */}
          <div className="space-y-2">
            <Label className="text-white">Shirt</Label>
            <select
              className="w-full rounded-md border bg-gray-900 text-white p-2"
              value={avatarConfig.shirtStyle}
              onChange={(e) => updateAvatarConfig('shirtStyle', e.target.value)}
            >
              {SHIRT_STYLE.map((style) => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Name Input and Next */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            What should we call you?
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={userData.name}
            className="bg-gray-900 text-white"
            onChange={(e) => onUpdate({ ...userData, name: e.target.value })}
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onNext}
          disabled={!userData.name.trim()}
        >
          Let&apos;s get started
        </Button>
      </div>
    </div>
  );
}
