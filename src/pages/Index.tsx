import { SearchBar } from "@/components/home/SearchBar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventCard } from "@/components/home/EventCard";
import { SponsorshipSection } from "@/components/home/SponsorshipSection";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import diwaliMela from "@/assets/diwali-mela.jpg";
import scienceWorkshop from "@/assets/science-workshop.jpg";
import collegeTour from "@/assets/college-tour.jpg";

const upcomingEvents = [
  {
    title: "Classical Music Night",
    date: "Feb 6",
    time: "7:00 PM",
    venue: "North Campus Auditorium",
    image: diwaliMela,
    tags: ["Cultural", "Music"],
    isFree: true,
  },
  {
    title: "Entrepreneurship Workshop",
    date: "Feb 8",
    time: "10:00 AM",
    venue: "Commerce Department",
    image: scienceWorkshop,
    tags: ["Workshop", "Career"],
  },
  {
    title: "Annual Sports Fest",
    date: "Feb 12",
    time: "9:00 AM",
    venue: "Sports Complex",
    image: collegeTour,
    tags: ["Sports", "Cultural"],
    isSponsored: true,
  },
  {
    title: "Tech Talk Series",
    date: "Feb 15",
    time: "3:00 PM",
    venue: "CS Department",
    image: scienceWorkshop,
    tags: ["Seminar", "Tech"],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <SearchBar />
      
      <main className="max-w-lg mx-auto px-4">
        <div className="pt-4 space-y-6">
          <HeroCarousel />

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Happening This Week</h2>
              <button className="text-sm text-primary font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {upcomingEvents.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </section>

          <CategoryGrid />

          <SponsorshipSection />

          <div className="handwritten text-center text-primary/60 text-sm py-4">
            <p>Wk 05 | Day 032-333</p>
            <p className="mt-2">Designed in India 🇮🇳</p>
          </div>
        </div>
      </main>

      <BottomNav />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
