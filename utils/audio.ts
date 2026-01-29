
export const playSuccessSound = () => {
  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playTone = (freq: number, start: number, duration: number) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, context.currentTime + start);
    
    gainNode.gain.setValueAtTime(0, context.currentTime + start);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + start + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + start + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime + start);
    oscillator.stop(context.currentTime + start + duration);
  };

  // Play a "ding-dong" success chime (C5 then G5)
  playTone(523.25, 0, 0.4); // C5
  playTone(783.99, 0.15, 0.6); // G5
};
