import { Search, Mic, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar = () => {
  return (
    <div className="sticky top-0 z-40 glass border-b border-border/40 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Diwali Mela, Seminars…"
            className="pl-10 pr-10 h-12 rounded-full border-primary/20 focus:border-primary"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full hover:bg-primary/10"
          >
            <Mic className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="font-medium">Delhi University Campus</span>
        <span className="text-muted-foreground">• North Campus</span>
      </div>
    </div>
  );
};
