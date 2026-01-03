import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { api } from '../api/api';

export interface CommentType {
    id: number;
    author_email: string;
    content: string;
    created_at: string;
}

export interface TweetType {
  id: number;
  content: string;
  username: string;
  author_id: number;
  author_avatar: string | null;
  timestamp: string;
  likes_count: number;
  liked_by_me: boolean;
  is_following: boolean;
  handle?: string;
  replies_count: number;
}


export function useTweets() {
    const [tweets, setTweets] = useState<TweetType[]>([]);
    const [reloadKey, setReloadKey] = useState(0);
    const { token } = useAuth();

    const fetchTweets = useCallback(async () => {
        if (!token) {
            console.warn("Token não encontrado. Não será possível buscar tweets.");
            return;
        }

        try {
            console.log("Iniciando busca por tweets...");
            const response = await fetch(api('/api/tweets/'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Erro ao buscar tweets');
            const data: TweetType[] = await response.json();
            console.log("Tweets recebidos:", data);
            setTweets(data);
        } catch (error) {
            console.error("Erro ao buscar tweets:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchTweets();
    }, [fetchTweets, reloadKey]);

    const reloadTweets = () => {
        setReloadKey((prev) => prev + 1);
    };

    return { tweets, setTweets, fetchTweets, reloadTweets };
}