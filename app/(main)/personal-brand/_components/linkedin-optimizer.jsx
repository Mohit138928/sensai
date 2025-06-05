"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { optimizeLinkedInProfile } from "@/actions/personal-brand";

export default function LinkedInOptimizer() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileData, setProfileData] = useState({
    headline: "",
    about: "",
    experience: "",
    skills: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptimize = async () => {
    if (!profileData.headline && !profileData.about) {
      toast.error(
        "Please enter at least your current headline and about section"
      );
      return;
    }

    try {
      setLoading(true);
      const optimizedProfile = await optimizeLinkedInProfile({ profileData });
      setProfile(optimizedProfile);
      toast.success("LinkedIn profile optimized successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to optimize profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LinkedIn Profile Optimizer</CardTitle>
          <CardDescription>
            Enter your current LinkedIn profile content to get personalized
            optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Current Headline</Label>
              <Input
                id="headline"
                name="headline"
                placeholder="Enter your current LinkedIn headline"
                value={profileData.headline}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about">About Section</Label>
              <Textarea
                id="about"
                name="about"
                placeholder="Enter your current About section content"
                value={profileData.about}
                onChange={handleInputChange}
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Recent Experience (Optional)</Label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="Enter your most recent work experience description"
                value={profileData.experience}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Current Skills (Optional)</Label>
              <Textarea
                id="skills"
                name="skills"
                placeholder="List your current skills (comma-separated)"
                value={profileData.skills}
                onChange={handleInputChange}
              />
            </div>

            <Button
              onClick={handleOptimize}
              className="w-full"
              disabled={
                loading || (!profileData.headline && !profileData.about)
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Optimize Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {profile && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Headline Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.headline && (
                <>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Current Headline
                    </h4>
                    <p className="text-muted-foreground">
                      {profile.headline.current}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Suggested Improvement
                    </h4>
                    <p className="text-primary">{profile.headline.suggested}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {profile.headline.reasoning}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyText(profile.headline.suggested)}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Headline
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.summary && (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Feedback</h4>
                    <p className="text-muted-foreground">
                      {profile.summary.feedback}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Suggested Improvements
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {profile.summary.improvements.map(
                        (improvement, index) => (
                          <li key={index} className="text-muted-foreground">
                            {improvement}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.experienceOptimizations?.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{exp.role}</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {exp.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-muted-foreground">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.recommendedKeywords?.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills to Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsToAdd?.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {profile.profileCompletionTips && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {profile.profileCompletionTips.map((tip, index) => (
                    <li key={index} className="text-muted-foreground">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
