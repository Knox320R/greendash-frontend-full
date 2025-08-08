import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaTools, 
  FaClock, 
  FaRocket, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowUp,
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Maintenance = () => {
  // You can customize these values based on your maintenance schedule
  const maintenanceInfo = {
    startTime: new Date('2025-08-08T10:00:00Z'),
    estimatedEndTime: new Date('2025-08-09T18:00:00Z'),
    currentTime: new Date(),
    reason: 'Platform Upgrade & Security Enhancement',
    features: [
      'Enhanced Security Protocols',
      'Improved Performance',
      'New Staking Features',
      'Better User Interface',
      'Advanced Analytics Dashboard',
      'Mobile App Optimization'
    ],
    progress: 45, // Percentage of maintenance completed
    status: 'in-progress' // 'scheduled', 'in-progress', 'completed'
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = maintenanceInfo.estimatedEndTime;
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return { hours: 0, minutes: 0 };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  const getStatusInfo = () => {
    switch (maintenanceInfo.status) {
      case 'scheduled':
        return {
          icon: <FaClock className="w-6 h-6 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800',
          title: 'Maintenance Scheduled',
          description: 'We\'re preparing for a scheduled maintenance window.'
        };
      case 'in-progress':
        return {
          icon: <FaTools className="w-6 h-6 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800',
          title: 'Maintenance in Progress',
          description: 'We\'re currently updating our platform to serve you better.'
        };
      case 'completed':
        return {
          icon: <FaCheckCircle className="w-6 h-6 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          title: 'Maintenance Completed',
          description: 'Updates have been successfully completed!'
        };
      default:
        return {
          icon: <FaExclamationTriangle className="w-6 h-6 text-red-500" />,
          color: 'bg-red-100 text-red-800',
          title: 'Maintenance Status',
          description: 'Platform maintenance is currently active.'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <FaRocket className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <FaCog className="w-4 h-4 text-white animate-spin" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Platform Update in Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're working hard to bring you an even better GreenDash experience. 
            Please check back soon!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Status Card */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {statusInfo.icon}
                {statusInfo.title}
              </CardTitle>
              <CardDescription>{statusInfo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold text-green-600">{maintenanceInfo.progress}%</span>
                </div>
                <Progress value={maintenanceInfo.progress} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Started</p>
                    <p className="font-semibold">
                      {maintenanceInfo.startTime.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated End</p>
                    <p className="font-semibold">
                      {maintenanceInfo.estimatedEndTime.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Remaining Card */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaClock className="w-5 h-5 text-blue-500" />
                Estimated Time Remaining
              </CardTitle>
              <CardDescription>Approximate time until completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {timeRemaining.hours}h {timeRemaining.minutes}m
                </div>
                <p className="text-sm text-gray-500">
                  This is an estimate and may vary
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* What's New Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaArrowUp className="w-5 h-5 text-green-500" />
                What's Coming
              </CardTitle>
              <CardDescription>New features and improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {maintenanceInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShieldAlt className="w-5 h-5 text-purple-500" />
                Stay Connected
              </CardTitle>
              <CardDescription>Get updates and support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">For Urgent Support</h4>
                  <p className="text-sm text-purple-700">
                    If you have an urgent matter, please contact our support team via email or social media.
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-blue-600">support@greendash.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Telegram:</span>
                    <span className="text-blue-600">@GreenDashSupport</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Thank you for your patience. We're committed to providing you with the best possible experience.
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              GreenDash Team
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance; 