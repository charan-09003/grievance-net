import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    urgency: "medium",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/api/submit_complaint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message);

    setFormData({
      name: "",
      email: "",
      location: "",
      urgency: "medium",
      description: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-8">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-white/40">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">
          🌟 Submit Your Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-2 border-pink-400 rounded-xl px-4 py-3 text-gray-800 focus:border-pink-600 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-2 border-yellow-400 rounded-xl px-4 py-3 text-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border-2 border-purple-400 rounded-xl px-4 py-3 text-gray-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              placeholder="Enter your location"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full border-2 border-indigo-400 rounded-xl px-4 py-3 text-gray-800 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border-2 border-green-400 rounded-xl px-4 py-3 text-gray-800 focus:border-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none"
              placeholder="Describe your issue..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 hover:from-pink-600 hover:via-yellow-500 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
