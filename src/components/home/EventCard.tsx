import { Calendar, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  tags?: string[];
  isFree?: boolean;
  isSponsored?: boolean;
}

export const EventCard = ({
  title,
  date,
  time,
  venue,
  image,
  tags = [],
  isFree = false,
  isSponsored = false,
}: EventCardProps) => {
  return (
    <div className="group min-w-[280px] max-w-[280px] rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-2 bg-card">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {isFree && (
            <Badge className="bg-accent text-accent-foreground">Free</Badge>
          )}
          {isSponsored && (
            <Badge className="gradient-primary text-white">Sponsored</Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-smooth">
          {title}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date} • {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{venue}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button className="w-full gradient-primary text-white hover:opacity-90">
          Book Now
        </Button>
      </div>
    </div>
  );
};
