/**
 * Copyright (c) 2026 Shashank Bindal
 * AlertyAI Software License
 */

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Terms of Service',
  description: 'Read AlertyAI Terms of Service for acceptable use, account responsibilities, and legal terms.',
  alternates: { canonical: 'https://alertyai.com/terms' },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight uppercase">Terms of Service</h1>
        <p className="text-text-secondary mb-12 font-medium">Last updated: March 27, 2026</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-lg font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Acceptance of Terms</h2>
            <p>
              By accessing or using AlertyAI, you agree to these Terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Use of Service</h2>
            <p>
              You agree to use AlertyAI only for lawful purposes and in accordance with these Terms. You may not misuse,
              reverse engineer, or interfere with the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Accounts and Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activity
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Intellectual Property</h2>
            <p>
              AlertyAI and related branding, software, and content are protected by applicable intellectual property laws.
              These Terms do not grant ownership rights to users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Disclaimers</h2>
            <p>
              The service is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability
              or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, AlertyAI is not liable for indirect, incidental, special, or consequential
              damages arising from use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Termination</h2>
            <p>
              We may suspend or terminate access if these Terms are violated or to protect the platform, users, or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use after changes indicates acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-8 mb-4 uppercase tracking-tight">Contact</h2>
            <p>
              For legal or terms questions, contact us at <a href="mailto:bindalshashank.89@gmail.com" className="text-primary hover:underline">bindalshashank.89@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
