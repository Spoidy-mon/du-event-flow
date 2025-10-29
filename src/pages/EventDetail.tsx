import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Tag, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    fetchEvent();
    if (user) {
      checkRegistration();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", id)
        .eq("user_id", user.id)
        .single();

      if (data) setIsRegistered(true);
    } catch (error) {
      // User not registered
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: id,
          user_id: user.id,
        });

      if (error) throw error;

      setIsRegistered(true);
      toast({
        title: "Success!",
        description: "You've successfully registered for this event",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!user) return;

    setRegistering(true);
    try {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setIsRegistered(false);
      toast({
        title: "Cancelled",
        description: "Your registration has been cancelled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel registration",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center pb-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="rounded-2xl overflow-hidden shadow-elegant bg-card">
          {event.image_url && (
            <div className="relative h-64 overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {event.is_free && (
                  <Badge className="bg-accent text-accent-foreground">Free</Badge>
                )}
                {event.is_sponsored && (
                  <Badge className="gradient-primary text-white">Sponsored</Badge>
                )}
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <Badge variant="outline" className="mb-4">{event.category}</Badge>
            </div>

            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {event.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>{event.venue}</span>
              </div>
              {event.max_participants && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" />
                  <span>Max {event.max_participants} participants</span>
                </div>
              )}
            </div>

            {event.description && (
              <div>
                <h3 className="font-semibold mb-2">About this event</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            )}

            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-4">
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent text-center">
                    <p className="font-medium">You're registered for this event!</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleUnregister}
                    disabled={registering}
                  >
                    {registering ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full gradient-primary text-white"
                  onClick={handleRegister}
                  disabled={registering}
                  size="lg"
                >
                  {registering ? "Registering..." : "Register Now"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}