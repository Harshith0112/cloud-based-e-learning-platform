
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "@/data/courses";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, Users } from "lucide-react";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Calculate completion percentage
  const completedModules = course.modules.filter(m => m.isCompleted).length;
  const progressPercentage = Math.round((completedModules / course.modules.length) * 100);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-1 mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
              <Badge variant="outline">
                {course.duration}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">
              By {course.instructor}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{course.enrolledStudents} students enrolled</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
            </div>
            {user?.role === "student" && (
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {progressPercentage}% Complete
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              {user?.role === "teacher" && (
                <TabsTrigger value="students">Students</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{course.description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Understand the core principles of the subject</li>
                    <li>Apply learned concepts to real-world scenarios</li>
                    <li>Develop practical skills through hands-on projects</li>
                    <li>Master advanced techniques through guided practice</li>
                    <li>Build a portfolio of work to demonstrate your expertise</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="modules" className="space-y-4">
              {course.modules.map((module) => (
                <Card key={module.id} className={activeModule === module.id ? "border-primary" : ""}>
                  <CardHeader className="cursor-pointer" onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {module.title}
                          {module.isCompleted && (
                            <Badge className="ml-2 bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{module.duration}</CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        {activeModule === module.id ? "Hide" : "View"}
                      </Button>
                    </div>
                  </CardHeader>
                  {activeModule === module.id && (
                    <CardContent>
                      <div className="space-y-4">
                        <p>{module.content}</p>
                        {user?.role === "student" && (
                          <Button>
                            {module.isCompleted ? "Revisit Module" : "Mark as Complete"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>

            {user?.role === "teacher" && (
              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Students</CardTitle>
                    <CardDescription>
                      {course.enrolledStudents} students enrolled in this course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Progress</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Dummy student data for demonstration */}
                          {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td className="px-4 py-3">Student {i + 1}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                student{i + 1}@example.com
                              </td>
                              <td className="px-4 py-3">
                                <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
                              </td>
                              <td className="px-4 py-3">
                                <Button variant="outline" size="sm">View Details</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="w-full md:w-1/3">
          <Card className="sticky top-24">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">Rating:</span>
                  <span className="text-2xl">{course.rating}/5</span>
                </div>
                
                {user?.role === "student" && (
                  <Button className="w-full">
                    {course.modules.some(m => m.isCompleted) ? "Continue Learning" : "Start Learning"}
                  </Button>
                )}
                
                {user?.role === "teacher" && (
                  <div className="space-y-2">
                    <Button className="w-full">Edit Course</Button>
                    <Button variant="outline" className="w-full">Manage Students</Button>
                  </div>
                )}
                
                {user?.role === "admin" && (
                  <div className="space-y-2">
                    <Button className="w-full">Edit Course</Button>
                    <Button variant="destructive" className="w-full">Remove Course</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
