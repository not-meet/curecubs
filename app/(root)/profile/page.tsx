"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export default function CompleteProfile() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    bloodGroup: '',
    sex: '',
    address: '',
    phoneNumber: ''
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const sexOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let bloodGroupEnum;
      switch (formData.bloodGroup) {
        case "O+": bloodGroupEnum = "O_POS"; break;
        case "O-": bloodGroupEnum = "O_NEG"; break;
        case "A+": bloodGroupEnum = "A_POS"; break;
        case "A-": bloodGroupEnum = "A_NEG"; break;
        case "B+": bloodGroupEnum = "B_POS"; break;
        case "B-": bloodGroupEnum = "B_NEG"; break;
        case "AB+": bloodGroupEnum = "AB_POS"; break;
        case "AB-": bloodGroupEnum = "AB_NEG"; break;
        default: bloodGroupEnum = null;
      }
      // Prepare data for API call
      const userData = {
        age: parseInt(formData.age),
        bloodGroup: bloodGroupEnum,
        sex: formData.sex,
        address: formData.address,
        metadata: {
          phoneNumber: formData.phoneNumber
        }
      };

      // Call the API to update user profile
      const response = await fetch(`https://hack-viz-microserver.vercel.app/api/users?clerkId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard or profile page
        router.push('/');
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
      >
        <motion.h1
          className="text-3xl font-bold text-center text-blue-600 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Complete Your Profile
        </motion.h1>

        <motion.p
          className="text-sm text-center text-gray-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Please provide your details to personalize your experience
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-blue-50"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-blue-50"
            >
              <option value="" disabled>Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-blue-50"
            >
              <option value="" disabled>Select Sex</option>
              {sexOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-blue-50"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all bg-blue-50"
              placeholder="e.g., +1 123 456 7890"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-2"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save Profile'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
