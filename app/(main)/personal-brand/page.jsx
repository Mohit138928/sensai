import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkedInOptimizer from "./_components/linkedin-optimizer";
import WebsiteGenerator from "./_components/website-generator";
import BioWriter from "./_components/bio-writer";
import ContentGenerator from "./_components/content-generator";
import SocialMediaPlanner from "./_components/social-media-planner";

export default function PersonalBrandPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-2">
        Personal Brand Builder
      </h1>
      <p className="text-muted-foreground mb-8">
        Build and optimize your professional online presence
      </p>

      <Tabs defaultValue="linkedin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          {/* <TabsTrigger value="bio">Professional Bio</TabsTrigger> */}
          <TabsTrigger value="content">Content Ideas</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin">
          <LinkedInOptimizer />
        </TabsContent>

        <TabsContent value="website">
          <WebsiteGenerator />
        </TabsContent>

        {/* <TabsContent value="bio">
          <BioWriter />
        </TabsContent> */}

        <TabsContent value="content">
          <ContentGenerator />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
}
