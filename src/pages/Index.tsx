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
    <div className="min-h-screen bg-background pb-20">
      {/* Auth Banner */}
      {!user && (
        <div className="bg-gradient-primary/10 border-b border-primary/20 p-3 text-center">
          <p className="text-sm text-foreground">
            <Button variant="link" onClick={() => navigate("/auth")} className="text-primary font-bold p-0 h-auto hover:no-underline">
              Sign in
            </Button>
            {" "}to book events and unlock exclusive features
          </p>
        </div>
      )}
      
      <SearchBar />
      
      <main className="max-w-lg mx-auto px-4">
        <div className="pt-4 space-y-6">
          <HeroCarousel />

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
                <p className="text-sm text-muted-foreground mt-1">Discover what's happening at DU</p>
              </div>
              <button 
                onClick={() => navigate("/explore")}
                className="text-sm text-primary font-semibold hover:underline"
              >
                See All
              </button>
            </div>
            
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="min-w-[280px] h-[420px] rounded-3xl bg-gradient-card animate-pulse border border-border/30" />
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
              <div className="text-center py-12 bg-gradient-card rounded-3xl border border-border/30">
                <p className="text-muted-foreground">No events available yet. Check back soon!</p>
              </div>
            )}
          </section>

          <CategoryGrid />

          <SponsorshipSection />

          <div className="handwritten text-center text-primary/40 text-sm py-4">
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
