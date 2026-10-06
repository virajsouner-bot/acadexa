"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "🏠",
    },
     {
  name: "Calendar",
  href: "/calendar",
  icon: "📅",
},
    { name: "Profile", href: "/profile", icon: "👤" },
    {
      name: "Students",
      href: "/students",
      icon: "👨‍🎓",
    },
    {
      name: "Teachers",
      href: "/teacher",
      icon: "👨‍🏫",
    },
    {
      name: "Courses",
      href: "/courses",
      icon: "📚",
    },
    { name: "My Courses",
       href: "/my-courses",
        icon: "🎓" 
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: "📋",
    },
    {
      name: "marks",
      href: "/marks",
      icon: "📊",
    },
    { name: "Grades",
       href: "/grades",
        icon: "🎓"
       },
      
    {
      name: "Fees",
      href: "/fees",
      icon: "💰",
    },
    {
      name: "Enrollments",
      href: "/enrollments",
      icon: "📝",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#17221c] text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">
          Student<span className="text-green-400">Hub</span>
        </h1>

        <p className="text-xs text-gray-400 mt-1">
          Academic Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#16a34a] text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="px-4 pb-5">
        <div className="border-t border-white/10 pt-4">

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
            onClick={() => {
              window.location.href = "/api/auth/logout";
            }}
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>

        </div>
      </div>

    </aside>
  );
}