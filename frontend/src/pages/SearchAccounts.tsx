import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';

type UserItem = {
  id: number;
  email: string;
  bio: string | null;
  avatar: string | null;
  is_following: boolean;
};

const fallbackAvatar =
  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg";

export function SearchAccounts() {
  const { token } = useAuth();
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const queryString = useMemo(() => q.trim(), [q]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const resp = await fetch(api(`/api/users/search/?q=${encodeURIComponent(queryString)}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const toggleFollow = async (userId: number) => {
    if (!token) return;

    const resp = await fetch(api(`/api/users/toggle-follow/${userId}/`), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) return;

    const data = await resp.json(); // {status, is_following, ...}

    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, is_following: data.is_following } : u
      )
    );
  };

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Find new profiles</h1>

        <div className="flex gap-2 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by email or bio..."
            className="flex-1 px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}

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

                  {/* links para followers/following desse usuário */}
                  <div className="text-sm mt-1 flex gap-3">
                    <Link className="text-blue-400 hover:underline" to={`/user/${u.id}/followers`}>
                      Followers
                    </Link>
                    <Link className="text-blue-400 hover:underline" to={`/user/${u.id}/following`}>
                      Following
                    </Link>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(u.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  u.is_following ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {u.is_following ? "Following" : "Follow"}
              </button>
            </div>
          ))}

          {!loading && users.length === 0 && (
            <p className="text-gray-400">No users found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
