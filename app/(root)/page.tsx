import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ServicesWeProvide } from "./_components/ServicesWeProvide";
import { TestimonialsSection } from "./_components/Review";
import WhyMiloSection from "./_components/WhyMylo";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  return (
    <main>
      <div className="relative w-full h-screen overflow-hidden">
        {/* SVG as an img tag for better control */}
        <div className="w-full h-[70%] relative">
          <img
            src="/bg2.svg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right-aligned title and subtitle container */}
        <div className="absolute top-1/6 right-10 text-right p-8 z-10 max-w-xl">
          <AnimatedGradientText
            speed={2}
            colorFrom="#084A6D"
            colorTo="#000000"
            className="text-9xl font-extrabold mb-6 tracking-tight drop-shadow-2xl shadow-black animate-fadeIn"
          >
            MILO
          </AnimatedGradientText>
          <div className="mt-4 overflow-hidden text-2xl text-indigo-800 drop-shadow-lg font-semibold animate-fadeInSlow">
            <TypingAnimation>Medical Intelligent Life Organizer</TypingAnimation>
          </div>
        </div>
      </div>
      <ServicesWeProvide />
      <WhyMiloSection />
      <TestimonialsSection />
    </main>
  );
};

export default Home;
