
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courses } from "@/data/courses";
import { Book, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // For this demo, we'll assume all courses are taught by the teacher
  const teacherCourses = courses;

  // Calculate total students
  const totalStudents = teacherCourses.reduce(
    (sum, course) => sum + course.enrolledStudents, 
    0
  );

  // Dummy recent activities for demonstration
  const recentActivities = [
    { 
      id: 1, 
      activity: "John Smith submitted an assignment", 
      time: "2 hours ago",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=4F46E5&color=fff" 
    },
    { 
      id: 2, 
      activity: "You graded 15 assignments", 
      time: "Yesterday",
      avatar: user?.avatar 
    },
    { 
      id: 3, 
      activity: "Sarah Johnson asked a question", 
      time: "Yesterday",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=EC4899&color=fff" 
    },
    { 
      id: 4, 
      activity: "You updated course materials", 
      time: "2 days ago",
      avatar: user?.avatar
    },
  ];

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Manage your courses and students</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{teacherCourses.length}</div>
              <Book className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalStudents}</div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assignments to Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherCourses.slice(0, 3).map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.enrolledStudents} students
                    </span>
                  </div>
                  <Progress 
                    value={course.enrolledStudents / 2} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>
                      {activity.activity.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
