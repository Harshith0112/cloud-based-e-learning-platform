export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  enrolledStudents: number;
  rating: number;
  modules: Module[];
  category?: string;
  price?: number;
  isPublished?: boolean;
}

export interface Module {
  id: string;
  title: string;
  content: string;
  duration: string;
  isCompleted?: boolean;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript.",
    instructor: "Teacher User",
    duration: "8 weeks",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    enrolledStudents: 120,
    rating: 4.8,
    category: "Web Development",
    price: 49.99,
    isPublished: true,
    modules: [
      {
        id: "1-1",
        title: "HTML Basics",
        content: "This module covers the basic structure of HTML documents, tags, attributes, and semantic HTML.",
        duration: "1 week",
        isCompleted: true
      },
      {
        id: "1-2",
        title: "CSS Fundamentals",
        content: "Learn how to style web pages using CSS, including selectors, properties, and responsive design.",
        duration: "2 weeks",
        isCompleted: false
      },
      {
        id: "1-3",
        title: "JavaScript Essentials",
        content: "Introduction to JavaScript programming, including variables, functions, and DOM manipulation.",
        duration: "3 weeks",
        isCompleted: false
      },
      {
        id: "1-4",
        title: "Building Your First Website",
        content: "Combine your HTML, CSS, and JavaScript skills to build a complete website from scratch.",
        duration: "2 weeks",
        isCompleted: false
      }
    ]
  },
  {
    id: "2",
    title: "Data Science Fundamentals",
    description: "An introduction to data science concepts, tools, and methodologies.",
    instructor: "Teacher User",
    duration: "10 weeks",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGF0YSUyMHNjaWVuY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    enrolledStudents: 85,
    rating: 4.6,
    category: "Data Science",
    price: 59.99,
    isPublished: true,
    modules: [
      {
        id: "2-1",
        title: "Introduction to Python",
        content: "Learn the basics of Python programming language, essential for data science.",
        duration: "2 weeks",
        isCompleted: false
      },
      {
        id: "2-2",
        title: "Data Analysis with Pandas",
        content: "Explore data manipulation and analysis using the Pandas library.",
        duration: "3 weeks",
        isCompleted: false
      },
      {
        id: "2-3",
        title: "Data Visualization",
        content: "Learn to create meaningful visualizations using Matplotlib and Seaborn.",
        duration: "2 weeks",
        isCompleted: false
      },
      {
        id: "2-4",
        title: "Introduction to Machine Learning",
        content: "Understand the basics of machine learning algorithms and their applications.",
        duration: "3 weeks",
        isCompleted: false
      }
    ]
  },
  {
    id: "3",
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native framework.",
    instructor: "Teacher User",
    duration: "12 weeks",
    level: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    enrolledStudents: 65,
    rating: 4.9,
    category: "Mobile Development",
    price: 69.99,
    isPublished: false,
    modules: [
      {
        id: "3-1",
        title: "React Fundamentals",
        content: "Understanding React concepts and JSX syntax.",
        duration: "2 weeks",
        isCompleted: false
      },
      {
        id: "3-2",
        title: "React Native Basics",
        content: "Introduction to React Native components and styling.",
        duration: "3 weeks",
        isCompleted: false
      },
      {
        id: "3-3",
        title: "Navigation and State Management",
        content: "Implementing navigation between screens and managing application state.",
        duration: "3 weeks",
        isCompleted: false
      },
      {
        id: "3-4",
        title: "Building and Deploying Apps",
        content: "Learn to build and deploy your application to app stores.",
        duration: "4 weeks",
        isCompleted: false
      }
    ]
  }
];

// For student dashboard data
export const enrolledCourses = [courses[0], courses[2]];

// For admin dashboard data
export const platformStats = {
  totalStudents: 850,
  totalCourses: 24,
  totalTeachers: 12,
  totalRevenue: "$45,000"
};
