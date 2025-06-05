"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { generateConnectionMessage } from "@/actions/networking";

export default function ConnectionGenerator() {
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setGenerating(true);
      const result = await generateConnectionMessage(data);
      setMessage(result.content);
      toast.success("Message generated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to generate message");
    } finally {
      setGenerating(false);
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
          <CardTitle>Generate Connection Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetName">Person's Name</Label>
              <Input
                id="targetName"
                {...register("targetName", { required: true })}
                placeholder="Enter their name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetTitle">Job Title</Label>
              <Input
                id="targetTitle"
                {...register("targetTitle", { required: true })}
                placeholder="Enter their job title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCompany">Company</Label>
              <Input
                id="targetCompany"
                {...register("targetCompany", { required: true })}
                placeholder="Enter their company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Textarea
                id="context"
                {...register("context")}
                placeholder="How did you find them? Any mutual connections?"
              />
            </div>

            <Button type="submit" disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Generated Message
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
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
