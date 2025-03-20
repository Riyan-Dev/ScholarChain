"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Brain, FileCode, Percent } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { RefObject } from "react"; // Import RefObject
import NetworkBackground from "@/components/landing-page/network-background";
import { useRouter } from "next/navigation";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

// Custom animation hook
function useAnimateOnScroll(threshold = 0.2): [RefObject<HTMLDivElement>, boolean] {  // Explicit return type
  const ref = useRef<HTMLDivElement>(null); // Specify type of useRef
  const isInView = useInView(ref, { once: false, amount: threshold });

  return [ref as RefObject<HTMLDivElement>, isInView];
}

export default function LandingPage() {
  const router = useRouter();
  const [heroRef, heroInView] = useAnimateOnScroll(0.3);
  const [featuresRef, featuresInView] = useAnimateOnScroll(0.1);
  const [processRef, processInView] = useAnimateOnScroll(0.1);
  const [ctaRef, ctaInView] = useAnimateOnScroll(0.5);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-70">
        <NetworkBackground />
      </div>

      {/* Header with Logo */}
      <motion.header
        className="relative z-10 flex w-full items-center px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white">ScholarChain</h2>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[80vh] w-full flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          ref={heroRef}
          className="max-w-4xl space-y-6"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
            variants={fadeInUp}
          >
            Student Loans <span className="text-gray-300">Reimagined</span>
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-xl leading-relaxed font-light sm:text-2xl"
            variants={fadeInUp}
          >
            ScholarChain provides interest-free student loans powered by
            blockchain technology, AI-driven assessment, and smart contracts.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
            variants={popIn}
          >
            <Button
              size="lg"
              onClick={() => router.push("/auth")}
              className="group bg-white px-8 py-6 text-lg font-semibold text-gray-900 hover:bg-gray-100"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Blocks */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          How ScholarChain Works
        </motion.h2>

        <motion.div
          ref={featuresRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {[
            {
              icon: <Shield className="h-10 w-10" />,
              title: "Blockchain Security",
              description:
                "Your loan data is secured on a transparent, immutable blockchain ledger ensuring complete privacy and security.",
            },
            {
              icon: <Brain className="h-10 w-10" />,
              title: "AI-Powered Assessment",
              description:
                "Our AI evaluates your academic potential, not just credit history, making loans accessible to all deserving students.",
            },
            {
              icon: <FileCode className="h-10 w-10" />,
              title: "Smart Contracts",
              description:
                "Automated smart contracts handle loan disbursement and repayment schedules with complete transparency.",
            },
            {
              icon: <Percent className="h-10 w-10" />,
              title: "Interest-Free Loans",
              description:
                "We believe education is a right. Our loans are 100% interest-free, with flexible repayment options.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              variants={popIn}
            >
              <div className="mb-4 rounded-full bg-gray-800 p-3 text-white">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-2xl bg-white/10 p-8 backdrop-blur-md"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="mb-8 text-center text-3xl font-bold text-white sm:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Simple Application Process
          </motion.h2>

          <motion.div
            ref={processRef}
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            {[
              {
                step: "01",
                title: "Create an Account",
                description:
                  "Sign up and verify your student status with our secure blockchain identity system.",
              },
              {
                step: "02",
                title: "AI Assessment",
                description:
                  "Our AI evaluates your academic profile and determines your loan eligibility without bias.",
              },
              {
                step: "03",
                title: "Receive Funds",
                description:
                  "Once approved, funds are disbursed directly to your institution via smart contracts.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center"
                variants={fadeInUp}
              >
                <motion.div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-2xl font-bold text-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
                {index < 2 && (
                  <div className="absolute top-8 left-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-gray-600 md:block"></div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
          >
            <Button
              size="lg"
              className="bg-white px-8 py-6 text-lg font-semibold text-gray-900 hover:bg-gray-100"
            >
              Apply Now
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          ref={ctaRef}
          className="flex flex-col items-center justify-between rounded-2xl bg-gradient-to-r from-gray-800 to-gray-700 p-8 text-center md:flex-row md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to transform your education journey?
            </h2>
            <p className="mt-2 text-gray-300">
              Join thousands of students already benefiting from interest-free
              loans.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-white px-8 py-6 text-lg font-semibold text-gray-900 hover:bg-gray-100"
            >
              Get Started Today
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900/30 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-sm text-gray-400 md:mb-0">
              © {new Date().getFullYear()} ScholarChain. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Contact Us", "FAQ"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}