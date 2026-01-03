import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';
import { Layout } from '../components/Layout';

export function Profile() {
  const { token } = useAuth();
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;
      const resp = await fetch(api('/api/users/profile/'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setEmail(data.email);
      setBio(data.bio || '');
      console.log(data.avatar)
      setAvatarUrl(data.avatar || '');
    }
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('bio', bio);
    if (password) formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);

    const resp = await fetch(api('/api/users/profile/'), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (resp.ok) {
      const data = await resp.json();
      setMessage('Perfil atualizado com sucesso!');
      setAvatarUrl(data.avatar);
    } else {
      const data = await resp.json();
      setMessage('Erro: ' + JSON.stringify(data));
    }
  };

  return (
    <Layout>
      <div className="flex justify-center bg-black text-white py-16">
        <div className="w-full max-w-md p-6">
          <h2 className="text-xl font-bold mb-4 text-center text-white">My Profile</h2>
          {message && (
            <p className="text-center text-sm text-green-500 mb-3">{message}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="E-mail"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none h-24"
                placeholder="Bio"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New password</label>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Avatar</label>
              {avatarUrl && (
                <div className="mb-3">
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                </div>
              )}
              <input
                type="file"
                onChange={e => setAvatar(e.target.files ? e.target.files[0] : null)}
                className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition-all duration-200"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
