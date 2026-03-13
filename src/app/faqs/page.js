"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is AlertyAI?",
    answer: "AlertyAI is a minimalist, AI-powered workspace designed to help you manage tasks, reminders, and professional plans with ease. It's built to feel 'as light as air' while providing powerful organization tools."
  },
  {
    question: "Is my data safe with AlertyAI?",
    answer: "Yes, we prioritize your security. We use industry-standard encryption and security protocols to ensure your data is protected and private. Check out our Privacy Policy for more details."
  },
  {
    question: "How do I assign tasks to team members?",
    answer: "If you have a team set up, you can easily assign tasks by opening the task details and selecting a team member from the 'Assigned To' dropdown. Assigned members will receive notifications immediately."
  },
  {
    question: "Can I use AlertyAI on my mobile device?",
    answer: "Absolutely! AlertyAI is designed with a responsive interface that works beautifully on all screen sizes, including smartphones and tablets. We also have an Android application available."
  },
  {
    question: "Is there a free version of AlertyAI?",
    answer: "We offer a flexible range of plans. You can start with our free tier to experience the core features, and upgrade as your needs grow to unlock more advanced AI capabilities and team features."
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
