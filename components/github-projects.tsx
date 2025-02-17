"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getRepositories, type Repository } from "@/lib/github";
import { Star, GitFork, ExternalLink, Github } from "lucide-react";

export function GithubProjects() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const data = await getRepositories("TheRockzi");
        setRepos(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  const languages = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean)));

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-6">Proyectos en GitHub</h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="elegant-button"
            >
              Todos
            </Button>
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={filter === lang ? "default" : "outline"}
                onClick={() => setFilter(lang)}
                className="elegant-button"
              >
                {lang}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos
            .filter((repo) => filter === "all" || repo.language === filter)
            .map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full glassmorphism hover:border-primary/30 transition-colors">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>
                    
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {repo.stargazers_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {repo.forks_count}
                      </div>
                      {repo.language && (
                        <span className="ml-auto">{repo.language}</span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="elegant-button flex-1"
                        onClick={() => window.open(repo.html_url, "_blank")}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Código
                      </Button>
                      {repo.homepage && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="elegant-button flex-1"
                          onClick={() => window.open(repo.homepage, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}