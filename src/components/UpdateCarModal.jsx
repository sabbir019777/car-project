import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { getAuth } from "firebase/auth";

const UpdateCarModal = ({ car, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: car.name || "",
    category: car.category || "",
    price: car.price || "",
    status: car.status || "available",
    location: car.location || "",
    imageUrl: car.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      // Firebase user

      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("User not logged in. Please login first.");
        setLoading(false);
        return;
      }

      //  Firebase ID token

      const accessToken = await currentUser.getIdToken();

      // Update request

      const response = await fetch(
        `https://car-rental-plantform.vercel.app/api/cars/${car._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // 🔹
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update car");
      }

      toast.success(" Car updated successfully!");

      onSubmit({ ...formData, _id: car._id, providerEmail: car.providerEmail });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900/95 border-2 border-cyan-500/50 rounded-xl p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/20 transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 font-bold text-2xl hover:text-red-500 transition-colors"
        >
          &times;
        </button>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 border-b border-gray-700/50 pb-2">
          {" "}
          Update Vehicle{" "}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Car Name"
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price per day"
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
          />
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder-gray-500"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          >
            <option value="available">Availables</option>
            <option value="booked">Booked</option>
          </select>

          <input
            type="text"
            value={`Provider: ${car.providerEmail}`}
            readOnly
            className="p-3 rounded bg-gray-700 text-cyan-300/80 border border-gray-600 cursor-not-allowed text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? "Processing..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarModal;
