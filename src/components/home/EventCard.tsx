import { Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  id?: string;
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
  id,
  title,
  date,
  time,
  venue,
  image,
  tags = [],
  isFree = false,
  isSponsored = false,
}: EventCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group min-w-[280px] max-w-[280px] rounded-3xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 cursor-pointer"
      onClick={() => id && navigate(`/events/${id}`)}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          {isFree && (
            <Badge className="bg-green-500/90 text-white border-0 shadow-lg backdrop-blur">Free</Badge>
          )}
          {isSponsored && (
            <Badge className="bg-gradient-primary text-primary-foreground border-0 shadow-lg backdrop-blur">Sponsored</Badge>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 drop-shadow-xl">
            {title}
          </h3>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-background/60 backdrop-blur text-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3 bg-gradient-card">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-foreground">{date} • {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1 text-foreground">{venue}</span>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-primary hover:shadow-glow transition-smooth text-primary-foreground font-semibold border-0"
          onClick={(e) => {
            e.stopPropagation();
            id && navigate(`/events/${id}`);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
