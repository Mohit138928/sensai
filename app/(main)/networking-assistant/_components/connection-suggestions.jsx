"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users, Target, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { suggestConnections } from "@/actions/networking";

export default function ConnectionSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    try {
      setLoading(true);
      const result = await suggestConnections();
      setSuggestions(result.suggestions);
    } catch (error) {
      toast.error("Failed to get connection suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connection Suggestions</CardTitle>
          <CardDescription>
            Get personalized suggestions for growing your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGetSuggestions}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{suggestion.role}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {suggestion.reason}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Search Keywords:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.searchKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Common Interests:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.commonInterests.map((interest, i) => (
                      <Badge key={i} variant="outline">
                        {interest}
                      </Badge>
                    ))}
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
