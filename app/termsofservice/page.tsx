'use client'

import Image from 'next/image'
import React from 'react'
import Link from 'next/link';


const TermsOfService = () => {
    return (
        // Using a non-flex, normal layout structure to ensure natural scrolling
        <main style={{ height: '100%', overflowY: 'auto' }} className="bg-zinc-900 text-white">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-zinc-700 py-6 bg-zinc-900">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center">
                        <Link href='/chat'>
                            <Image
                                alt="LifeLink Logo"
                                src="/lifelink_logo.png"
                                width={50}
                                height={50}
                                className="mr-4"
                            />
                        </Link>
                        <h1 className="text-3xl font-semibold">Terms of Service</h1>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="container mx-auto px-6 py-10">
                {/* Main content area */}
                <div className="bg-zinc-800 rounded-xl p-8 shadow-lg border border-zinc-700">
                    <p className="text-gray-400 mb-8">
                        Last Updated: May 14, 2025
                    </p>

                    <section id="introduction"  className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">1. Introduction</h2>
                        <p className="text-gray-300 mb-4">
                            Welcome to LifeLink. LifeLink provides an AI-powered platform that allows users to submit medical queries and receive informational responses. These Terms of Service govern your access to and use of the LifeLink website, mobile application, and services.
                        </p>
                        <p className="text-gray-300">
                            By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
                        </p>
                    </section>

                    <section id="acceptance" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">2. Acceptance of Terms</h2>
                        <p className="text-gray-300 mb-4">
                            These Terms constitute a legally binding agreement between you and LifeLink. You acknowledge that you have read, understood, and agree to be bound by these Terms, whether you are a visitor to the website or a registered user of our Services.
                        </p>
                        <p className="text-gray-300">
                            If you are using our Services on behalf of a company, organization, or other entity, you represent and warrant that you have the authority to bind that entity to these Terms, and references to &ldquo;you&ldquo; and &ldquo;your&ldquo; in these Terms will refer to both you and that entity.
                        </p>
                    </section>

                    <section id="eligibility" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">3. Eligibility</h2>
                        <p className="text-gray-300 mb-4">
                            You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you meet this requirement. If you are under 18, you may only use the Services with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms.
                        </p>
                        <p className="text-gray-300">
                            You also represent and warrant that you are not prohibited from receiving our Services under the laws of your jurisdiction.
                        </p>
                    </section>

                    <section id="services" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">4. Services</h2>
                        <p className="text-gray-300 mb-4">
                            LifeLink provides an AI-powered platform that allows users to submit medical queries and receive informational responses. Our Services may include, but are not limited to:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                            <li>AI-powered responses to medical questions</li>
                            <li>Storage of your medical information and conversation history</li>
                            <li>Personalized health information based on your provided data</li>
                            <li>Other features and services that may be added from time to time</li>
                        </ul>
                        <p className="text-gray-300">
                            We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice. We will not be liable to you or any third party for any such modifications, suspensions, or discontinuations.
                        </p>
                    </section>

                    <section id="content" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">5. User Content</h2>
                        <p className="text-gray-300 mb-4">
                            Our Services allow you to upload, submit, store, send, and receive content, including medical questions, personal health information, and other data (&ldquo;User Content&ldquo;). You retain all rights to your User Content, but you grant LifeLink a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content for the purpose of providing our Services.
                        </p>
                        <p className="text-gray-300 mb-4">
                            You are solely responsible for your User Content and the consequences of sharing it through our Services. By submitting User Content, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                            <li>You own or have the necessary rights to share your User Content</li>
                            <li>Your User Content does not infringe upon the intellectual property rights or other rights of any third party</li>
                            <li>Your User Content does not violate any applicable laws or regulations</li>
                            <li>Your User Content does not contain any malicious code, viruses, or other harmful components</li>
                        </ul>
                        <p className="text-gray-300">
                            We reserve the right to remove any User Content that violates these Terms or that we deem inappropriate or unlawful, although we have no obligation to monitor or review User Content.
                        </p>
                    </section>

                    <section id="medical" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">6. Medical Disclaimer</h2>
                        <div className="bg-zinc-700/50 border border-zinc-600 rounded-lg p-4 mb-4">
                            <p className="text-gray-200 font-medium">
                                LifeLink is not a substitute for professional medical advice, diagnosis, or treatment. The content provided through our Services is for informational purposes only.
                            </p>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information you have received through our Services.
                        </p>
                        <p className="text-gray-300 mb-4">
                            The AI-generated responses provided by LifeLink:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                            <li>Are generated by artificial intelligence, not by human healthcare professionals</li>
                            <li>May not be accurate, complete, or up-to-date</li>
                            <li>Should not be used for emergency medical situations</li>
                            <li>Do not establish a doctor-patient relationship</li>
                        </ul>
                        <p className="text-gray-300">
                            In case of a medical emergency, call your local emergency services immediately.
                        </p>
                    </section>

                    <section id="privacy" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">7. Privacy & Data</h2>
                        <p className="text-gray-300 mb-4">
                            Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you agree to our collection and use of your data as described in our Privacy Policy.
                        </p>
                        <p className="text-gray-300 mb-4">
                            You understand and acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                            <li>We may use your health information and queries to improve our AI models and Services</li>
                            <li>Your conversations with our AI may be reviewed by our quality assurance team, subject to our Privacy Policy</li>
                            <li>Your data may be processed and stored on servers located outside your country of residence</li>
                            <li>We implement reasonable security measures to protect your information, but no method of transmission or storage is 100% secure</li>
                        </ul>
                        <p className="text-gray-300">
                            You can request deletion of your account and associated data as described in our Privacy Policy, subject to applicable legal retention requirements.
                        </p>
                    </section>

                    <section id="liability" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">8. Limitation of Liability</h2>
                        <p className="text-gray-300 mb-4">
                            To the maximum extent permitted by law, LifeLink and its officers, directors, employees, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or goodwill, resulting from:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                            <li>Your access to or use of, or inability to access or use, the Services</li>
                            <li>Any conduct or content of any third party on the Services</li>
                            <li>Any content obtained from the Services</li>
                            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                            <li>Any medical decisions made based on information provided through our Services</li>
                        </ul>
                        <p className="text-gray-300">
                            Our liability is limited to the maximum extent permitted by law, and in no event shall our total liability exceed the amount you paid to us, if any, for use of the Services during the six months prior to the event giving rise to the liability.
                        </p>
                    </section>

                    <section id="termination" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">9. Termination</h2>
                        <p className="text-gray-300 mb-4">
                            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                        </p>
                        <p className="text-gray-300">
                            Upon termination, your right to use the Services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section id="changes" className="mb-10 scroll-mt-32">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">10. Changes to Terms</h2>
                        <p className="text-gray-300 mb-4">
                            We reserve the right to modify these Terms at any time. If we make material changes, we will notify you through the Services or by other means. Your continued use of the Services after such modifications constitutes your acceptance of the revised Terms.
                        </p>
                        <p className="text-gray-300">
                            It is your responsibility to review these Terms periodically to stay informed of any updates.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="mt-12 pt-8 border-t border-zinc-700">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1A4B84]">Contact Us</h2>
                        <p className="text-gray-300 mb-4">
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <div className="text-gray-300">
                            <p>Email: ek71@rice.edu</p>
                        </div>
                    </section>
                </div>                        
            </div>
            <div className="md:hidden fixed bottom-6 right-6">
                <Link href="/chat">
                    <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-full shadow-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Chat
                    </button>
                </Link>
            </div>
        </main>
    )
}

export default TermsOfService