"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Clock, MessageSquare, Loader2, Send } from "lucide-react";
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
import { generateFollowUpMessage } from "@/actions/networking";

export default function FollowUpManager() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await generateFollowUpMessage(data);
      setMessage(result.content);
      toast.success("Follow-up message generated!");
    } catch (error) {
      toast.error("Failed to generate follow-up message");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Follow-up Message</CardTitle>
          <CardDescription>
            Create personalized follow-up messages for your connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                {...register("contactName", { required: true })}
                placeholder="Enter contact's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastInteraction">Last Interaction</Label>
              <Select {...register("lastInteraction")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="event">Networking Event</SelectItem>
                  <SelectItem value="message">LinkedIn Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Follow-up Purpose</Label>
              <Textarea
                id="purpose"
                {...register("purpose")}
                placeholder="What would you like to follow up about?"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Generated Follow-up
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
