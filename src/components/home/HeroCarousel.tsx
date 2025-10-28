import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import diwaliMela from "@/assets/diwali-mela.jpg";
import scienceWorkshop from "@/assets/science-workshop.jpg";
import collegeTour from "@/assets/college-tour.jpg";

const slides = [
  {
    id: 1,
    image: diwaliMela,
    title: "Diwali Mela 2025",
    subtitle: "Feb 12 | Festive stalls, lanterns",
    badge: "Free Entry – Register via Website",
    annotation: "Floating registration via website link",
  },
  {
    id: 2,
    image: scienceWorkshop,
    title: "Aryabhatta Science & Math Workshop",
    subtitle: "Feb 6–8 | Interactive Learning Sessions",
    badge: "Scholarship Form Available",
    annotation: "आर्यभट्ट विज्ञान और गणित कार्यशाला",
  },
  {
    id: 3,
    image: collegeTour,
    title: "College Tour & Consultancy",
    subtitle: "Feb 24–28 | Campus exploration with experts",
    badge: "Book Your Slot",
    annotation: "Student / Scholarship form / Careers Connect",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-elegant mb-6">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full gradient-primary">
              {slide.badge}
            </div>
            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
            <p className="text-sm text-white/90 mb-2">{slide.subtitle}</p>
            {slide.annotation && (
              <p className="handwritten text-lg text-primary opacity-80">
                {slide.annotation}
              </p>
            )}
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-smooth",
              index === currentSlide
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
};
