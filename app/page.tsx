'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase-client';
import type { Session } from '@supabase/supabase-js';

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll-triggered animation for sections
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-[#1A4B84]/30 to-zinc-900 z-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse" 
                 style={{ animationDuration: '7s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"
                 style={{ animationDuration: '5s' }}></div>
          </div>
        </div>

        <div className="container mx-auto px-6 z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <Image
                src="/lifelink_logo.png"
                alt="LifeLink Logo"
                width={80}
                height={80}
                className="animate-pulse"
                style={{ animationDuration: '3s' }}
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
              LifeLink
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-10">
              Connect with our AI for personalized guidance and insights that enhance your daily life
            </p>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : session ? (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/chat">
                  <motion.button 
                    className="bg-[#1A4B84] hover:bg-[#2A5B94] text-white px-8 py-4 rounded-2xl font-medium transition text-lg shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Continue Chatting</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </motion.button>
                </Link>
                <Link href="/settings">
                  <motion.button 
                    className="border border-zinc-600 hover:border-zinc-400 text-white px-8 py-4 rounded-2xl font-medium transition text-lg shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Settings</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/signup">
                  <motion.button 
                    className="bg-[#1A4B84] hover:bg-[#2A5B94] text-white px-8 py-4 rounded-2xl font-medium transition text-lg shadow-lg shadow-blue-900/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.button 
                    className="border border-zinc-600 hover:border-zinc-400 text-white px-8 py-4 rounded-2xl font-medium transition text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.div 
            className="w-8 h-12 border-2 border-zinc-500 rounded-full flex justify-center p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="w-1 h-3 bg-white rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-zinc-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            variants={fadeInUp}
          >
            Why Choose <span className="text-blue-400">LifeLink</span>
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><circle cx="12" cy="12" r="4"></circle></svg>
                ),
                title: "Intelligent Assistance",
                description: "Our AI understands context and provides personalized responses to help with your unique challenges"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>
                ),
                title: "Privacy First",
                description: "Your conversations and data are secure and private, with enterprise-grade encryption and protection"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
                ),
                title: "Always Available",
                description: "Get the support and guidance you need 24/7, no matter where you are or what time it is"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                className="bg-zinc-800 p-8 rounded-2xl shadow-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-300 flex flex-col items-center text-center"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="mb-6 p-4 bg-zinc-700/50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-200">{feature.title}</h3>
                <p className="text-zinc-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section 
        className="py-20 bg-zinc-800/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            variants={fadeInUp}
          >
            How LifeLink <span className="text-blue-400">Works</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Timeline connector */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            
            {[
              {
                number: "01",
                title: "Sign Up",
                description: "Create an account in seconds to get started with LifeLink"
              },
              {
                number: "02",
                title: "Ask Anything",
                description: "Chat with our AI about any question or problem you're facing"
              },
              {
                number: "03",
                title: "Get Insights",
                description: "Receive personalized responses and guidance tailored to your needs"
              },
              {
                number: "04",
                title: "Take Action",
                description: "Apply the insights to improve your situation and daily life"
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className="relative"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700 h-full flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#1A4B84] rounded-full flex items-center justify-center text-xl font-bold mb-6 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-center">{step.title}</h3>
                  <p className="text-zinc-300 text-center">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Demo Section */}
      <motion.section 
        className="py-20 bg-zinc-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience the Power of <span className="text-blue-400">AI Conversation</span>
              </h2>
              <p className="text-lg text-zinc-300 mb-8">
                LifeLink uses advanced AI to understand your unique situation and provide personalized 
                guidance that's relevant to your life. Ask anything from simple questions to complex 
                challenges, and get thoughtful responses instantly.
              </p>
              <div className="space-y-4">
                {[
                  "Natural conversations that feel human",
                  "Context-aware responses that remember details",
                  "Secure and private interactions",
                  "Available 24/7 whenever you need guidance"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <span className="text-zinc-200">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 mt-10 md:mt-0"
              variants={fadeInUp}
            >
              <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="text-sm text-zinc-400 ml-2">LifeLink Chat</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-zinc-700/50 rounded-2xl p-4 max-w-[80%]">
                    <p className="text-zinc-300">How can I improve my productivity when working from home?</p>
                  </div>
                  
                  <div className="bg-[#1A4B84]/30 rounded-2xl p-4 max-w-[80%] ml-auto">
                    <p className="text-zinc-200">
                      Based on research, I'd recommend creating a dedicated workspace, establishing a consistent routine, 
                      and using time-blocking techniques. Would you like specific strategies for any of these approaches?
                    </p>
                  </div>
                  
                  <div className="bg-zinc-700/50 rounded-2xl p-4 max-w-[80%]">
                    <p className="text-zinc-300">Tell me more about time-blocking.</p>
                  </div>
                  
                  <div className="bg-[#1A4B84]/30 rounded-2xl p-4 max-w-[80%] ml-auto">
                    <p className="text-zinc-200">
                      Time-blocking involves scheduling specific tasks during dedicated time periods. For example, 
                      you might reserve 9-11 AM for focused work, 11-12 for meetings, and so on. This helps maintain 
                      focus and reduces context-switching. Would you like me to help you create a personalized time-blocking schedule?
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center gap-2 border border-zinc-700 rounded-xl p-3">
                  <input 
                    type="text" 
                    placeholder="Ask anything..." 
                    className="bg-transparent flex-1 outline-none text-zinc-300 placeholder-zinc-500"
                    disabled
                  />
                  <button className="bg-[#1A4B84] p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 7-7 7 7"/>
                      <path d="M12 19V5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-[#1A4B84]/50 to-zinc-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={fadeInUp}
          >
            Ready to Transform Your Life?
          </motion.h2>
          <motion.p 
            className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Join thousands of users who've discovered the power of AI-assisted guidance with LifeLink.
            Start your journey today.
          </motion.p>

          {!session && (
            <motion.div
              variants={fadeInUp}
            >
              <Link href="/signup">
                <motion.button 
                  className="bg-[#1A4B84] hover:bg-[#2A5B94] text-white px-8 py-4 rounded-2xl font-medium transition text-lg shadow-lg shadow-blue-900/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started — It's Free
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Image
                src="/lifelink_logo.png"
                alt="LifeLink Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-semibold">LifeLink</span>
            </div>
            
            <div className="flex gap-8">
              <Link href="#" className="text-zinc-400 hover:text-white transition">About</Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition">Privacy</Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition">Terms</Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition">Contact</Link>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500 text-sm">
            © {new Date().getFullYear()} LifeLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}