import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/layout/ProfileMenu";

export const SearchBar = () => {
  return (
    <div className="sticky top-0 z-40 glass border-b border-border/40 px-4 py-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search events, workshops, melas..."
            className="pl-12 h-12 rounded-2xl bg-secondary/50 border-border/50 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <ProfileMenu />
      </div>
      
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Delhi University</span>
        <span className="text-sm text-muted-foreground">• North Campus</span>
      </div>
    </div>
  );
};
