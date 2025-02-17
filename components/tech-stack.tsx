"use client";

import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface Technology {
  name: string;
  level: "Intermedio" | "Experto";
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools";
  icon: string;
}

const technologies: Technology[] = [
  { name: "React", level: "Experto", category: "Frontend", icon: "⚛️" },
  { name: "Next.js", level: "Experto", category: "Frontend", icon: "▲" },
  { name: "TypeScript", level: "Experto", category: "Frontend", icon: "TS" },
  { name: "Node.js", level: "Experto", category: "Backend", icon: "🟢" },
  { name: "PostgreSQL", level: "Intermedio", category: "Database", icon: "🐘" },
  { name: "Docker", level: "Intermedio", category: "DevOps", icon: "🐳" },
  // Add more technologies as needed
];

export function TechStack() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">Stack Tecnológico</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(
            technologies.reduce((acc, tech) => {
              if (!acc[tech.category]) acc[tech.category] = [];
              acc[tech.category].push(tech);
              return acc;
            }, {} as Record<string, Technology[]>)
          ).map(([category, techs]) => (
            <Card key={category} className="p-6 glassmorphism">
              <h3 className="text-2xl font-semibold mb-4">{category}</h3>
              <div className="space-y-4">
                {techs.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tech.icon}</span>
                      <span>{tech.name}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        tech.level === "Experto"
                          ? "text-highlight"
                          : "text-secondary"
                      }`}
                    >
                      {tech.level}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
}