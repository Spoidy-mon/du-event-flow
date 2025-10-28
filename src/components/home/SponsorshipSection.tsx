import { Download, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SponsorshipSection = () => {
  return (
    <div className="py-6">
      <div className="rounded-2xl gradient-primary p-6 text-white shadow-glow">
        <h2 className="text-2xl font-bold mb-2">Sponsorship Opportunities</h2>
        <p className="text-white/90 mb-6">Gain 20% Visibility Boost!</p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="font-bold">1</span>
            </div>
            <span className="text-sm">Fill Form</span>
          </div>
          <div className="h-px flex-1 bg-white/30 mx-2" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-sm">Upload Logo</span>
          </div>
          <div className="h-px flex-1 bg-white/30 mx-2" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-sm">Confirmed</span>
          </div>
        </div>

        <Button variant="secondary" className="w-full" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Download PDF Form
        </Button>
      </div>
    </div>
  );
};
