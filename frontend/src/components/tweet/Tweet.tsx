// src/components/Tweet/Tweet.tsx
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Repeat2, Share, UserPlus, UserMinus } from 'lucide-react'; // <-- AQUI: ícones de seguir
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../api/api';

interface TweetProps {
    id: number | string;
    username: string;
    handle?: string;
    content: string;
    timestamp: string;
    likes: number;
    retweets: number;
    replies: number;
    liked?: boolean;
    userId?: number | string; // <-- AQUI: ID do autor do tweet (necessário para seguir)
    isFollowing?: boolean; // <-- usado para iniciar o estado do botão
}

interface Comment {
    id: number;
    author_email: string;
    content: string;
    created_at: string;
}

export function Tweet({
    id,
    username,
    handle,
    content,
    likes,
    retweets,
    replies,
    liked: initialLiked = false,
    userId, // <-- AQUI
    isFollowing: initialIsFollowing = false, // <- aqui
}: TweetProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(likes);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false); // <-- AQUI
    const { token } = useAuth();

    // console.log("Token no Tweet component:", token, "userId:", userId);

    const handleLike = async () => {
        if (!token) {
            console.warn('Usuário não autenticado.');
            return;
        }

        try {
            const response = await fetch(api(`/api/tweets/${id}/like_tweet/`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setLiked(data.liked);
            setLikeCount(data.total_likes);
        } catch (error) {
            console.error('Erro ao curtir/descurtir tweet', error);
        }
    };

    // -------------------------------
    // 🔹 NOVA FUNÇÃO: seguir/desseguir usuário
    // -------------------------------
    const handleFollow = async () => {
        if (!token || !userId) {
            console.warn("Sem token ou userId");
            return;
        }

        try {
            const response = await fetch(
                api(`/api/users/toggle-follow/${userId}/`),
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                console.error("Erro ao seguir/desseguir:", response.status, errText);
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();

            // ✅ Ajuste: backend retorna { "status": "followed" } ou "unfollowed"
            if (data.status === "followed") {
                setIsFollowing(true);
            } else if (data.status === "unfollowed") {
                setIsFollowing(false);
            }

            console.log("Resposta do follow:", data);
        } catch (error) {
            console.error("Erro ao seguir/desseguir usuário:", error);
        }
    };


    // ---------------------- Comentários ----------------------
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const resp = await fetch(
                    api(`/api/tweets/${id}/comments/`)
                );
                if (!resp.ok) throw new Error('Erro ao buscar comentários');
                const data = await resp.json();
                setComments(data);
            } catch (error) {
                console.error('Erro ao buscar comentários', error);
            }
        };
        fetchComments();
    }, [id]);

    const handleAddComment = async () => {
        if (!token || !commentText.trim()) return;

        try {
            const resp = await fetch(
                api(`/api/tweets/${id}/add_comment/`),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ content: commentText }),
                }
            );

            if (!resp.ok) throw new Error('Erro ao enviar comentário');
            const newComment: Comment = await resp.json();
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="border-b border-gray-800 p-4 hover:bg-gray-900/50">
            <div className="flex space-x-4">
                <img
                    src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg"
                    alt={username}
                    className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{username}</span>
                            <span className="text-gray-500">@{handle}</span>
                            {/* <span className="text-gray-500">·</span> */}
                            {/* <span className="text-gray-500">{timestamp}</span> */}
                        </div>

                        {/* 🔹 Botão de seguir/desseguir */}
                        <button
                            onClick={handleFollow}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                                isFollowing
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isFollowing ? <UserMinus size={16} /> : <UserPlus size={16} />}
                            <span>{isFollowing ? 'Seguindo' : 'Seguir'}</span>
                        </button>
                    </div>

                    <p className="text-white mt-2">{content}</p>

                    <div className="flex justify-between mt-4 text-gray-500 max-w-md">
                        <button className="flex items-center space-x-2 hover:text-blue-500">
                            <MessageCircle className="h-5 w-5" />
                            <span>{replies}</span>
                        </button>

                        <button className="flex items-center space-x-2 hover:text-green-500">
                            <Repeat2 className="h-5 w-5" />
                            <span>{retweets}</span>
                        </button>

                        <button
                            className={`flex items-center space-x-2 ${
                                liked ? 'text-red-500' : 'hover:text-red-500'
                            }`}
                            onClick={handleLike}
                        >
                            <Heart className="h-5 w-5" />
                            <span>{likeCount}</span>
                        </button>

                        <button className="flex items-center space-x-2 hover:text-blue-500">
                            <Share className="h-5 w-5" />
                        </button>
                    </div>

                                        <div className="mt-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAddComment}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Comment
                            </button>
                        </div>

                        <div className="mt-2 space-y-2">
                            {comments.map(comment => (
                                <div key={comment.id} className="text-white bg-gray-900 p-2 rounded">
                                    <span className="font-bold">{comment.author_email}:</span> {comment.content}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
