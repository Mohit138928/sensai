"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Lightbulb, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateContentIdeas } from "@/actions/personal-brand";

export default function ContentGenerator() {
  const [loading, setLoading] = useState(false);
  const [contentPlan, setContentPlan] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await generateContentIdeas();
      setContentPlan(data);
      toast.success("Content ideas generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate content ideas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Idea Generator</CardTitle>
          <CardDescription>
            Generate thought leadership content ideas for your professional
            brand
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
                Generating Ideas...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {contentPlan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPlan.topics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{topic.title}</h4>
                    <p className="text-muted-foreground">{topic.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.tags.map((tag, i) => (
                        <Badge key={i} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPlan.calendar.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.week}</p>
                      <p className="text-muted-foreground">{item.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
