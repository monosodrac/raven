import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';
import { Layout } from '../components/Layout';

type UserMini = { id: number; email: string; bio?: string; avatar?: string | null };

export function Following() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserMini[]>([]);

  useEffect(() => {
    async function load() {
      const resp = await fetch(api('/api/users/me/following/'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setUsers(data);
    }
    if (token) load();
  }, [token]);

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Following</h1>

        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="border border-gray-800 rounded-xl p-4 flex items-center gap-3">
              {u.avatar ? (
                <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-800" />
              )}
              <div>
                <div className="font-semibold">{u.email}</div>
                {u.bio && <div className="text-sm text-gray-400">{u.bio}</div>}
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-gray-400">Nenhum seguidor ainda.</p>}
        </div>
      </div>
    </Layout>
  );
}
