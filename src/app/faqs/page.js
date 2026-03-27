/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is AlertyAI?",
    answer: "AlertyAI is an AI-first planning product for founders and teams. It helps you capture work quickly, prioritize the right tasks, and execute consistently."
  },
  {
    question: "Is my data safe with AlertyAI?",
    answer: "Yes. We follow standard security practices, restrict production access, and continuously improve controls as we scale. See our Privacy Policy for details."
  },
  {
    question: "Who is AlertyAI built for?",
    answer: "AlertyAI is built for startup teams, operators, and creators who need fast planning with clear accountability."
  },
  {
    question: "Can I use AlertyAI on my mobile device?",
    answer: "Yes. The product experience is mobile-friendly and we provide an Android app for users who prefer native workflows."
  },
  {
    question: "How can I contact the team?",
    answer: "You can reach us at bindalshashank.89@gmail.com for support, security, or partnership questions."
  }
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-700/30 py-6">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={onClick}
      >
        <span className="text-xl font-bold uppercase tracking-tight text-white hover:text-[#3ca2fa] transition-colors">
          {question}
        </span>
        {isOpen ? (
          <Minus className="text-[#3ca2fa]" size={24} />
        ) : (
          <Plus className="text-gray-400" size={24} />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            {answer}
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-4">
             <span className="text-[#3ca2fa] text-4xl font-extrabold uppercase tracking-tighter italic">
                A
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                Frequently Asked Questions
              </h1>
          </div>
          <p className="text-gray-400 mb-12 font-medium text-lg">
            Find answers to common questions about AlertyAI and discover how to make the most of your minimalist workspace.
          </p>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
