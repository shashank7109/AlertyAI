/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import { buildMetadata } from '@/lib/seo/metadata'

export const metadata = buildMetadata({
  title: "Blog | AlertyAI",
  description: "Read the latest updates, productivity tips, and announcements from the AlertyAI team.",
  slug: "blogs"
})

const DUMMY_POSTS = [
  {
    id: 1,
    title: "How AI is changing Personal Productivity",
    excerpt: "Discover how large language models and smart task extraction can reclaim up to 10 hours a week of your time.",
    date: "March 27, 2026",
    category: "Productivity",
    readTime: "4 min read",
    slug: "#",
  },
  {
    id: 2,
    title: "Introducing the AlertyAI Android Widget",
    excerpt: "Our new glanceable home screen widget brings your most important tasks directly to your fingertips.",
    date: "March 20, 2026",
    category: "Product Updates",
    readTime: "2 min read",
    slug: "#",
  },
  {
    id: 3,
    title: "The Death of the To-Do List",
    excerpt: "Why traditional lists fail us, and how opportunity-based tracking provides a healthier approach to work.",
    date: "March 15, 2026",
    category: "Philosophy",
    readTime: "7 min read",
    slug: "#",
  },
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-6 tracking-tight uppercase">
            The AlertyAI <span className="text-[#3ca2fa] italic">Blog</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Thoughts, updates, and deep dives on creating the ultimate frictionless workspace.
          </p>
        </div>

        {/* Featured / Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DUMMY_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="group relative bg-[#1E1E23]/40 border border-border/60 hover:border-[#3ca2fa]/50 transition-all duration-300 rounded-3xl p-8 flex flex-col h-full overflow-hidden"
            >
              {/* Subtle gradient background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3ca2fa]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10" />

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3ca2fa] bg-[#3ca2fa]/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-text-secondary/60 flex items-center font-medium">
                  <Calendar size={12} className="mr-1" />
                  {post.date}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold font-heading tracking-tight mb-4 group-hover:text-[#3ca2fa] transition-colors leading-snug">
                {post.title}
              </h2>
              
              <p className="text-text-secondary leading-relaxed font-medium mb-8 flex-grow">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/40">
                <span className="text-sm text-text-secondary/80 font-medium">
                  {post.readTime}
                </span>
                <Link 
                  href={post.slug}
                  className="inline-flex items-center text-sm font-bold text-[#3ca2fa] group-hover:translate-x-1 transition-transform"
                >
                  Read Post <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}
