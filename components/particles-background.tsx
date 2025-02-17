"use client";

import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";

export function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: Add any initialization after particles are loaded
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: [
              "hsla(230, 60%, 70%, 0.4)", 
              "hsla(180, 70%, 65%, 0.4)", 
              "hsla(282, 60%, 70%, 0.4)"
            ],
          },
          links: {
            color: "hsla(230, 60%, 70%, 0.08)",
            distance: 150,
            enable: true,
            opacity: 0.08,
            width: 0.5,
          },
          move: {
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: 0.3,
            straight: false,
            direction: "none",
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          number: {
            density: {
              enable: true,
              area: 1200,
            },
            value: 50,
          },
          opacity: {
            value: 0.25,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.1,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 0.5, max: 1.5 },
          },
          blur: {
            enable: true,
            value: 0.5,
          },
        },
        detectRetina: true,
      }}
    />
  );
}