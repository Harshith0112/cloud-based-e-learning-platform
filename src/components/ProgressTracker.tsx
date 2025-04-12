import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  BarChart2,
} from 'lucide-react';

interface CourseProgress {
  id: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  grade?: number;
}

interface StudentProgress {
  totalCourses: number;
  completedCourses: number;
  averageGrade: number;
  totalHours: number;
  courses: CourseProgress[];
}

const ProgressTracker: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const progress: StudentProgress = {
    totalCourses: 5,
    completedCourses: 2,
    averageGrade: 85,
    totalHours: 45,
    courses: [
      {
        id: '1',
        title: 'Introduction to React',
        totalLessons: 10,
        completedLessons: 8,
        lastAccessed: '2024-04-08T10:30:00',
        grade: 90,
      },
      {
        id: '2',
        title: 'Advanced JavaScript',
        totalLessons: 15,
        completedLessons: 12,
        lastAccessed: '2024-04-07T15:45:00',
        grade: 85,
      },
      {
        id: '3',
        title: 'TypeScript Fundamentals',
        totalLessons: 8,
        completedLessons: 3,
        lastAccessed: '2024-04-06T09:15:00',
      },
    ],
  };

  const calculateProgress = (completed: number, total: number) => {
    return (completed / total) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.completedCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.averageGrade}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress.totalHours}h</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progress.courses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last accessed: {new Date(course.lastAccessed).toLocaleString()}
                    </p>
                  </div>
                  {course.grade && (
                    <div className="text-right">
                      <p className="font-medium">Grade</p>
                      <p className="text-2xl font-bold">{course.grade}%</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </span>
                    <span>
                      {Math.round(
                        calculateProgress(course.completedLessons, course.totalLessons)
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(course.completedLessons, course.totalLessons)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker; 