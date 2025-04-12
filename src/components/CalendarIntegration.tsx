import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  BookOpen,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'exam';
  startTime: string;
  endTime: string;
  course: string;
  description?: string;
}

const CalendarIntegration: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'React Fundamentals Class',
      type: 'class',
      startTime: '2024-04-08T10:00:00',
      endTime: '2024-04-08T12:00:00',
      course: 'Introduction to React',
    },
    {
      id: '2',
      title: 'JavaScript Assignment Due',
      type: 'assignment',
      startTime: '2024-04-10T23:59:59',
      endTime: '2024-04-10T23:59:59',
      course: 'Advanced JavaScript',
      description: 'Complete the final project submission',
    },
    {
      id: '3',
      title: 'TypeScript Midterm Exam',
      type: 'exam',
      startTime: '2024-04-12T09:00:00',
      endTime: '2024-04-12T11:00:00',
      course: 'TypeScript Fundamentals',
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  const getEventsForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'class':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'assignment':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'exam':
        return <Clock className="h-4 w-4 text-red-500" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (direction === 'prev' ? -1 : 1),
        1
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-sm text-gray-500"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDay(day);
              return (
                <div
                  key={day}
                  className="border rounded-lg p-2 h-24 overflow-y-auto"
                >
                  <div className="font-medium text-sm mb-1">{day}</div>
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-gray-100 dark:bg-gray-800 mb-1"
                    >
                      <div className="flex items-center">
                        {getEventIcon(event.type)}
                        <span className="ml-1 truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .sort(
                (a, b) =>
                  new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.course}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startTime).toLocaleString()}
                    </p>
                    {event.description && (
                      <p className="text-sm mt-2">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration; 