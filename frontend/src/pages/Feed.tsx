import { Layout } from '../components/Layout';
import { TweetBox } from '../components/TweetBox';
import { TweetList } from '../components/tweet/TweetList';

export function Feed() {
    return (
        <Layout>
            <div>
                <div className="sticky top-0 z-10 border-b border-gray-800 bg-black/80 backdrop-blur">
                    <h1 className="text-xl font-bold text-white p-4">Home</h1>
                </div>
                <TweetBox />
                <TweetList />
            </div>
        </Layout>
    );
}