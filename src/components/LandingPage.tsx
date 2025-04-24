import { ArrowRight, Bot, Car, Code, MessageSquare, Server } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-gray-800/80">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Vroomie</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop"
            alt="Luxury Vehicle"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/30 dark:from-gray-900/90 dark:to-gray-900/50"></div>
        </div>
        
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold text-white">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Vroomie
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-200">
              Your AI-powered vehicle information assistant
            </p>
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-tire-rotate">
                <Car className="h-full w-full text-blue-400/30" />
              </div>
              <Link
                to="/chat"
                className="relative inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-neon-light dark:hover:shadow-neon-dark"
              >
                Start Chatting <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Technology Stack
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Code className="h-8 w-8 text-blue-500" />,
                title: 'What can Vroomie do?',
                description:
                  'When you need car information and you need it now, Vroomie is your go-to resource. It operates with impressive speed and efficiency, swiftly delivering the specific details you\'re seeking without any unnecessary jargon or delays. Think of it as your personal express lane to automotive knowledge, providing quick and reliable answers to your vehicle-related queries.',
                },
              {
                icon: <Server className="h-8 w-8 text-green-500" />,
                title: 'Why Vroomie?',
                description:
                  'Vroomie isn\'t your typical stiff AI; instead, picture a genuinely enthusiastic friend who just happens to be incredibly knowledgeable about all things automotive. It has a knack for explaining complex vehicle details in a way that feels natural and easy to grasp, making learning about cars an enjoyable experience rather than a chore. Interacting with Vroomie is akin to having a casual conversation with that one buddy who knows everything about cars but never makes you feel less informed. Its friendly demeanor and genuine passion for sharing its expertise create a welcoming and accessible learning environment for anyone curious about vehicles.',
                },
              {
                icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
                title: 'Real-time Communication',
                description:
                  'At its core, Vroomie\'s promise is to be your reliable and trustworthy "pit stop" for all your vehicle information needs. In a world overflowing with opinions and often conflicting data, Vroomie strives to provide accurate, well-researched details you can depend on. Whether you\'re making a crucial buying decision, troubleshooting a mechanical issue, or simply satisfying your curiosity about a specific model, Vroomie aims to be your consistent and credible source, cutting through the noise to deliver the facts you need with clarity and precision.',
                },
            ].map((tech, index) => (
              <div
                key={index}
                className="group relative rounded-xl bg-white p-6 shadow-3d transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-700"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative">
                  <div className="mb-4 flex justify-center">{tech.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


                {/* About Section */}
                <section className="py-20">
                  <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-12">
                      <div className="flex-1">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                          About Vroomie
                        </h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                          Vroomie is an advanced AI-powered chatbot designed to provide detailed
                          information about any vehicle. Whether you're a car enthusiast or just
                          curious about a specific model, Vroomie has you covered.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Powered by Google's Gemini AI, Vroomie delivers accurate and comprehensive
                          information about vehicle specifications, features, and history.
                        </p>
                      </div>
                      <div className="hidden flex-1 md:block">
                        <div className="relative">
                          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
                          <Bot className="relative h-64 w-64 text-blue-500 transition-transform duration-300 hover:scale-110 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-2">We are here to help build a beautiful world of vehicles</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                LinkedIn
              </a>
              <a
                href="mailto:your.email@example.com"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};