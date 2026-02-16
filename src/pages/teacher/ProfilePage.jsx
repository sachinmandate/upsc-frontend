import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardContent className="py-8">
          <div className="flex items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">YB</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">Yashwant Bhosale</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">Senior Teacher — Department of Computer Science</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  yashwant.b@example.com
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  +91 98765 43210
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  Pune, Maharashtra
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Joined March 2024
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Badge variant="warning">Not enabled</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates about student activity</p>
              </div>
            </div>
            <Badge variant="success">Enabled</Badge>
          </div>
          <div className="pt-2">
            <Button variant="secondary">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;