import { Link } from "react-router-dom";
import { Users, Settings } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Link
        to="/admin/teachers"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Users className="h-4 w-4" />
        Teachers
      </Link>
      <Link
        to="/admin/settings"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </div>
  );
};

export default AdminSidebar; 