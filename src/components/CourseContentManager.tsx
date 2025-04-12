import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, FileText, Video, BookOpen } from 'lucide-react';

interface CourseContent {
  id: string;
  type: 'video' | 'document' | 'quiz';
  title: string;
  description: string;
  url?: string;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const CourseContentManager: React.FC = () => {
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [newContent, setNewContent] = useState<Partial<CourseContent>>({
    type: 'video',
    title: '',
    description: '',
  });

  const handleAddContent = () => {
    if (newContent.title && newContent.description) {
      const content: CourseContent = {
        id: Date.now().toString(),
        type: newContent.type as 'video' | 'document' | 'quiz',
        title: newContent.title,
        description: newContent.description,
      };
      setContents([...contents, content]);
      setNewContent({ type: 'video', title: '', description: '' });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File uploaded:', file);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <select
                value={newContent.type}
                onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                className="p-2 border rounded"
              >
                <option value="video">Video</option>
                <option value="document">Document</option>
                <option value="quiz">Quiz</option>
              </select>
              <Input
                placeholder="Title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Description"
              value={newContent.description}
              onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
            />
            <Button onClick={handleAddContent}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {contents.map((content) => (
            <Card key={content.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {content.type === 'video' && <Video className="mr-2 h-4 w-4" />}
                  {content.type === 'document' && <FileText className="mr-2 h-4 w-4" />}
                  {content.type === 'quiz' && <BookOpen className="mr-2 h-4 w-4" />}
                  {content.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{content.description}</p>
                {content.type === 'video' && (
                  <div className="mt-4">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="w-full"
                    />
                  </div>
                )}
                {content.type === 'document' && (
                  <div className="mt-4">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseContentManager; 