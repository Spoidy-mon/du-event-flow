import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingActionButton = () => {
  return (
    <Button
      size="lg"
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full gradient-primary shadow-glow transition-smooth hover:scale-110 active:scale-95 animate-pulse"
      onClick={() => console.log("Register event clicked")}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
