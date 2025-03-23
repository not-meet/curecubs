"use client";

import React from "react";
import { motion } from "motion/react";
import { Stethoscope, MapPin, Brain, Pill } from "lucide-react";
import { Pointer } from "@/components/magicui/pointer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesWeProvide() {
  const services = [
    {
      title: "Medical Reports Assessment",
      description: "Get expert analysis of your medical reports with AI-powered insights to help you understand your health status better.",
      color: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      headingColor: "text-blue-800 dark:text-blue-200",
      icon: Stethoscope,
      pointerColor: "fill-blue-500"
    },
    {
      title: "Find Nearest Doctor",
      description: "Quickly locate healthcare professionals near you based on your symptoms, insurance, and preferences.",
      color: "from-green-50 to-green-100 dark:from-green-900 dark:to-green-800",
      textColor: "text-green-700 dark:text-green-300",
      headingColor: "text-green-800 dark:text-green-200",
      icon: MapPin,
      pointerColor: "fill-green-500"
    },
    {
      title: "AI Therapist",
      description: "Access mental health support anytime with our AI therapist that offers personalized guidance and coping strategies.",
      color: "from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      headingColor: "text-purple-800 dark:text-purple-200",
      icon: Brain,
      pointerColor: "fill-purple-500"
    },
    {
      title: "Medication Delivery",
      description: "Order your prescriptions with one tap and get them delivered to your doorstep within hours.",
      color: "from-rose-50 to-rose-100 dark:from-rose-900 dark:to-rose-800",
      textColor: "text-rose-700 dark:text-rose-300",
      headingColor: "text-rose-800 dark:text-rose-200",
      icon: Pill,
      pointerColor: "fill-rose-500"
    }
  ];

  return (
    <div className="w-full py-16 px-4 md:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-6xl font-bold mb-3 text-slate-800 dark:text-slate-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Services We Provide
          </motion.h2>
          <motion.p
            className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Milo offers comprehensive services designed to encourage healthcare awareness and enhance your overall well-being journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`col-span-1 overflow-hidden border-none bg-gradient-to-br ${service.color} shadow-lg transition-all hover:shadow-xl`}
            >
              <CardHeader className="relative pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1 * index
                    }}
                  >
                    <service.icon className={service.textColor} />
                  </motion.div>
                  {service.title}
                </CardTitle>
                <CardDescription className={`text-lg ${service.textColor}`}>
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative flex h-36 items-center justify-center p-6">
                <span className={`pointer-events-none text-center text-lg font-medium ${service.headingColor}`}>
                  Hover to explore
                </span>
              </CardContent>
              <Pointer className={service.pointerColor}>
                <motion.div
                  animate={{
                    scale: [0.9, 1.1, 0.9],
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <service.icon size={24} className="text-black dark:text-black" />
                </motion.div>
              </Pointer>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
