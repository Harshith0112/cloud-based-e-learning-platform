import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";

const StudentCourses: React.FC = () => {
  // Dummy data for enrolled courses
  const enrolledCourses = [
    {
      id: "1",
      title: "Introduction to Web Development",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      instructor: "John Doe",
      duration: "8 weeks",
      level: "Beginner",
      students: 50,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      enrolledStudents: ["1"]
    },
    {
      id: "2",
      title: "Mobile App Development with React Native",
      description: "Build cross-platform mobile apps using React Native",
      instructor: "Jane Smith",
      duration: "12 weeks",
      level: "Intermediate",
      students: 30,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      enrolledStudents: ["1"]
    }
  ];

  // Dummy data for available courses
  const availableCourses = [
    {
      id: "3",
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis and visualization",
      instructor: "Mike Johnson",
      duration: "10 weeks",
      level: "Intermediate",
      students: 40,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      enrolledStudents: []
    },
    {
      id: "4",
      title: "UI/UX Design Principles",
      description: "Learn the fundamentals of user interface and experience design",
      instructor: "Sarah Wilson",
      duration: "6 weeks",
      level: "Beginner",
      students: 25,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      enrolledStudents: []
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Browse and manage your courses</p>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} showEnrollButton={false} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
              <Button variant="outline" className="mt-4">
                Browse Available Courses
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        {availableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <CourseCard key={course.id} course={course} showEnrollButton={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No available courses found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
