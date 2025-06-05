import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectionGenerator from "./_components/connection-generator";
import EventsFinder from "./_components/events-finder";
import ConnectionSuggestions from "./_components/connection-suggestions";
import FollowUpManager from "./_components/follow-up-manager";

export default async function NetworkingPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-6xl font-bold gradient-title mb-2">
        Networking Assistant
      </h1>
      <p className="text-muted-foreground mb-8">
        Build and maintain your professional network effectively
      </p>

      <Tabs defaultValue="connect">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="follow-up">Follow Up</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="mt-6">
          <ConnectionGenerator />
        </TabsContent>

        <TabsContent value="follow-up" className="mt-6">
          <FollowUpManager />
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <EventsFinder />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <ConnectionSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
