import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  BarChart2,
  PieChart,
} from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  activeCourses: number;
  averageCompletionRate: number;
  totalHoursWatched: number;
  enrollmentTrend: number[];
  courseDistribution: {
    name: string;
    value: number;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const analyticsData: AnalyticsData = {
    totalStudents: 1250,
    activeStudents: 850,
    totalCourses: 45,
    activeCourses: 30,
    averageCompletionRate: 75,
    totalHoursWatched: 12500,
    enrollmentTrend: [120, 150, 180, 200, 220, 250, 280],
    courseDistribution: [
      { name: 'Web Development', value: 35 },
      { name: 'Data Science', value: 25 },
      { name: 'Mobile Development', value: 20 },
      { name: 'Design', value: 15 },
      { name: 'Business', value: 5 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.activeStudents} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.activeCourses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.averageCompletionRate}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours Watched</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalHoursWatched.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end space-x-2">
              {analyticsData.enrollmentTrend.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(value / 300) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Course Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-64 h-64 relative">
                {analyticsData.courseDistribution.map((category, index) => {
                  const total = analyticsData.courseDistribution.reduce(
                    (sum, item) => sum + item.value,
                    0
                  );
                  const percentage = (category.value / total) * 100;
                  const rotation = analyticsData.courseDistribution
                    .slice(0, index)
                    .reduce((sum, item) => sum + (item.value / total) * 360, 0);

                  return (
                    <div
                      key={category.name}
                      className="absolute inset-0"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + Math.cos((rotation * Math.PI) / 180) * 50
                        }% ${50 + Math.sin((rotation * Math.PI) / 180) * 50}%)`,
                        backgroundColor: `hsl(${
                          (index * 360) / analyticsData.courseDistribution.length
                        }, 70%, 50%)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {analyticsData.courseDistribution.map((category, index) => (
                <div key={category.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: `hsl(${
                        (index * 360) / analyticsData.courseDistribution.length
                      }, 70%, 50%)`,
                    }}
                  />
                  <span className="text-sm">
                    {category.name} ({category.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 