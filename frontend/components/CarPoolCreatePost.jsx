'use client';
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomCardHeader from "./CustomCardHeader";
import CustomCardFooter from "./CustomCardFooter";
import { useRouter } from 'next/navigation';

function CarPool({ community }) {
  const [formData, setFormData] = useState({
    pickup_point: "Bahawalpur",
    dropoff_point: "Siraiki Town",
    pickup_time: "",
    preferred_gender: "male",
    capacity: "1", // Default value
  });
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    console.log(formData);

    // Prepare the data to be sent to the backend
    const formDataToSend = new FormData();
    formDataToSend.append("pickup_point", formData.pickup_point);
    formDataToSend.append("dropoff_point", formData.dropoff_point);
    formDataToSend.append("pickup_time", formData.pickup_time);
    formDataToSend.append("preferred_gender", formData.preferred_gender);
    formDataToSend.append("capacity", formData.capacity); // Include capacity
    formDataToSend.append("community", community);

    // Get the token from localStorage
    const token = localStorage.getItem("accessToken");
    console.log(token);

    // Send the FormData to the backend
    fetch("http://localhost:8000/api/createCarpoolPost", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
      body: formDataToSend, // Send FormData directly as the body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setSuccessMessage("Posted Successfully!"); // Set success message
        // Reset form after successful submission
        setFormData({
          pickup_point: "",
          dropoff_point: "",
          pickup_time: "",
          preferred_gender: "male",
          capacity: "1", 
        });
        setTimeout(() => {
          router.push("/"); // Redirect to the homepage
        }, 2000); 
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CustomCardHeader
          title="Car Pool"
          description="Find a partner for a safe journey!"
        />
        <CardContent className="space-y-2">
          {/* Success Message */}
          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
              {successMessage}
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <div className="space-y-1 w-full">
              <Label htmlFor="pickup_point">Pickup Point</Label>
              <Input
                id="pickup_point"
                value={formData.pickup_point}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1 w-full">
              <Label htmlFor="dropoff_point">Dropoff Point</Label>
              <Input
                id="dropoff_point"
                value={formData.dropoff_point}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="space-y-1 w-full">
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <input
                id="pickup_time"
                type="datetime-local"
                value={formData.pickup_time}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-1 w-full">
              <label
                htmlFor="preferred_gender"
                className="block text-black-300 font-semibold"
              >
                Gender
              </label>
              <select
                id="preferred_gender"
                value={formData.preferred_gender}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-1 w-full">
            <Label htmlFor="capacity">Capacity</Label>
            <select
              id="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </CardContent>
        <CustomCardFooter buttontext="Find Ride Partner" />
      </form>
    </Card>
  );
}

export default CarPool;
