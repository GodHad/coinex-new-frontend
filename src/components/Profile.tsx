'use client';
import React, { useContext, useState } from 'react';
import { Camera, Key, Mail, User, Crown, Calendar, ArrowRight } from 'lucide-react';
import UserContext, { User as UserType } from '@/contexts/UserContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { updateUser } from '@/utils/api';

export function Profile() {
    const { user, setUser } = useContext(UserContext);
    const isPremium = !!(user?.subscribed === 1 && user.subscribeEndDate && new Date(user.subscribeEndDate).getTime() > Date.now());

    const [_user, _setUser] = useState<UserType>(user as UserType);


    const handleInputChange = (field: string, value: string | boolean) => {
        _setUser(prev => ({ ...prev, [field]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await updateUser(_user);
        if (result) {
            toast.success(result.message);
            setUser(result.user);
        }
    }

    const renderSubscriptionSection = () => {
        if (isPremium) {
            return (
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-medium">Premium Subscription</h2>
                                <Crown className="w-5 h-5 text-yellow-600" />
                            </div>
                            <p className="text-sm text-gray-600">Your premium benefits and subscription details</p>
                        </div>
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                            Active
                        </span>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>Subscription expires: December 2025</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-medium mb-2">Premium Signals</h3>
                            <p className="text-sm text-gray-600">Access to all premium trading signals</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-medium mb-2">Priority Support</h3>
                            <p className="text-sm text-gray-600">24/7 dedicated customer support</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-medium mb-2">Advanced Analytics</h3>
                            <p className="text-sm text-gray-600">Detailed performance metrics</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Upgrade to Premium</h2>
                    </div>
                    <p className="mb-6 text-blue-100">
                        Unlock advanced features and get access to premium trading signals
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Premium Signals</h3>
                            <p className="text-sm text-blue-100">Professional trading signals</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Priority Support</h3>
                            <p className="text-sm text-blue-100">24/7 dedicated assistance</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Advanced Analytics</h3>
                            <p className="text-sm text-blue-100">Detailed performance metrics</p>
                        </div>
                    </div>

                    <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                        Upgrade Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

                <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                    {/* Profile Picture Section */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">Profile Picture</h2>
                            {/* <button
                                onClick={() => setIsEditingPicture(!isEditingPicture)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                {isEditingPicture ? 'Cancel' : 'Change'}
                            </button> */}
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
  unoptimized
                                    src={'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                    width={20}
                                    height={20}
                                />
                                <button
                                    // onClick={() => setIsEditingPicture(true)}
                                    className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full hover:bg-gray-700"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            {/* {isEditingPicture && (
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Enter image URL"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={profileData.profilePicture}
                                        onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleProfilePictureChange(profileData.profilePicture)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingPicture(false)}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* Subscription Section */}
                    {renderSubscriptionSection()}

                    {/* Basic Info Section */}
                    <div className="p-6 space-y-4">
                        <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={_user?.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={_user?.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={_user?.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={_user?.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    {/* <div className="p-6 space-y-4">
                        <h2 className="text-lg font-medium mb-4">Change Password</h2> */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={profileData.newPassword}
                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={profileData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full rounded-lg border border-blue-500 focus:border-2 focus:border-blue-700 focus:outline-none transition-colors"
                                />
                                <Shield className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div> */}
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={onSubmit}>
                            Update
                        </button>
                    </div>
                </div>
            {/* </div> */}
        </div>
    );
}