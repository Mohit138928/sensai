// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import { Loader2, PenTool, Copy } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { generateProfessionalBio } from "@/actions/personal-brand";

// export default function BioWriter() {
//   const [loading, setLoading] = useState(false);
//   const [bios, setBios] = useState(null);
//   const [formData, setFormData] = useState({
//     currentRole: "",
//     yearsOfExperience: "",
//     keyAchievements: "",
//     skillsExpertise: "",
//     certifications: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleGenerate = async () => {
//     if (!formData.currentRole || !formData.yearsOfExperience) {
//       toast.error(
//         "Please enter at least your current role and years of experience"
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       const data = await generateProfessionalBio(formData);
//       console.log("Generated bios:", data); // Debug log
//       setBios(data);
//       toast.success("Professional bios generated successfully!");
//     } catch (error) {
//       console.error("Bio generation error:", error);
//       toast.error(error.message || "Failed to generate bios");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Bio copied to clipboard!");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Input Form */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Professional Bio Generator</CardTitle>
//           <CardDescription>
//             Enter your professional details to generate customized bios
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Current Role</Label>
//                 <Input
//                   name="currentRole"
//                   value={formData.currentRole}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Senior Software Engineer"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Years of Experience</Label>
//                 <Input
//                   name="yearsOfExperience"
//                   type="number"
//                   value={formData.yearsOfExperience}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 5"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Key Achievements</Label>
//               <Textarea
//                 name="keyAchievements"
//                 value={formData.keyAchievements}
//                 onChange={handleInputChange}
//                 placeholder="List your major professional achievements"
//                 className="min-h-[100px]"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Skills & Expertise</Label>
//               <Textarea
//                 name="skillsExpertise"
//                 value={formData.skillsExpertise}
//                 onChange={handleInputChange}
//                 placeholder="List your key skills and areas of expertise"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Certifications (Optional)</Label>
//               <Input
//                 name="certifications"
//                 value={formData.certifications}
//                 onChange={handleInputChange}
//                 placeholder="e.g., AWS Certified, PMP"
//               />
//             </div>

//             <Button
//               onClick={handleGenerate}
//               className="w-full"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Generating Bios...
//                 </>
//               ) : (
//                 <>
//                   <PenTool className="mr-2 h-4 w-4" />
//                   Generate Bios
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Generated Bios Display */}
//       {bios && (
//         <div className="space-y-6">
//           {["short", "medium", "long"].map((length) => (
//             <Card key={length}>
//               <CardHeader>
//                 <CardTitle className="capitalize">
//                   {length} Bio
//                   <span className="text-sm font-normal text-muted-foreground ml-2">
//                     ({bios[length].wordCount} words)
//                   </span>
//                 </CardTitle>
//                 <div className="flex flex-wrap gap-2">
//                   {bios[length].platforms.map((platform, i) => (
//                     <Badge key={i} variant="secondary">
//                       {platform}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <p className="whitespace-pre-wrap">{bios[length].content}</p>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleCopy(bios[length].content)}
//                     className="ml-auto"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
