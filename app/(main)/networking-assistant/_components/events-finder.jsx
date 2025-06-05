"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar, MapPin, Users, ExternalLink, Loader2 } from "lucide-react";
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
import { findIndustryEvents } from "@/actions/networking";

export default function EventsFinder() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const foundEvents = await findIndustryEvents(data);
      setEvents(foundEvents);
    } catch (error) {
      toast.error("Failed to find events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Industry Events</CardTitle>
          <CardDescription>
            Discover networking events and conferences in your industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="City or Remote"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Input
                  id="timeframe"
                  {...register("timeframe")}
                  placeholder="Next 3 months"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Find Events"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {events.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    {event.attendees} expected attendees
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.open(event.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
