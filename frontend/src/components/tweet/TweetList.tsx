// tweet/tweetlist.tsx
import { useEffect } from 'react';
import { Tweet } from './Tweet';
import { useTweets } from '../../hooks/useTweets';

export function TweetList() {
    const { tweets } = useTweets();

    useEffect(() => {
        console.log("Tweets renderizados:", tweets);
    }, [tweets]);

    return (
        <div>
            {tweets.map((tweet) => (
                <Tweet
                    key={tweet.id}
                    id={tweet.id}
                    username={tweet.username}
                    handle={tweet.handle}
                    content={tweet.content}
                    timestamp={tweet.timestamp}
                    likes={tweet.likes_count}
                    retweets={tweet.retweets_count || 0}
                    replies={tweet.replies_count || 0}
                    liked={tweet.liked_by_me || false}
                    userId={tweet.author_id}          // 🔹 aqui
                    isFollowing={tweet.is_following} // 🔹 aqui
                />
            ))}
        </div>
    );
}
