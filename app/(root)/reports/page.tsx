"use client"
import React, { useState } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MedicalReportsPage = () => {
  const [labReportName, setLabReportName] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get('https://baymax-ui.vercel.app/api/data');
      setSummary(response.data.text);
    } catch (err) {
      setError('Failed to load report summary');
      router.push('/error');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-12">
      <h1 className="text-3xl font-bold text-center mb-6">Let's Check Your Medical Reports</h1>
      <p className="text-center text-gray-600 mb-8">Upload your lab reports and get instant analysis</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - QR code and info */}
        <div className="flex flex-col items-center justify-center bg-blue-50 p-6 rounded-lg">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">Scan QR for Mobile Access</CardTitle>
              <CardDescription>Use your phone to track and submit reports on the go</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-56 h-56 bg-white p-4 rounded-lg flex items-center justify-center">
                <img
                  src="/newqr.png"
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Form */}
        <div className="bg-pink-50 p-6 rounded-lg">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-pink-700">Submit Your Lab Report</CardTitle>
              <CardDescription>Fill in the details below to analyze your report</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="labReportName" className="block text-sm font-medium text-gray-700 mb-1">
                    Lab Report Name
                  </label>
                  <Input
                    id="labReportName"
                    value={labReportName}
                    onChange={(e) => setLabReportName(e.target.value)}
                    className="w-full bg-white"
                    placeholder="e.g., Blood Test, X-Ray, MRI"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Description
                  </label>
                  <Textarea
                    id="problemDescription"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full bg-white"
                    placeholder="Describe your symptoms or concerns"
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Section */}
      {summary && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Report Analysis</h2>
          <p className="text-gray-800">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalReportsPage;
