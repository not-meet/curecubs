import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ServicesWeProvide } from "./_components/ServicesWeProvide";
import { TestimonialsSection } from "./_components/Review";

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const svgWidth = "100%";
  const svgMaxHeight = "70%";

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

        {/* Centered title and subtitle container */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-2xl p-8 z-10">
          <AnimatedGradientText
            speed={2}
            colorFrom="#C0C0CC"
            colorTo="#FFFFFF"
            className="text-9xl font-extrabold mb-6 tracking-tight drop-shadow-2xl shadow-black animate-fadeIn"
          >
            MILO
          </AnimatedGradientText>
          <div className="mt-4 overflow-hidden text-2xl text-indigo-700 drop-shadow-lg font-semibold animate-fadeInSlow">
            <TypingAnimation>Medical Intelligent Life Organizer</TypingAnimation>
          </div>
        </div>
      </div>
      <ServicesWeProvide />
      <TestimonialsSection />

    </main>
  );
};

export default Home;
