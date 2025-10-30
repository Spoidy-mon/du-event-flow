import { Home, Compass, Ticket, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: Ticket, label: "My Events", path: "/my-events" },
  { icon: MessageSquare, label: "Consultancy", path: "/consultancy" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-smooth relative",
                "hover:bg-primary/10 active:scale-95",
                isActive && "text-primary"
              )}
            >
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full" />
              )}
              <Icon 
                className={cn(
                  "h-6 w-6 transition-smooth",
                  isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                )} 
              />
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
