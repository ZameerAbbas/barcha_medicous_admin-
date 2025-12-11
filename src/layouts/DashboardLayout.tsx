import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="bg-white shadow-md sticky top-0 z-20">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">
          <div className="bg-white rounded-2xl shadow p-6 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
