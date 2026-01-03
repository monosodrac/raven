import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';
import { Layout } from '../components/Layout';

type UserItem = {
  id: number;
  email: string;
  bio: string | null;
  avatar: string | null;
  is_following: boolean;
};

const fallbackAvatar =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg";

export function FollowingByUser() {
  const { id } = useParams();
  const { token } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    async function load() {
      if (!token || !id) return;

      const resp = await fetch(api(`/api/users/${id}/following/`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      setUsers(data);
    }

    load();
  }, [token, id]);

  const toggleFollow = async (userId: number) => {
    if (!token) return;

    const resp = await fetch(api(`/api/users/toggle-follow/${userId}/`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) return;
    const data = await resp.json();

    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, is_following: data.is_following } : u))
    );
  };

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Following</h1>

        <div className="space-y-3">
          {users.map(u => (
            <div
              key={u.id}
              className="border border-gray-800 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || fallbackAvatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={u.email}
                />
                <div>
                  <div className="font-semibold">{u.email}</div>
                  {u.bio && <div className="text-sm text-gray-400">{u.bio}</div>}
                </div>
              </div>

              <button
                onClick={() => toggleFollow(u.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  u.is_following ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {u.is_following ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}

          {users.length === 0 && <p className="text-gray-400">No following found.</p>}
        </div>
      </div>
    </Layout>
  );
}
