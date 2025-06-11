'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Extended session type to include our custom user properties
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  student_number?: string;
  profile_picture?: string;
  class_id?: string;
  school_id?: string;
}

interface ExtendedSession {
  user?: ExtendedUser;
  expires: string;
}

export default function StudentProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: (session as ExtendedSession)?.user?.name || '',
    email: (session as ExtendedSession)?.user?.email || ''
  });

  // Cast session to our extended type for easier access
  const extendedSession = session as ExtendedSession;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (extendedSession?.user?.role !== 'student') {
    router.push('/teacher/dashboard');
    return null;
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update session
        await update({
          ...session,
          user: {
            ...extendedSession.user,
            name: profileForm.name,
            email: profileForm.email
          }
        });
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + data.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile');
    }
  };

  const getProfilePicture = () => {
    // Use profile picture from Magister integration if available
    if (extendedSession?.user?.profile_picture) {
      return extendedSession.user.profile_picture;
    }
    // Default avatar based on student number
    const studentNum = extendedSession?.user?.student_number || '000';
    const avatarNumber = (parseInt(studentNum.slice(-3)) % 10) + 1;
    return `/images/avatars/student-${avatarNumber}.jpg`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">View your profile information and settings</p>
            </div>
            <Link
              href="/student/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <div className="flex items-center space-x-6">
                {/* Profile Picture - No upload functionality, photo comes from Magister */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={getProfilePicture()}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default avatar if image fails to load
                      e.currentTarget.src = '/images/avatars/default-student.jpg';
                    }}
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-1">{extendedSession?.user?.name}</h2>
                  <p className="text-purple-100 mb-1">{extendedSession?.user?.email}</p>
                  {extendedSession?.user?.student_number && (
                    <div className="flex items-center space-x-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                        Student #: {extendedSession.user.student_number}
                      </span>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                        👨‍🎓 Student
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setProfileForm({
                            name: extendedSession?.user?.name || '',
                            email: extendedSession?.user?.email || ''
                          });
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        ✏️ Edit
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{extendedSession?.user?.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{extendedSession?.user?.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Number</label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{extendedSession?.user?.student_number || 'Not assigned'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">{extendedSession?.user?.role}</p>
                    </div>
                  </div>
                </div>

                {/* School Information */}
                {(extendedSession?.user?.class_id || extendedSession?.user?.school_id) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {extendedSession?.user?.class_id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{extendedSession.user.class_id}</p>
                        </div>
                      )}
                      {extendedSession?.user?.school_id && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                          <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{extendedSession.user.school_id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Profile Photo Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">📷 Profile Photo</h4>
                  <p className="text-blue-800 text-sm">
                    Your profile photo is managed through Magister and will be automatically synchronized when available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 