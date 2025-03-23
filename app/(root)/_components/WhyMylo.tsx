import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const WhyMiloSection = () => {
  // Array of PNG image numbers
  const images = [1, 2, 3, 4, 5];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* WHY MILO heading and description */}
        <div className="text-left mb-10">
          <h2 className="text-6xl md:text-5xl font-bold text-gray-800 mb-6 ml-8">
            WHY MILO!?
          </h2>
        </div>

        {/* Carousel with PNG images - 80% width */}
        <div className="w-4/5 mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((imageNumber) => (
                <CarouselItem key={imageNumber}>
                  <div className="p-2">
                    <Card className="border-0 shadow-none">
                      <CardContent className="flex items-center justify-center p-0">
                        <img
                          src={`/${imageNumber}.png`}
                          alt={`Feature ${imageNumber}`}
                          className="w-full h-full object-contain"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="mr-4 bg-blue-100 hover:bg-blue-200 border-blue-200" />
              <CarouselNext className="ml-4 bg-blue-100 hover:bg-blue-200 border-blue-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default WhyMiloSection;
