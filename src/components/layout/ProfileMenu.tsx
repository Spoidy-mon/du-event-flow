import { User, Settings, Heart, Calendar, LogOut, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const ProfileMenu = () => {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const menuItems = [
    { icon: UserCircle, label: "My Profile", path: "/profile" },
    { icon: Calendar, label: "My Events", path: "/my-events" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (!user) return null;

  const userInitial = user.email?.charAt(0).toUpperCase() || "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-primary hover:shadow-glow transition-smooth">
          <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-card border-border">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <SheetTitle className="text-lg">{user.email}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {user.user_metadata?.role || "Student"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start gap-3 h-12 hover:bg-primary/10"
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          ))}
        </div>

        <Separator className="my-6" />

        <Button
          variant="destructive"
          className="w-full justify-start gap-3 h-12"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </SheetContent>
    </Sheet>
  );
};
