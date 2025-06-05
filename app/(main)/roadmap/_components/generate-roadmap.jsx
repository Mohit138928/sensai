"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateCareerRoadmap } from "@/actions/roadmap";

export default function GenerateRoadmap() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateCareerRoadmap();
      toast.success("Career roadmap generated successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate Roadmap"
      )}
    </Button>
  );
}