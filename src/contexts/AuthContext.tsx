import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, CognitoUser } from '@/lib/api';

// Define user types
export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  department?: string;
  coursesCount?: number;
  joinDate: string;
  avatar?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
}

// Add password to the interface for user creation
export interface UserWithPassword extends Omit<User, "id"> {
  password: string;
}

// Define the context shape
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  addUser: (newUser: UserWithPassword) => string;
  getAllUsers: () => User[];
  updateUserStatus: (userId: string, status: "Active" | "Inactive") => void;
  updateUserDepartment: (userId: string, department: string) => void;
  deleteUser: (userId: string) => void;
  getPlatformStats: () => {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalRevenue: string;
  };
  signup: (email: string, password: string, firstName: string, lastName: string, role: string) => Promise<void>;
}

// Hardcoded users for demonstration purposes
const initialUsers: Record<string, { password: string; userInfo: User }> = {
  "admin@eduverse.com": {
    password: "admin123",
    userInfo: {
      id: "1",
      name: "Admin User",
      email: "admin@eduverse.com",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff",
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    },
  },
  "sarah.johnson@eduverse.com": {
    password: "teacher123",
    userInfo: {
      id: "2",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@eduverse.com",
      role: "teacher",
      department: "Computer Science",
      coursesCount: 3,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=2F855A&color=fff",
      status: "Active",
      joinDate: "2024-09-15",
    },
  },
  "james.wilson@eduverse.com": {
    password: "teacher123",
    userInfo: {
      id: "3",
      name: "Prof. James Wilson",
      email: "james.wilson@eduverse.com",
      role: "teacher",
      department: "Mathematics",
      coursesCount: 2,
      avatar: "https://ui-avatars.com/api/?name=James+Wilson&background=4F46E5&color=fff",
      status: "Active",
      joinDate: "2024-10-10",
    },
  },
  "michael.brown@eduverse.com": {
    password: "teacher123",
    userInfo: {
      id: "4",
      name: "Dr. Michael Brown",
      email: "michael.brown@eduverse.com",
      role: "teacher",
      department: "Computer Science",
      coursesCount: 4,
      avatar: "https://ui-avatars.com/api/?name=Michael+Brown&background=9333EA&color=fff",
      status: "Active",
      joinDate: "2024-11-05",
    },
  },
  "emily.chen@eduverse.com": {
    password: "teacher123",
    userInfo: {
      id: "5",
      name: "Prof. Emily Chen",
      email: "emily.chen@eduverse.com",
      role: "teacher",
      department: "Design",
      coursesCount: 2,
      avatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=EC4899&color=fff",
      status: "Active",
      joinDate: "2025-01-20",
    },
  },
  "robert.davis@eduverse.com": {
    password: "teacher123",
    userInfo: {
      id: "6",
      name: "Dr. Robert Davis",
      email: "robert.davis@eduverse.com",
      role: "teacher",
      department: "Engineering",
      coursesCount: 3,
      avatar: "https://ui-avatars.com/api/?name=Robert+Davis&background=D97706&color=fff",
      status: "Inactive",
      joinDate: "2025-02-10",
    },
  },
  "student@eduverse.com": {
    password: "student123",
    userInfo: {
      id: "7",
      name: "Student User",
      email: "student@eduverse.com",
      role: "student",
      avatar: "https://ui-avatars.com/api/?name=Student+User&background=6B46C1&color=fff",
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    },
  },
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Record<string, { password: string; userInfo: User }>>(
    () => {
      const storedUsers = localStorage.getItem("allUsers");
      return storedUsers ? JSON.parse(storedUsers) : initialUsers;
    }
  );

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  }, [users]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      await checkAuth();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    auth.logout();
    setUser(null);
  };
  
  // Add new user function - updated to use UserWithPassword
  const addUser = (newUserData: UserWithPassword): string => {
    const id = (Object.keys(users).length + 1).toString();
    
    // Create the full name from first and last name
    const fullName = `${newUserData.firstName} ${newUserData.lastName}`;
    
    // Generate avatar if not provided
    const avatar = newUserData.avatar || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`;
    
    const userInfo: User = {
      id,
      name: fullName,
      email: newUserData.email,
      role: newUserData.role,
      avatar,
      bio: newUserData.bio || "",
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active",
    };
    
    // Create a new user record with password
    const newUserRecord = {
      password: newUserData.password,
      userInfo,
    };
    
    // Update the users state with the new user
    const updatedUsers = {
      ...users,
      [newUserData.email.toLowerCase()]: newUserRecord,
    };
    
    setUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    
    return id;
  };
  
  // Get all users
  const getAllUsers = (): User[] => {
    return Object.values(users).map(u => u.userInfo);
  };

  // Update user status
  const updateUserStatus = (userId: string, status: "Active" | "Inactive") => {
    const updatedUsers = { ...users };
    let userFound = false;
    
    for (const email in updatedUsers) {
      if (updatedUsers[email].userInfo.id === userId) {
        updatedUsers[email].userInfo.status = status;
        userFound = true;
        
        // Update current user if it's the same user
        if (user?.id === userId) {
          const updatedUser = { ...user, status };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        break;
      }
    }
    
    if (userFound) {
      setUsers(updatedUsers);
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    }
  };

  // Update user department
  const updateUserDepartment = (userId: string, department: string) => {
    const updatedUsers = { ...users };
    let userFound = false;
    
    for (const email in updatedUsers) {
      if (updatedUsers[email].userInfo.id === userId) {
        updatedUsers[email].userInfo.department = department;
        userFound = true;
        
        // Update current user if it's the same user
        if (user?.id === userId) {
          const updatedUser = { ...user, department };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        break;
      }
    }
    
    if (userFound) {
      setUsers(updatedUsers);
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = { ...users };
    for (const email in updatedUsers) {
      if (updatedUsers[email].userInfo.id === userId) {
        delete updatedUsers[email];
        break;
      }
    }
    setUsers(updatedUsers);
  };

  // Get platform statistics
  const getPlatformStats = () => {
    const allUsers = getAllUsers();
    const students = allUsers.filter(u => u.role === "student");
    const teachers = allUsers.filter(u => u.role === "teacher");
    
    // Calculate total revenue (assuming each course costs $100)
    const totalRevenue = teachers.reduce((sum, teacher) => {
      return sum + (teacher.coursesCount || 0) * 100;
    }, 0);
    
    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalCourses: teachers.reduce((sum, teacher) => sum + (teacher.coursesCount || 0), 0),
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
    };
  };

  const checkAuth = async () => {
    try {
      const cognitoUser = await auth.getCurrentUser() as CognitoUser;
      if (cognitoUser) {
        setUser({
          id: cognitoUser.email,
          name: `${cognitoUser.firstName} ${cognitoUser.lastName}`,
          email: cognitoUser.email,
          firstName: cognitoUser.firstName,
          lastName: cognitoUser.lastName,
          role: cognitoUser.role as UserRole,
          status: 'Active',
          joinDate: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, role: string) => {
    try {
      await auth.signUp(email, password, firstName, lastName, role);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        addUser,
        getAllUsers,
        updateUserStatus,
        updateUserDepartment,
        deleteUser,
        getPlatformStats,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
