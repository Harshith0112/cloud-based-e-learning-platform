import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Calendar, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CourseCard from "@/components/CourseCard";

const StudentDashboard: React.FC = () => {
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

  // Dummy data for statistics
  const stats = {
    enrolledCourses: enrolledCourses.length,
    hoursSpentLearning: enrolledCourses.length * 2.5,
    upcomingDeadlines: enrolledCourses.length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Student!</h1>
        <p className="text-muted-foreground">Here's an overview of your learning progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
              <Book className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hours Spent Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.hoursSpentLearning}</div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Learning Progress</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-sm text-muted-foreground">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} showEnrollButton={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
