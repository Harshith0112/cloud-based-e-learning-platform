import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course } from "@/contexts/CourseContext";
import { Clock, Users } from "lucide-react";

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onEnroll?: () => void;
  onUnenroll?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEnrollButton = true,
  onEnroll,
  onUnenroll,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={course.image} 
            alt={course.title} 
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{course.enrolledStudents} students</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {showEnrollButton ? (
          <Button 
            className="w-full" 
            onClick={onEnroll}
            disabled={course.enrolledStudents > 0}
          >
            {course.enrolledStudents > 0 ? "Enrolled" : "Enroll Now"}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="outline"
            onClick={onUnenroll}
          >
            Unenroll
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
