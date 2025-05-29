export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">SDC - Software Development Club</h1>
      <a href="#register" className="text-blue-500 hover:text-blue-700">Register</a>
    </nav>
  );
}