import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courses, Course, Module as CourseModule } from "@/data/courses";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  instructor: z.string().min(3, { message: "Instructor name must be at least 3 characters" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], { 
    required_error: "Please select a difficulty level"
  }),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.string().refine(value => !isNaN(Number(value)), {
    message: "Price must be a valid number",
  }),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
}

const CreateCourse: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module>({
    id: Date.now().toString(),
    title: "",
    content: "",
    duration: ""
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: user?.name || "Teacher User",
      duration: "",
      level: "Beginner",
      category: "",
      price: "",
      isPublished: false,
    },
  });
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleModuleChange = (field: keyof Module, value: string) => {
    setCurrentModule(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addModule = () => {
    if (!currentModule.title || !currentModule.content || !currentModule.duration) {
      toast.error("Please fill all module fields");
      return;
    }
    
    setModules(prev => [...prev, currentModule]);
    setCurrentModule({
      id: Date.now().toString(),
      title: "",
      content: "",
      duration: ""
    });
  };
  
  const removeModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
  };
  
  const onSubmit = (data: FormValues) => {
    if (modules.length === 0) {
      toast.error("Please add at least one module");
      return;
    }
    
    if (!thumbnailPreview) {
      toast.error("Please upload a course thumbnail");
      return;
    }
    
    const courseModules: CourseModule[] = modules.map(module => ({
      id: module.id,
      title: module.title,
      content: module.content,
      duration: module.duration,
      isCompleted: false
    }));
    
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      duration: data.duration,
      level: data.level,
      category: data.category,
      price: parseFloat(data.price),
      isPublished: data.isPublished,
      modules: courseModules,
      thumbnail: thumbnailPreview,
      enrolledStudents: 0,
      rating: 0,
    };
    
    courses.push(newCourse);
    
    console.log("Course submitted:", newCourse);
    toast.success(`Course "${data.title}" created successfully!`);
    
    form.reset();
    setModules([]);
    setThumbnailPreview(null);
    setCurrentModule({
      id: Date.now().toString(),
      title: "",
      content: "",
      duration: ""
    });
    
    navigate("/admin/courses");
  };
  
  if (!user) return null;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/admin/courses">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Create New Course</h1>
          </div>
          <p className="text-muted-foreground">Add a new course to the platform</p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduction to Web Development" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A comprehensive course on web development..." 
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="instructor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="8 weeks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Development" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="49.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Publish this course
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center">
                    <Label htmlFor="thumbnail" className="mb-2">Course Thumbnail</Label>
                    <div className="relative h-48 w-full rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                      {thumbnailPreview ? (
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click to upload (16:9 ratio recommended)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Course Modules</CardTitle>
              <Button type="button" size="sm" onClick={addModule}>
                <Plus className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="moduleTitle">Module Title</Label>
                      <Input 
                        id="moduleTitle"
                        value={currentModule.title}
                        onChange={(e) => handleModuleChange('title', e.target.value)}
                        placeholder="HTML Basics"
                      />
                    </div>
                    <div>
                      <Label htmlFor="moduleDuration">Duration</Label>
                      <Input 
                        id="moduleDuration"
                        value={currentModule.duration}
                        onChange={(e) => handleModuleChange('duration', e.target.value)}
                        placeholder="1 week"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="moduleContent">Content</Label>
                    <Textarea 
                      id="moduleContent"
                      value={currentModule.content}
                      onChange={(e) => handleModuleChange('content', e.target.value)}
                      placeholder="This module covers the basic structure of HTML documents..."
                      className="min-h-24"
                    />
                  </div>
                </div>
                
                {modules.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-3">Added Modules ({modules.length})</h3>
                    <div className="space-y-3">
                      {modules.map((module, index) => (
                        <div key={module.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <h4 className="font-medium">{index + 1}. {module.title}</h4>
                            <p className="text-sm text-muted-foreground">{module.duration}</p>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeModule(module.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset();
                setModules([]);
                setThumbnailPreview(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourse;
