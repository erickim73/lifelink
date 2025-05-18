"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Shield, Activity, Brain, Leaf, Menu, X, ChevronRight } from "lucide-react"
import { CardContainer, CardItem } from "@/components/ui/3d-card";
import { Spotlight } from "@/components/ui/spotlight-new";


const footerLinks = [
{
	title: "Product",
	links: [
		{ label: "Features", href: "#features" },
		{ label: "Integrations", href: "#integrations" },
		{ label: "FAQ", href: "#faq" },
		{ label: "Roadmap", href: "#roadmap" },
	],
},
{
	title: "Company",
	links: [
		{ label: "About us", href: "#about" },
		{ label: "Team", href: "#team" },
		{ label: "Careers", href: "#careers" },
		{ label: "Blog", href: "#blog" },
		{ label: "Press", href: "#press" },
	],
},
{
	title: "Resources",
	links: [
		{ label: "Documentation", href: "#docs" },
		{ label: "Help center", href: "#help" },
		{ label: "Community", href: "#community" },
		{ label: "Partners", href: "#partners" },
		{ label: "Status", href: "#status" },
	],
},
]

export default function LandingPage() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
			<Spotlight />
			{/* Subtle background pattern */}
			<div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>

			{/* Gradient orbs */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#1A4B84]/20 to-transparent rounded-full filter blur-[120px] opacity-40 transform translate-x-1/3 -translate-y-1/2"></div>
				<div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-[#4FACFE]/10 to-transparent rounded-full filter blur-[100px] opacity-30 transform -translate-x-1/3 translate-y-1/3"></div>
			</div>

			{/* Navigation */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0F172A]/80 backdrop-blur-md py-3 shadow-lg" : "py-6"}`}
			>
				<nav className="container flex items-center justify-between px-6 mx-auto">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
						className="flex items-center gap-3"
					>
						<div className="relative w-10 h-10">
							<Image src="/lifelink_logo.png" alt="LifeLink Logo" fill className="object-contain" priority />
						</div>
						<span className="text-xl font-medium tracking-tight">
							<Image
								src="/lifelink.svg"
								alt="LifeLink Logo"
								width={105}
								height={75}
								priority
							/>
						</span>
					</motion.div>

					{/* Desktop Navigation */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="items-center hidden gap-8 md:flex"
					>
						<Link href="#features" className="text-sm transition-colors text-zinc-300 hover:text-white">
							Features
						</Link>
						<Link href="#testimonials" className="text-sm transition-colors text-zinc-300 hover:text-white">
							Testimonials
						</Link>
						<Link href="/login" className="text-sm transition-colors text-zinc-300 hover:text-white">
							Log in
						</Link>
						<Link
							href="/signup"
							className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] hover:opacity-90 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
						>
							Get started
						</Link>
					</motion.div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setMobileMenuOpen(true)}
							className="text-zinc-300 hover:text-white"
							aria-label="Open menu"
						>
							<Menu size={24} />
						</button>
					</div>
				</nav>
			</header>

			{/* Mobile menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="fixed inset-0 z-50 bg-[#0F172A] p-6 flex flex-col"
					>
						<div className="flex items-center justify-between mb-10">
							<div className="flex items-center gap-3">
								<div className="relative w-10 h-10">
									<Image src="/lifelink_logo.png" alt="LifeLink Logo" fill className="object-contain" />
								</div>
								<span className="text-xl font-medium tracking-tight">LifeLink</span>
							</div>
							<button
								onClick={() => setMobileMenuOpen(false)}
								className="text-zinc-300 hover:text-white"
								aria-label="Close menu"
							>
								<X size={24} />
							</button>
						</div>
						<div className="flex flex-col gap-6 text-lg">
							<Link
								href="#features"
								className="flex items-center justify-between py-2 border-b border-zinc-800"
								onClick={() => setMobileMenuOpen(false)}
							>
								Features <ChevronRight size={18} />
							</Link>
							<Link
								href="#testimonials"
								className="flex items-center justify-between py-2 border-b border-zinc-800"
								onClick={() => setMobileMenuOpen(false)}
							>
								Testimonials <ChevronRight size={18} />
							</Link>              
							<Link
								href="/login"
								className="flex items-center justify-between py-2 border-b border-zinc-800"
								onClick={() => setMobileMenuOpen(false)}
							>
								Log in <ChevronRight size={18} />
							</Link>
						</div>
						<div className="mt-auto">
							<Link
								href="/signup"
								className="w-full bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] hover:opacity-90 px-5 py-3 rounded-full text-center font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
								onClick={() => setMobileMenuOpen(false)}
							>
								Get started <ArrowRight size={18} />
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
				<div className="container px-6 mx-auto">
					<div className="max-w-4xl mx-auto mb-16 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-sm"
						>
							<div className="w-2 h-2 rounded-full bg-[#4FACFE] animate-pulse"></div>
							<span className="text-sm font-medium text-zinc-300">Your journey to better health starts here</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="mb-6 text-4xl font-bold leading-tight md:text-6xl"
						>
							Personalized health insights for a{" "}
							<span className="relative">
								<span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]">
									balanced life
								</span>
								<span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-[#4FACFE]/20 to-[#00F2FE]/20 rounded-full blur-sm"></span>
							</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="max-w-2xl mx-auto mb-10 font-sans text-lg text-zinc-400"
						>
							LifeLink combines AI-powered health analysis with personalized guidance to help you achieve your wellness
							goals and live a more balanced, healthier life.
						</motion.p>
						

						 <motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="flex flex-col justify-center gap-4 sm:flex-row"
						>
							<Link
								href="/signup"
								className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] hover:opacity-90 px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
							>
								Start your health journey
								<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
							</Link>							
						</motion.div>
					</div>

					{/* Dashboard Preview */}
					<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>                
					<CardContainer className="inter-var">
						<CardItem translateZ="100" className="w-full mt-4 overflow-hidden rounded-xl">
							<div className="h-8 bg-[#1E293B] border-b border-white/10 flex items-center px-4 gap-2">
								<div className="w-3 h-3 rounded-full bg-red-500/60"></div>
								<div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
								<div className="w-3 h-3 rounded-full bg-green-500/60"></div>
							</div>
							<Image
								src="/dashboard.png"
								alt="LifeLink Dashboard"
								width={1200}
								height={675}
								className="w-full group-hover/card:shadow-xl"
							/>
						</CardItem>
					</CardContainer>         

					{/* Trust indicators */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.8 }}
						className="mt-12 text-center"
					>
						<p className="mb-6 text-sm text-zinc-500">Trusted by health-conscious individuals worldwide</p>            
					</motion.div>
				</div>
			</section>

			{/* How it works section */}
			<section id="how-it-works" className="relative py-16 md:py-20">
				<div className="container px-6 mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="mb-16 text-center"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/5 backdrop-blur-sm">
							<span className="text-sm font-medium text-zinc-300">Simple process, powerful results</span>
						</div>
						<h2 className="mb-4 text-3xl font-bold md:text-4xl">How LifeLink works</h2>
						<p className="max-w-2xl mx-auto text-zinc-400">
							Our intuitive platform guides you through a simple process to deliver personalized health insights and
							recommendations.
						</p>
					</motion.div>

					<div className="grid max-w-5xl grid-cols-1 gap-6 mx-auto md:grid-cols-3 md:gap-12">
						{[
						{
							step: "01",
							title: "Create your profile",
							description:
							"Answer a few questions about your health history, goals, and preferences to help us understand your unique needs.",
							color: "from-blue-500/20 to-blue-600/20",
							delay: 0,
						},
						{
							step: "02",
							title: "Get personalized insights",
							description:
							"Our AI analyzes your data to provide tailored health recommendations and insights specific to your body and goals.",
							color: "from-cyan-500/20 to-cyan-600/20",
							delay: 0.1,
						},
						{
							step: "03",
							title: "Track your progress",
							description:
							"Monitor your health journey with intuitive dashboards and receive ongoing guidance to help you stay on track.",
							color: "from-teal-500/20 to-teal-600/20",
							delay: 0.2,
						},
						].map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: item.delay }}
								className="relative"
							>
								<div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-sm"></div>
								<div className="relative h-full p-8 border bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl">
									<div
										className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 text-white font-medium`}
									>
										{item.step}
									</div>
									<h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
									<p className="text-zinc-400">{item.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="relative py-20 md:py-32 bg-[#0D1425]">
				<div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
					<div className="container px-6 mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="mb-16 text-center"
						>
							<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/5 backdrop-blur-sm">
								<span className="text-sm font-medium text-zinc-300">Comprehensive health management</span>
							</div>
							<h2 className="mb-4 text-3xl font-bold md:text-4xl">Features designed for your wellbeing</h2>
							<p className="max-w-2xl mx-auto text-zinc-400">
								Our platform combines cutting-edge technology with personalized health insights to help you live your best
								life.
							</p>
						</motion.div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{[
						{
							icon: <Heart className="text-rose-400" />,
							title: "Personalized Health Plans",
							description: "Receive customized recommendations based on your unique profile, goals, and health data.",
							color: "from-rose-500/20 to-rose-600/20",
						},
						{
							icon: <Activity className="text-emerald-400" />,
							title: "Progress Tracking",
							description:
							"Monitor your health metrics with intuitive dashboards and visualizations that make sense.",
							color: "from-emerald-500/20 to-emerald-600/20",
						},
						{
							icon: <Shield className="text-blue-400" />,
							title: "Private & Secure",
							description: "Your health data is encrypted and protected with enterprise-grade security protocols.",
							color: "from-blue-500/20 to-blue-600/20",
						},
						{
							icon: <Brain className="text-purple-400" />,
							title: "AI-Powered Insights",
							description: "Advanced algorithms analyze your data to provide meaningful, actionable health insights.",
							color: "from-purple-500/20 to-purple-600/20",
						},
						{
							icon: <Leaf className="text-green-400" />,
							title: "Holistic Approach",
							description:
							"Address all aspects of your health including physical, mental, and nutritional wellbeing.",
							color: "from-green-500/20 to-green-600/20",
						},
						{
							icon: <Activity className="text-amber-400" />,
							title: "Adaptive Guidance",
							description: "Receive ongoing guidance that adapts to your changing health needs and progress.",
							color: "from-amber-500/20 to-amber-600/20",
						},
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.05 }}
								className="relative group"
							>
								<div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl blur-sm transition-opacity"></div>
								<div className="relative h-full p-6 transition-colors border bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl hover:border-white/20">
								<div
									className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
								>
									{feature.icon}
								</div>
								<h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
								<p className="text-zinc-400">{feature.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section id="testimonials" className="relative py-20 md:py-32">
				<div className="container px-6 mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="mb-16 text-center"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-white/5 backdrop-blur-sm">
						<span className="text-sm font-medium text-zinc-300">Success stories</span>
						</div>
						<h2 className="mb-4 text-3xl font-bold md:text-4xl">What our users say</h2>
						<p className="max-w-2xl mx-auto text-zinc-400">
						Join thousands of satisfied users who have transformed their health with LifeLink.
						</p>
					</motion.div>

					<div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
						{[
						{
							quote:
							"LifeLink has completely changed how I approach my health. The personalized recommendations are spot on!",
							name: "Sarah J.",
							role: "Fitness Enthusiast",
							image: "/testimonial---1.png",
							rating: 5,
						},
						{
							quote:
							"As someone with chronic health issues, having all my data in one place with smart insights has been invaluable.",
							name: "Michael T.",
							role: "Health Advocate",
							image: "/testimonial---2.png",
							rating: 5,
						},
						{
							quote:
							"The interface is beautiful and intuitive. I've finally found a health app that I actually enjoy using daily.",
							name: "Priya K.",
							role: "Tech Professional",
							image: "/testimonial---3.png",
							rating: 5,
						},
						].map((testimonial, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="relative"
							>
								<div className="absolute -inset-px bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-sm"></div>
									<div className="relative h-full p-6 border bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl">
										<div className="flex gap-1 mb-4">
											{[...Array(testimonial.rating)].map((_, i) => (
											<svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
											</svg>
											))}
										</div>
									<p className="mb-6 text-zinc-300">&ldquo;{testimonial.quote}&ldquo;</p>
									<div className="flex items-center gap-3">
										<div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] overflow-hidden">
											<Image
												src={testimonial.image || "/placeholder.svg"}
												alt={testimonial.name}
												fill
												className="object-cover"
											/>
										</div>
										<div>
											<p className="font-medium">{testimonial.name}</p>
											<p className="text-sm text-zinc-400">{testimonial.role}</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>


			{/* CTA Section */}
			<section className="relative py-20 md:py-32">
				<div className="container px-6 mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="relative overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-[#1A4B84] via-[#0F172A] to-[#0D1425] rounded-3xl"></div>
						<div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>

						{/* Decorative elements */}
						<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-[#4FACFE]/20 to-transparent rounded-full filter blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/2"></div>
						<div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-[#00F2FE]/20 to-transparent rounded-full filter blur-3xl opacity-60 transform -translate-x-1/3 translate-y-1/2"></div>

						<div className="relative z-10 flex flex-col items-center justify-between gap-12 p-8 md:flex-row md:p-16">
							<div className="max-w-2xl">
								<h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to transform your health journey?</h2>
								<p className="mb-8 text-lg text-zinc-300">
									Join thousands of users who have already improved their health and wellbeing with LifeLink&apos;s
									personalized guidance.
								</p>

								<div className="flex flex-wrap gap-6 mb-8">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
											<Shield className="text-[#4FACFE] w-6 h-6" />
										</div>
										<div>
											<p className="font-medium">Secure & Private</p>
											<p className="text-sm text-zinc-400">Your data is always protected</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10">
											<Activity className="text-[#00F2FE] w-6 h-6" />
										</div>
										<div>
											<p className="font-medium">Personalized</p>
											<p className="text-sm text-zinc-400">Tailored to your unique needs</p>
										</div>
									</div>
								</div>

								<Link
									href="/signup"
									className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] hover:opacity-90 px-8 py-4 rounded-full font-medium transition-all shadow-lg shadow-blue-500/20 group"
								>
									Get Started
									<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
								</Link>
							</div>

							<div className="relative w-full max-w-md">
								<div className="absolute -inset-1 bg-gradient-to-r from-[#4FACFE]/30 to-[#00F2FE]/30 rounded-2xl blur"></div>
								<div className="relative overflow-hidden border bg-white/5 backdrop-blur-md border-white/10 rounded-2xl">
									<Image
										src="/app-preview.png"
										alt="LifeLink App Preview"
										width={800}
										height={450}
										className="w-full h-auto"
									/>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative bg-[#0D1425] pt-20 pb-10">
				<div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
				<div className="container px-6 mx-auto">
					<div className="grid grid-cols-1 gap-10 mb-16 md:grid-cols-2 lg:grid-cols-5">
						<div className="lg:col-span-2">
							<div className="flex items-center gap-3 mb-6">
								<div className="relative w-10 h-10">
									<Image src="/lifelink_logo.png" alt="LifeLink Logo" fill className="object-contain" />
								</div>
								<span className="text-xl font-medium tracking-tight">LifeLink</span>
							</div>
							<p className="max-w-md mb-6 text-zinc-400">
								LifeLink is your personal health companion, providing AI-powered insights and guidance for a balanced,
								healthier life.
							</p>
							
						</div>

						{footerLinks.map((column, i) => (
							<div key={i}>
								<h3 className="mb-4 text-lg font-medium">{column.title}</h3>
								<ul className="space-y-3">
									{column.links.map((link, j) => (
										<li key={j}>
											<a href={link.href} className="transition-colors text-zinc-400 hover:text-white">
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}

					</div>

					<div className="flex flex-col items-center justify-between pt-8 border-t border-white/10 md:flex-row">
						<p className="text-sm text-zinc-500">© {new Date().getFullYear()} LifeLink. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">							
							<a href="/termsofservice" className="text-sm transition-colors text-zinc-500 hover:text-white">
								Terms of Service
							</a>							
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
