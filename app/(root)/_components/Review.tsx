"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Marquee } from "@/components/magicui/marquee";

// Sample testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    username: "@sarahj",
    body: "Milo has completely transformed how I manage my health. The AI therapist feature helped me through a difficult time.",
    img: "https://avatar.vercel.sh/sarahj",
    color: "bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60",
    borderColor: "border-blue-200 dark:border-blue-700"
  },
  {
    name: "Michael Chen",
    username: "@mikechen",
    body: "Finding a specialist in my area was so simple with Milo. I was able to book an appointment within minutes!",
    img: "https://avatar.vercel.sh/mikechen",
    color: "bg-green-50 dark:bg-green-900/40 hover:bg-green-100 dark:hover:bg-green-900/60",
    borderColor: "border-green-200 dark:border-green-700"
  },
  {
    name: "Emma Rodriguez",
    username: "@emmar",
    body: "The medical reports assessment feature helped me understand my lab results better than my doctor explained them.",
    img: "https://avatar.vercel.sh/emmar",
    color: "bg-purple-50 dark:bg-purple-900/40 hover:bg-purple-100 dark:hover:bg-purple-900/60",
    borderColor: "border-purple-200 dark:border-purple-700"
  },
  {
    name: "David Wilson",
    username: "@davew",
    body: "I love how Milo reminds me to take my medications and makes reordering prescriptions so easy!",
    img: "https://avatar.vercel.sh/davew",
    color: "bg-rose-50 dark:bg-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60",
    borderColor: "border-rose-200 dark:border-rose-700"
  },
  {
    name: "Aisha Patel",
    username: "@aishap",
    body: "As someone with chronic health issues, Milo has been a game-changer for managing my conditions and tracking symptoms.",
    img: "https://avatar.vercel.sh/aishap",
    color: "bg-amber-50 dark:bg-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60",
    borderColor: "border-amber-200 dark:border-amber-700"
  },
  {
    name: "Jake Thompson",
    username: "@jaket",
    body: "The medication delivery service is incredibly reliable. Never missed a dose since using Milo!",
    img: "https://avatar.vercel.sh/jaket",
    color: "bg-teal-50 dark:bg-teal-900/40 hover:bg-teal-100 dark:hover:bg-teal-900/60",
    borderColor: "border-teal-200 dark:border-teal-700"
  },
];

// Split testimonials into two rows for the marquee
const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

// TestimonialCard component with pastel colors
const TestimonialCard = ({
  img,
  name,
  username,
  body,
  color,
  borderColor,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  color: string;
  borderColor: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2 transition-all duration-300",
        color,
        borderColor
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt={`${name}'s avatar`} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-slate-800 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-slate-600 dark:text-white/60">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-slate-700 dark:text-slate-200">{body}</blockquote>
    </figure>
  );
};

export function TestimonialsSection() {
  return (
    <div className="w-full py-16 px-4 md:px-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl font-bold mb-3 text-slate-800 dark:text-slate-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of people who have transformed their healthcare experience with Milo
          </motion.p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:25s]">
            {firstRow.map((testimonial) => (
              <TestimonialCard
                key={testimonial.username}
                {...testimonial}
              />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s] mt-4">
            {secondRow.map((testimonial) => (
              <TestimonialCard
                key={testimonial.username}
                {...testimonial}
              />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 dark:from-slate-900"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 dark:from-slate-900"></div>
        </div>
      </div>
    </div>
  );
}
