import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">Easy Forms</h1>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/forms" className="hover:underline">
            Forms
          </Link>
          <Link href="/themes" className="hover:underline">
            Themes
          </Link>
          <Link href="/add-ons" className="hover:underline">
            Add-ons
          </Link>
          <Link href="/users" className="hover:underline">
            Users
          </Link>
        </nav>
        <div>
          <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
            Admin
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Dashboard - Today Summary</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-4 shadow rounded text-center">
            <h3 className="text-blue-600 font-bold text-3xl">1</h3>
            <p className="text-gray-600 mt-2">Unique Users</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <h3 className="text-blue-600 font-bold text-3xl">5</h3>
            <p className="text-gray-600 mt-2">Submissions</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <h3 className="text-purple-600 font-bold text-3xl">500%</h3>
            <p className="text-gray-600 mt-2">Submission Rate</p>
          </div>
          <div className="bg-green-500 p-4 shadow rounded text-center text-white">
            <Link href="/form-builder">
              <button className="font-bold text-lg">+ CREATE FORM</button>
            </Link>
          </div>
        </div>

        {/* Most Viewed/Submitted Section */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-gray-800 font-bold">Most Viewed</h3>
            <p className="text-gray-600 mt-2">Bug Tracker</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-gray-800 font-bold">Most Submitted</h3>
            <p className="text-gray-600 mt-2">Bug Tracker</p>
          </div>
          <div className="bg-white p-4 shadow rounded">
            <h3 className="text-gray-800 font-bold">Last Updated</h3>
            <ul className="text-gray-600 mt-2">
              <li>Bug Tracker - 4 minutes ago</li>
              <li>Simple Contact Form - 6 minutes ago</li>
              <li>Trivia Quiz - 6 minutes ago</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
