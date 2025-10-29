import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "",
    tags: "",
    max_participants: "",
    is_free: true,
    is_sponsored: false,
    image_url: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roleData || (roleData.role !== "contributor" && roleData.role !== "sponsor")) {
      toast({
        title: "Access Denied",
        description: "Only contributors and sponsors can create events",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setUserRole(roleData.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const { error } = await supabase.from("events").insert({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        category: formData.category,
        tags: tagsArray,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        is_free: formData.is_free,
        is_sponsored: formData.is_sponsored,
        image_url: formData.image_url || null,
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event created successfully",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="rounded-2xl shadow-elegant bg-card p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Classical Music Night"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your event..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue *</Label>
              <Input
                id="venue"
                required
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., North Campus Auditorium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cultural Events">Cultural Events</SelectItem>
                  <SelectItem value="Seminars">Seminars</SelectItem>
                  <SelectItem value="Workshops">Workshops</SelectItem>
                  <SelectItem value="Fairs">Fairs</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., Music, Cultural, Evening"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Participants (optional)</Label>
              <Input
                id="max_participants"
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="is_free">Free Event</Label>
              <Switch
                id="is_free"
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="is_sponsored">Sponsored Event</Label>
              <Switch
                id="is_sponsored"
                checked={formData.is_sponsored}
                onCheckedChange={(checked) => setFormData({ ...formData, is_sponsored: checked })}
              />
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary text-white"
              disabled={loading}
              size="lg"
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}