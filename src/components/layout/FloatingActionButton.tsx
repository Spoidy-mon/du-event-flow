import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const FloatingActionButton = () => {
  const navigate = useNavigate();
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setCanCreate(false);
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData && (roleData.role === "contributor" || roleData.role === "sponsor")) {
      setCanCreate(true);
    }
  };

  if (!canCreate) return null;

  return (
    <Button
      size="lg"
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full gradient-primary shadow-glow transition-smooth hover:scale-110 active:scale-95"
      onClick={() => navigate("/create-event")}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
