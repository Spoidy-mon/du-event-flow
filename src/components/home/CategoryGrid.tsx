import { Music, Award, Wrench, ShoppingBag, HeartHandshake, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { icon: Music, label: "Cultural Events", color: "text-pink-500" },
  { icon: Award, label: "Seminars", color: "text-blue-500" },
  { icon: Wrench, label: "Workshops", color: "text-purple-500" },
  { icon: ShoppingBag, label: "Fairs", color: "text-orange-500" },
  { icon: HeartHandshake, label: "Consultancy", color: "text-green-500" },
  { icon: Home, label: "Home Events", color: "text-indigo-500" },
];

export const CategoryGrid = () => {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-4">Event Categories</h2>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.label}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 bg-card active:scale-95"
            >
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center gradient-card",
                category.color
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
