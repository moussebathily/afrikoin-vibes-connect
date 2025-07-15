import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface TikTokLikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => void;
  className?: string;
}

const PARTICLES = ['💥', '❤️', '⭐', '✨', '💖', '🔥', '💫', '🌟', '💍', '🎆', '⚡', '🌈', '💎', '🦋'];

const HEART_EMOJIS = ['❤️', '💖', '💕', '💘', '💗', '💓', '💞', '💝'];

export const TikTokLikeButton: React.FC<TikTokLikeButtonProps> = ({
  isLiked,
  likesCount,
  onLike,
  className,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number>();

  // Son de "pop"
  const playPopSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio context not supported');
    }
  }, []);

  // Créer des particules qui explosent
  const createParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const velocity = 3 + Math.random() * 4;
      newParticles.push({
        id: Date.now() + i,
        emoji: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2, // initial upward velocity
        opacity: 1,
        scale: 0.6 + Math.random() * 0.8,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 15,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Créer des cœurs qui montent comme TikTok LIVE
  const createFloatingHearts = useCallback(() => {
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 8; i++) {
      newHearts.push({
        id: Date.now() + i + 1000,
        x: -30 + Math.random() * 60,
        y: 0,
        delay: i * 150,
      });
    }
    setFloatingHearts(prev => [...prev, ...newHearts]);
  }, []);

  // Animation des particules
  const animateParticles = useCallback(() => {
    setParticles(prev => {
      return prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98, // friction
        vy: particle.vy + 0.3, // gravité plus réaliste
        opacity: particle.opacity - 0.015,
        rotation: particle.rotation + particle.rotationSpeed,
        scale: particle.scale * 0.995, // rétrécissement graduel
      })).filter(particle => particle.opacity > 0);
    });

    setFloatingHearts(prev => {
      return prev.map(heart => ({
        ...heart,
        y: heart.y - 3, // vitesse de montée plus rapide
      })).filter(heart => heart.y > -150);
    });

    if (particles.length > 0 || floatingHearts.length > 0) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }
  }, [particles.length, floatingHearts.length]);

  useEffect(() => {
    if (particles.length > 0 || floatingHearts.length > 0) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateParticles, particles.length, floatingHearts.length]);

  const handleClick = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Trigger animations
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    // Play sound
    playPopSound();

    // Create particles
    createParticles(centerX, centerY);

    // Create floating hearts si c'est un like
    if (!isLiked) {
      createFloatingHearts();
    }

    // Call parent handler
    onLike();
  }, [isLiked, playPopSound, createParticles, createFloatingHearts, onLike]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={cn(
          "flex items-center space-x-1 hover:text-red-500 transition-all transform hover:scale-110 relative overflow-visible",
          isLiked && "text-red-500",
          isAnimating && "animate-pulse",
          className
        )}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isLiked && "fill-red-500 text-red-500 scale-125",
            isAnimating && "animate-bounce"
          )} 
        />
        <span className="text-sm font-medium">{likesCount}</span>
      </button>

      {/* Container pour les particules */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-lg font-bold select-none"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
              transition: 'none',
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Container pour les cœurs flottants TikTok LIVE style */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {floatingHearts.map((heart, index) => (
          <div
            key={heart.id}
            className="absolute text-lg animate-pulse"
            style={{
              left: `calc(50% + ${heart.x}px)`,
              bottom: heart.y,
              animationDelay: `${heart.delay}ms`,
              opacity: Math.max(0, 1 - (Math.abs(heart.y) / 150)),
              transform: `scale(${1 + (Math.abs(heart.y) / 200)})`,
              filter: `hue-rotate(${index * 45}deg)`,
            }}
          >
            {HEART_EMOJIS[index % HEART_EMOJIS.length]}
          </div>
        ))}
      </div>
    </div>
  );
};