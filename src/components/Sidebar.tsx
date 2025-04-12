
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Book, BookPlus, Calendar, Home, School, Settings, User, UserPlus, Users } from "lucide-react";

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const adminMenuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: School, label: "Teachers", path: "/admin/teachers" },
    { icon: Book, label: "Courses", path: "/admin/courses" },
    { icon: UserPlus, label: "Add User", path: "/admin/add-user" },
    { icon: BookPlus, label: "Create Course", path: "/admin/create-course" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const teacherMenuItems = [
    { icon: Home, label: "Dashboard", path: "/teacher" },
    { icon: Book, label: "My Courses", path: "/teacher/courses" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: Calendar, label: "Schedule", path: "/teacher/schedule" },
  ];

  const studentMenuItems = [
    { icon: Home, label: "Dashboard", path: "/student" },
    { icon: Book, label: "My Courses", path: "/student/courses" },
    { icon: Calendar, label: "Schedule", path: "/student/schedule" },
    { icon: User, label: "Profile", path: "/student/profile" },
  ];

  const getMenuItems = () => {
    switch (user.role) {
      case "admin":
        return adminMenuItems;
      case "teacher":
        return teacherMenuItems;
      case "student":
        return studentMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <SidebarContainer>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path}
                      className={({ isActive }) => 
                        isActive ? "text-sidebar-primary" : "text-sidebar-foreground"
                      }
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
