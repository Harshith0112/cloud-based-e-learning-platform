import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const StudentSchedule: React.FC = () => {
  // Dummy data for schedule
  const scheduleData = [
    {
      id: "1",
      title: "Introduction to Web Development",
      day: "Monday",
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      courseId: "1",
      instructor: "John Doe"
    },
    {
      id: "2",
      title: "Mobile App Development",
      day: "Wednesday",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      courseId: "2",
      instructor: "Jane Smith"
    }
  ];

  // Dummy data for deadlines
  const deadlines = [
    {
      id: "1",
      title: "Web Development Assignment 1",
      dueDate: "2024-03-15",
      courseId: "1"
    },
    {
      id: "2",
      title: "Mobile App Project Proposal",
      dueDate: "2024-03-20",
      courseId: "2"
    }
  ];

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get scheduled class for a specific day and time
  const getScheduledClass = (day: string, time: string) => {
    return scheduleData.find(
      classItem => classItem.day === day && classItem.startTime === time
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">View your class schedule and upcoming deadlines</p>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-4 text-left">Time</th>
                    {days.map(day => (
                      <th key={day} className="p-4 text-left">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time}>
                      <td className="p-4 border-t">{time}</td>
                      {days.map(day => {
                        const classItem = getScheduledClass(day, time);
                        return (
                          <td key={`${day}-${time}`} className="p-4 border-t">
                            {classItem ? (
                              <div className="bg-brand-blue/10 p-2 rounded">
                                <div className="font-medium">{classItem.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {classItem.instructor}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deadlines.map(deadline => (
            <Card key={deadline.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{deadline.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(deadline.dueDate)}
                    </div>
                  </div>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
