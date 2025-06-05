"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { startNegotiation, sendMessage } from "@/actions/negotiation";

export default function NegotiationSimulator() {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [simulation?.messages]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!simulation) {
        const newSimulation = await startNegotiation(data.role);
        setSimulation(newSimulation);
      } else {
        const updatedSimulation = await sendMessage(
          simulation.id,
          data.message
        );
        setSimulation(updatedSimulation);
      }
      reset();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!simulation ? (
        <Card>
          <CardHeader>
            <CardTitle>Start Negotiation Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Title</label>
                <Input
                  {...register("role")}
                  placeholder="Enter the position you're negotiating for"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Negotiation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {simulation.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "candidate" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "candidate"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {simulation.feedback && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-sm">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{simulation.feedback}</p>
              </CardContent>
            </Card>
          )}

          {simulation.status !== "completed" && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <Input
                {...register("message")}
                placeholder="Type your response..."
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
