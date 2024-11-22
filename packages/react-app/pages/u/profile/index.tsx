import React, { useEffect, useState } from 'react';
import UserLayout from '@/components/UserLayout';
import ProfilePage from '@/components/profile';

const UserProfilePage = () => {
  return (
    <UserLayout>
      <ProfilePage />;
    </UserLayout>
  );
};

export default UserProfilePage;
