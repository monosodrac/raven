import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { api } from '../api/api';

export interface CommentType {
    id: number;
    avatar: string;
    author_email: string;
    content: string;
    created_at: string;
}

export interface TweetType {
    id: number;
    avatar: string;
    username: string;
    user_id: number;
    author_id: number
    content: string;
    timestamp: string;
    likes_count: number;
    replies_count: number;
    comments: CommentType[];
    is_following: boolean;
    handle?: string;
    liked_by_me: boolean;
    retweets_count: number;
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