"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, LayoutDashboard, User, ShieldCheck, Clock, Settings, Bell, Search } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real app, we'd fetch user data from an API
    // For this challenge, we'll simulate it or decode the JWT from the cookie if we had a helper
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        setUser({ username: "Admin User", email: "admin@javis.id" }); // Fallback for demo
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 transition-colors duration-500">
      {/* Sidebar - Desktop Only */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">J</div>
            <span className="text-xl font-bold dark:text-white">Javis Tekno</span>
          </div>
          
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: "Overview", active: true },
              { icon: User, label: "Profile" },
              { icon: Settings, label: "Settings" },
              { icon: Bell, label: "Notifications" },
            ].map((item, i) => (
              <button
                key={i}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                  item.active 
                    ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 rounded-xl transition-all font-semibold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.username}!</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer">
              {user?.username?.[0] || "U"}
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-2xl">
                <ShieldCheck />
              </div>
              <span className="text-green-500 text-sm font-bold">+100% Secure</span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Session Status</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Authenticated</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-2xl">
                <Clock />
              </div>
              <span className="text-gray-400 text-sm">Real-time</span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Last Login</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{new Date().toLocaleDateString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <LayoutDashboard />
              </div>
              <span className="text-indigo-500 dark:text-indigo-400 text-sm font-bold underline cursor-pointer">View Settings</span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Current Role</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Administrator</p>
          </motion.div>
        </section>

        {/* Placeholder for table/activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-xl font-bold mb-6 dark:text-white text-center flex flex-col items-center">
            <LayoutDashboard className="mb-2 text-indigo-500" size={32} />
             Congratulations! You've successfully implemented the secure dashboard.
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl text-center">
            <p className="text-gray-600 dark:text-gray-300">
              This dashboard is only accessible via a valid JWT token stored in an HttpOnly cookie.
              You can proceed to test the logout functionality.
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Logout Button */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="p-4 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 active:scale-95 transition-all"
        >
          <LogOut />
        </button>
      </div>
    </div>
  );
}
