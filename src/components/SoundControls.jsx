// src/components/SoundControls.jsx
import { useState } from 'react';
import { setSfxEnabled, setVoiceEnabled } from '../utils/sound';
import './SoundControls.css';

export default function SoundControls() {
  const [sfxOn, setSfxOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    setSfxEnabled(next);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
  };

  return (
    <div className="sound-controls">
      <button
        className={`sound-btn ${sfxOn ? 'on' : 'off'}`}
        onClick={toggleSfx}
        title="Toggle tile swipe/merge sound"
      >
        {sfxOn ? '🔊' : '🔇'} SFX
      </button>
      <button
        className={`sound-btn ${voiceOn ? 'on' : 'off'}`}
        onClick={toggleVoice}
        title="Toggle voice praise"
      >
        {voiceOn ? '🗣️' : '🤐'} Voice
      </button>
    </div>
  );
}