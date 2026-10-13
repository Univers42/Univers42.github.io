/**
 * UNIVERS42 - WEB AUDIO API SYNTHESIZER
 * Real-time procedural audio synthesis for mechanical keyclicks and terminal feedback
 */

(function () {
  let audioContext = null;
  let audioEnabled = false;

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playKeyClick(type = 'click') {
    if (!audioEnabled || !audioContext) return;
    try {
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);

      if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.05); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.1); // G5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn('Audio synthesis error:', e);
    }
  }

  window.playKeyClick = playKeyClick;

  document.addEventListener('DOMContentLoaded', () => {
    const audioToggleBtn = document.getElementById('audioToggle');
    if (!audioToggleBtn) return;

    // Check saved preference
    const savedPref = localStorage.getItem('univers42_audio_enabled');
    if (savedPref === 'true') {
      audioEnabled = true;
      audioToggleBtn.classList.add('active');
      audioToggleBtn.setAttribute('aria-pressed', 'true');
    }

    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      localStorage.setItem('univers42_audio_enabled', audioEnabled ? 'true' : 'false');

      if (audioEnabled) {
        if (audioContext && audioContext.state === 'suspended') audioContext.resume();
        audioToggleBtn.classList.add('active');
        audioToggleBtn.setAttribute('aria-pressed', 'true');
        if (window.showToast) window.showToast('Audio sintetizador activado');
        playKeyClick('success');
      } else {
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.setAttribute('aria-pressed', 'false');
        if (window.showToast) window.showToast('Audio desactivado');
      }
    });
  });
})();
