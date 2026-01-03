import { useState, useEffect } from 'react';
import { Image, Smile, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';

export function TweetBox() {
    const [tweet, setTweet] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [avatar, setAvatar] = useState<string>('');
    const { token } = useAuth();

    useEffect(() => {
        async function fetchUserProfile() {
            if (token) {
                try {
                    const response = await fetch(api('/api/users/profile/'), {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const avatarUrl = data.avatar;
                        setAvatar(avatarUrl);
                    } else {
                        console.error("Erro ao buscar perfil de usuário.");
                    }
                } catch (error) {
                    console.error("Erro na requisição de perfil:", error);
                }
            }
        }

        fetchUserProfile();
    }, [token]);

    const handleTweet = async () => {
        if (!tweet.trim() || !token) {
            alert("Por favor, insira um texto válido para tweetar.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Enviando tweet:", tweet);
            const response = await fetch(api('/api/tweets/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content: tweet }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar tweet: ${response.statusText}`);
            }

            const newTweet = await response.json();
            console.log("Tweet criado com sucesso:", newTweet);

            setTweet('');

            window.location.reload();
        } catch (error) {
            console.error("Erro ao criar tweet:", error);
            alert("Houve um erro ao enviar o tweet. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border-b border-gray-800 p-4">
            <div className="flex space-x-4">
                <img
                    src={avatar ? avatar : "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <textarea
                        value={tweet}
                        onChange={(e) => setTweet(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-transparent text-white text-xl placeholder-gray-500 border-none focus:ring-0 resize-none"
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <div className="flex items-center justify-end pt-4 border-t border-gray-800">
                        <button
                            onClick={handleTweet}
                            className={`bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!tweet.trim() || !token || isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Tweet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
