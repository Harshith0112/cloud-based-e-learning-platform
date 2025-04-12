import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Clock,
  User,
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
}

interface Thread {
  id: string;
  title: string;
  author: string;
  content: string;
  timestamp: string;
  comments: Comment[];
}

const DiscussionForum: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
  });
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleCreateThread = () => {
    if (newThread.title && newThread.content) {
      const thread: Thread = {
        id: Date.now().toString(),
        title: newThread.title,
        author: 'Current User', // Replace with actual user
        content: newThread.content,
        timestamp: new Date().toISOString(),
        comments: [],
      };
      setThreads([...threads, thread]);
      setNewThread({ title: '', content: '' });
    }
  };

  const handleAddComment = (threadId: string) => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User', // Replace with actual user
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };

      setThreads(
        threads.map((thread) =>
          thread.id === threadId
            ? { ...thread, comments: [...thread.comments, comment] }
            : thread
        )
      );
      setNewComment('');
    }
  };

  const handleVote = (threadId: string, commentId: string, type: 'like' | 'dislike') => {
    setThreads(
      threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              comments: thread.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: type === 'like' ? comment.likes + 1 : comment.likes,
                      dislikes:
                        type === 'dislike' ? comment.dislikes + 1 : comment.dislikes,
                    }
                  : comment
              ),
            }
          : thread
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Create New Thread
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Thread Title"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            />
            <Textarea
              placeholder="Thread Content"
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              className="min-h-[100px]"
            />
            <Button onClick={handleCreateThread}>Create Thread</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {threads.map((thread) => (
          <Card key={thread.id}>
            <CardHeader>
              <CardTitle>{thread.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <User className="mr-1 h-4 w-4" />
                {thread.author}
                <Clock className="ml-4 mr-1 h-4 w-4" />
                {new Date(thread.timestamp).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{thread.content}</p>
              <div className="space-y-4">
                {thread.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="mr-1 h-4 w-4" />
                      {comment.author}
                      <Clock className="ml-4 mr-1 h-4 w-4" />
                      {new Date(comment.timestamp).toLocaleString()}
                    </div>
                    <p className="mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(thread.id, comment.id, 'like')}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(thread.id, comment.id, 'dislike')}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        {comment.dislikes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex space-x-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleAddComment(thread.id)}
                    className="self-end"
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum; 