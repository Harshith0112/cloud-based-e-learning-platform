
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock student data
const studentsData = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    coursesEnrolled: 3,
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=4F46E5&color=fff",
    progress: 75,
  },
  {
    id: "2",
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    coursesEnrolled: 2,
    avatar: "https://ui-avatars.com/api/?name=Samantha+Lee&background=EC4899&color=fff",
    progress: 90,
  },
  {
    id: "3",
    name: "David Kim",
    email: "david.kim@example.com",
    coursesEnrolled: 1,
    avatar: "https://ui-avatars.com/api/?name=David+Kim&background=2F855A&color=fff",
    progress: 60,
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    coursesEnrolled: 3,
    avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=D97706&color=fff",
    progress: 85,
  },
  {
    id: "5",
    name: "John Smith",
    email: "john.smith@example.com",
    coursesEnrolled: 2,
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=9333EA&color=fff",
    progress: 45,
  },
];

const TeacherStudents: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter students based on search term
  const filteredStudents = studentsData.filter(
    student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewStudent = (studentId: string) => {
    // In a real app, you would navigate to the student detail page
    toast.info("Viewing student details");
  };
  
  const handleSendReminder = (studentId: string) => {
    // In a real app, you would send a reminder to the student
    toast.success("Reminder sent successfully");
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-muted-foreground">Manage and track student progress</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search students..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Courses Enrolled</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.coursesEnrolled}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewStudent(student.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(student.id)}
                      >
                        Send Reminder
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherStudents;
