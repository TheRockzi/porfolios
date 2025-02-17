"use client";

import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { GithubProjects } from "@/components/github-projects";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="relative">
      <div className="fixed inset-0 z-0">
        <ParticlesBackground />
      </div>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="text-center"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 hover-trigger tracking-tight"
            style={{ color: "hsl(230, 60%, 80%)" }}
          >
            <span className="neon-glow">LKero</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-16 hover-trigger tracking-wide"
            style={{ color: "hsl(180, 70%, 75%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <span className="neon-glow">Desarrollador Web Full Stack</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="elegant-button px-8 py-6 text-lg tracking-wide text-white/90 hover:text-white/100 hover-trigger"
              onClick={() => {
                document.getElementById("projects")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Ver Proyectos
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-12"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8 text-white/20" />
        </motion.div>
      </section>

      <div className="relative z-10 bg-background/50 backdrop-blur-sm">
        <div id="stack">
          <TechStack />
        </div>
        
        <div id="projects">
          <GithubProjects />
        </div>
      </div>
    </main>
  );
}