import type React from "react"
import { useState } from "react"
import { useCar, createCarPayload } from "../../api/carManagement"

interface FormData {
  make: string
  model: string
  year: string
  color: string
  license_plate: string
  description: string
  daily_rate: string
  location: string
  latitude: string
  longitude: string
  seats: string
  transmission: string
  fuel_type: string
  auto_approve_bookings: boolean
  features: string[]
  images: File[]
  availability: Array<{
    start_date: string
    end_date: string
  }>
}

const CreateCar: React.FC = () => {
  const { createCar } = useCar()
  const [formData, setFormData] = useState<FormData>({
    make: "",
    model: "",
    year: "",
    color: "",
    license_plate: "",
    description: "",
    daily_rate: "",
    location: "",
    latitude: "",
    longitude: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    auto_approve_bookings: false,
    features: [],
    images: [],
    availability: [],
  })

  const [newFeature, setNewFeature] = useState<string>("")
  const [newAvailability, setNewAvailability] = useState({
    start_date: "",
    end_date: ""
  })

  const transmissions: string[] = ["Manual", "Automatic", "CVT"]
  const fuelTypes: string[] = ["Petrol", "Diesel", "Hybrid", "Electric"]
  const colors: string[] = ["Black", "White", "Silver", "Red", "Blue", "Gray", "Green", "Brown"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleAddFeature = (): void => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (featureToRemove: string): void => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }))
  }

  const handleAddAvailability = (): void => {
    if (newAvailability.start_date && newAvailability.end_date) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, { ...newAvailability }],
      }))
      setNewAvailability({ start_date: "", end_date: "" })
    }
  }

  const handleRemoveAvailability = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }))
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    try {
      // Convert images to base64
      const imagePromises = formData.images.map(async (file, index) => ({
        image: await convertImageToBase64(file),
        is_primary: index === 0, // First image is primary
      }))
      
      const images = await Promise.all(imagePromises)
      
      // Get owner ID from localStorage or context (adjust as needed)
      const ownerData = localStorage.getItem("userData")
      const owner = ownerData ? JSON.parse(ownerData).id : 1
      
      const payload = createCarPayload({
        owner,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        license_plate: formData.license_plate,
        description: formData.description,
        daily_rate: parseFloat(formData.daily_rate),
        location: formData.location,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        seats: parseInt(formData.seats),
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        status: "pending_approval",
        auto_approve_bookings: formData.auto_approve_bookings,
        images,
        features: formData.features.map(name => ({ name })),
        availability: formData.availability,
      })

      await createCar.mutateAsync(payload)
      
      // Reset form after successful submission
      setFormData({
        make: "",
        model: "",
        year: "",
        color: "",
        license_plate: "",
        description: "",
        daily_rate: "",
        location: "",
        latitude: "",
        longitude: "",
        seats: "",
        transmission: "",
        fuel_type: "",
        auto_approve_bookings: false,
        features: [],
        images: [],
        availability: [],
      })
    } catch (error) {
      console.error("Error creating car:", error)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto lg:ml-0 ml-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Car</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Add a new vehicle to your rental fleet</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Toyota"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Corolla"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="2020"
                min="1990"
                max="2025"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., ABC123"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Location */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Pricing & Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($)</label>
              <input
                type="number"
                name="daily_rate"
                value={formData.daily_rate}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="100.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g., Riyadh"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="24.7136"
                step="any"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="46.6753"
                step="any"
                required
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                required
              >
                <option value="">Select Transmission</option>
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>
                    {fuelType}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="5"
                min="2"
                max="8"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                required
              >
                <option value="">Select Color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="auto_approve_bookings"
                checked={formData.auto_approve_bookings}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Auto Approve Bookings</label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Features</h2>
          <div className="space-y-4">
            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                placeholder="Add a feature (e.g., Air Conditioning)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base"
              >
                Add
              </button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-2 text-amber-600 hover:text-amber-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Availability</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={newAvailability.start_date}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={newAvailability.end_date}
                  onChange={(e) => setNewAvailability(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAvailability}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base"
            >
              Add Availability
            </button>
            {formData.availability.length > 0 && (
              <div className="space-y-2">
                {formData.availability.map((period, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm">
                      {period.start_date} to {period.end_date}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailability(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Description</h2>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Describe the car, its condition, and any special notes..."
          />
        </div>

        {/* Images */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Images</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">Click to upload or drag and drop</p>
              <p className="text-xs sm:text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              <input 
                type="file" 
                onChange={handleImageUpload}
                className="hidden" 
                multiple 
                accept="image/*"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 cursor-pointer"
              >
                Select Images
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col xs:flex-row justify-end space-y-2 xs:space-y-0 xs:space-x-4">
          <button
            type="button"
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createCar.isPending}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base disabled:opacity-50"
          >
            {createCar.isPending ? "Adding Car..." : "Add Car"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCar