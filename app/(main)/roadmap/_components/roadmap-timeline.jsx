"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Award, TrendingUp } from "lucide-react";

export default function RoadmapTimeline({ data }) {
  const [selectedYear, setSelectedYear] = useState(null);
  
  // Ensure we're accessing the timeline array correctly and handle empty states
  const timelineData = data?.timeline || [];

  // Check if timelineData is an array before mapping
  if (!Array.isArray(timelineData)) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No roadmap data available. Please try generating a new roadmap.
        </p>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20" />

      <div className="space-y-16">
        {timelineData.map((year, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}
          >
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full" />

            <Card className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? "ml-auto" : "mr-auto"} cursor-pointer transition-all hover:scale-105`}
                 onClick={() => setSelectedYear(selectedYear === year.year ? null : year.year)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span>Year {year.year}</span>
                  <Badge variant="outline">{year.role}</Badge>
                </CardTitle>
              </CardHeader>
              
              {selectedYear === year.year && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Salary Range</span>
                    </div>
                    <p className="text-muted-foreground">
                      ${year.salaryRange.min.toLocaleString()} - ${year.salaryRange.max.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <ScrollText className="h-4 w-4" />
                      <span className="font-medium">Skills to Acquire</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {year.skillsToAcquire.map((skill, i) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Recommended Certifications</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {year.certifications.map((cert, i) => (
                        <li key={i}>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {cert.name}
                          </a>
                          <span className="text-muted-foreground"> - {cert.provider}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}