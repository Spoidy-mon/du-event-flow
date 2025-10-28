import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, MessageSquare, BookOpen, Award, User } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Session {
  id: string;
  advisor_name: string;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  topic: string;
  status: string;
}

export default function Consultancy() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isStudent, setIsStudent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to access consultancy");
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user is a student
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const hasStudentRole = roles?.some(r => r.role === "student");
    setIsStudent(hasStudentRole || false);

    if (hasStudentRole) {
      loadSessions(session.user.id);
    }
  };

  const loadSessions = async (userId: string) => {
    const { data, error } = await supabase
      .from("consultancy_sessions")
      .select("*")
      .eq("student_id", userId)
      .order("session_date", { ascending: true });

    if (error) {
      console.error("Error loading sessions:", error);
    } else {
      setSessions(data || []);
    }
  };

  const handleBookSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const advisorName = formData.get("advisor") as string;
    const duration = parseInt(formData.get("duration") as string);
    const time = formData.get("time") as string;
    const topic = formData.get("topic") as string;
    const notes = formData.get("notes") as string;

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const { error } = await supabase
      .from("consultancy_sessions")
      .insert({
        student_id: user.id,
        advisor_name: advisorName,
        session_date: format(selectedDate, "yyyy-MM-dd"),
        session_time: time,
        duration_minutes: duration,
        topic,
        notes,
        status: "pending",
      });

    if (error) {
      toast.error("Failed to book session: " + error.message);
    } else {
      toast.success("Session booked successfully!");
      setIsDialogOpen(false);
      loadSessions(user.id);
    }
  };

  if (!user) {
    return null;
  }

  const advisors = [
    { name: "Dr. Sharma", specialization: "Career Guidance" },
    { name: "Prof. Kumar", specialization: "Technical Skills" },
    { name: "Ms. Patel", specialization: "Internship Prep" },
    { name: "Dr. Mehta", specialization: "Higher Studies" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <header className="glass border-b border-border/40 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Career Consultancy Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Get personalized career guidance from DU experts
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {!isStudent ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>
                Only students can book consultancy sessions. Please sign up with a student account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-elegant transition-smooth shadow-card">
                    <CardContent className="pt-6 text-center">
                      <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Book Session</h3>
                      <p className="text-xs text-muted-foreground">Schedule 1:1 meeting</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Book Career Consultancy</DialogTitle>
                    <DialogDescription>
                      Choose your preferred date, time, and advisor
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookSession} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advisor">Select Advisor</Label>
                      <Select name="advisor" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose advisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {advisors.map((advisor) => (
                            <SelectItem key={advisor.name} value={advisor.name}>
                              {advisor.name} - {advisor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Select name="duration" defaultValue="30" required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        name="topic"
                        placeholder="e.g., Career path guidance"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Any specific questions or topics..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full gradient-primary">
                      Confirm Booking
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Card className="shadow-card">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 text-secondary" />
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-xs text-muted-foreground">Coming Soon</p>
                </CardContent>
              </Card>
            </div>

            {/* Advisors */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Our Advisors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {advisors.map((advisor) => (
                  <div
                    key={advisor.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-semibold">{advisor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {advisor.specialization}
                      </p>
                    </div>
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Career Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  📄 Resume Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🎯 Internship Match Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📚 Career Guides (PDF)
                </Button>
              </CardContent>
            </Card>

            {/* My Sessions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  My Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No sessions booked yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-lg border border-border space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{session.topic}</p>
                            <p className="text-sm text-muted-foreground">
                              with {session.advisor_name}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              session.status === "confirmed"
                                ? "bg-accent/20 text-accent-foreground"
                                : session.status === "pending"
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(new Date(session.session_date), "MMM dd, yyyy")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.session_time} ({session.duration_minutes}m)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
