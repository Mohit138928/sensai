import { getRoadmap } from "@/actions/roadmap";
import RoadmapTimeline from "./_components/roadmap-timeline";
import GenerateRoadmap from "./_components/generate-roadmap";
import { Card, CardContent } from "@/components/ui/card";

export default async function RoadmapPage() {
  let roadmap = null;
  let error = null;

  try {
    roadmap = await getRoadmap();
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-6xl font-bold gradient-title mb-2">
            Career Roadmap
          </h1>
          <p className="text-muted-foreground">
            Your personalized 5-year career progression plan
          </p>
        </div>
        <GenerateRoadmap />
      </div>

      {error ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
          </CardContent>
        </Card>
      ) : roadmap ? (
        <RoadmapTimeline data={roadmap} />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Generate your career roadmap to see a personalized progression
              plan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
