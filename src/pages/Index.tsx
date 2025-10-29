import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/home/SearchBar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EventCard } from "@/components/home/EventCard";
import { SponsorshipSection } from "@/components/home/SponsorshipSection";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import diwaliMela from "@/assets/diwali-mela.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(10);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Auth Banner */}
      {!user && (
        <div className="glass border-b border-border/40 sticky top-0 z-40">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Join DU Events Hub
            </p>
            <Button size="sm" onClick={() => navigate("/auth")} className="gradient-primary">
              Login / Sign Up
            </Button>
          </div>
        </div>
      )}
      
      <SearchBar />
      
      <main className="max-w-lg mx-auto px-4">
        <div className="pt-4 space-y-6">
          <HeroCarousel />

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Events</h2>
              <button 
                onClick={() => navigate("/explore")}
                className="text-sm text-primary font-medium hover:underline"
              >
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[280px] h-[380px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    time={event.time}
                    venue={event.venue}
                    image={event.image_url || diwaliMela}
                    tags={event.tags || []}
                    isFree={event.is_free}
                    isSponsored={event.is_sponsored}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No events available yet. Check back soon!</p>
              </div>
            )}
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
