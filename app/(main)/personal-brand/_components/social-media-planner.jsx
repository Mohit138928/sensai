"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSocialMediaStrategy } from "@/actions/personal-brand";

export default function SocialMediaPlanner() {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await createSocialMediaStrategy();
      setStrategy(data);
      toast.success("Social media strategy generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate strategy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Strategy Planner</CardTitle>
          <CardDescription>
            Get a personalized social media strategy for your professional brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Strategy...
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" />
                Generate Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {strategy && (
        <div className="space-y-6">
          {Object.entries(strategy.platforms).map(([platform, details]) => (
            <Card key={platform}>
              <CardHeader>
                <CardTitle>{platform}</CardTitle>
                <CardDescription>{details.focus}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Content Mix</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {details.contentMix.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Posting Schedule</h4>
                    <p className="text-muted-foreground">
                      {details.postingSchedule}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Metrics</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {details.metrics.map((metric, index) => (
                        <li key={index}>{metric}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
