"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { updateUser } from "@/actions/user";

export default function ProfileUpdateForm({ user, industries, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      industry: user.industry?.split("-")[0],
      subIndustry: user.industry?.split("-")[1]?.replace(/-/g, " "),
      experience: user.experience,
      bio: user.bio,
      skills: user.skills?.join(", "),
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedIndustry = `${data.industry}-${data.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUser({
        ...data,
        industry: formattedIndustry,
        skills: data.skills.split(",").map((skill) => skill.trim()),
      });

      toast.success("Profile updated successfully!");
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Industry</Label>
          <Select
            onValueChange={(value) => setValue("industry", value)}
            defaultValue={user.industry?.split("-")[0]}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.id} value={ind.id}>
                  {ind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Years of Experience</Label>
          <Input type="number" {...register("experience")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Professional Bio</Label>
        <Textarea
          {...register("bio")}
          placeholder="Brief description of your professional background"
        />
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <Textarea
          {...register("skills")}
          placeholder="Enter your skills (comma separated)"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Profile"
        )}
      </Button>
    </form>
  );
}
