"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Globe, Copy, ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateWebsite } from "@/actions/personal-brand";

export default function WebsiteGenerator() {
  const [loading, setLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState(null);
  const [formData, setFormData] = useState({
    websiteType: "",
    targetAudience: "",
    skills: "",
    portfolio: "",
    socialLinks: "",
    imagePreferences: "",
    colorPreferences: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.websiteType) {
      toast.error("Please select a website type");
      return;
    }

    try {
      setLoading(true);
      const data = await generateWebsite(formData);
      setWebsiteData(data);
      toast.success("Website content generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate website content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Website Generator</CardTitle>
          <CardDescription>
            Create professional website content tailored to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Website Type</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("websiteType", value)
                }
                value={formData.websiteType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select website type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio Website</SelectItem>
                  <SelectItem value="professional">
                    Professional Profile
                  </SelectItem>
                  <SelectItem value="freelancer">
                    Freelancer Showcase
                  </SelectItem>
                  <SelectItem value="consultant">Consultant Website</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input
                name="targetAudience"
                placeholder="Who is your website aimed at? (e.g., recruiters, clients)"
                value={formData.targetAudience}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Skills & Expertise</Label>
              <Textarea
                name="skills"
                placeholder="List your key skills and areas of expertise (comma-separated)"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Portfolio Items</Label>
              <Textarea
                name="portfolio"
                placeholder="Describe your key projects or work examples"
                value={formData.portfolio}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Media Links</Label>
              <Textarea
                name="socialLinks"
                placeholder="Add your social media profile links (one per line)"
                value={formData.socialLinks}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Image Preferences</Label>
              <Textarea
                name="imagePreferences"
                placeholder="Describe your preferred image style and types"
                value={formData.imagePreferences}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Color Preferences</Label>
              <Input
                name="colorPreferences"
                placeholder="Any specific colors or themes you prefer?"
                value={formData.colorPreferences}
                onChange={handleInputChange}
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Generate Website Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {websiteData && (
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Headline</Label>
                  <p className="text-xl font-bold">
                    {websiteData.hero.headline}
                  </p>
                </div>
                <div>
                  <Label>Subheadline</Label>
                  <p className="text-muted-foreground">
                    {websiteData.hero.subheadline}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose dark:prose-invert">
                  {websiteData.about.content}
                </div>
                <div>
                  <Label>Key Points</Label>
                  <ul className="list-disc list-inside mt-2">
                    {websiteData.about.keyPoints.map((point, index) => (
                      <li key={index} className="text-muted-foreground">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Section */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {websiteData.portfolio.projects.map((project, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Design Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Design Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Color Scheme</Label>
                  <div className="flex gap-4 mt-2">
                    {Object.entries(websiteData.design.colors).map(
                      ([name, color]) => (
                        <div key={name} className="text-center">
                          <div
                            className="w-16 h-16 rounded-lg border"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-muted-foreground mt-1">
                            {name}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label>Image Recommendations</Label>
                  <ul className="list-disc list-inside mt-2">
                    {websiteData.design.images.map((image, index) => (
                      <li key={index} className="text-muted-foreground">
                        {image}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label>Layout Suggestions</Label>
                  <ul className="list-disc list-inside mt-2">
                    {websiteData.design.layout.map((suggestion, index) => (
                      <li key={index} className="text-muted-foreground">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
