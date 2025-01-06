'use client'

import { Market, Comment } from "@prisma/client";
import { useSession } from "@rubriclab/auth";
import { useState } from "react";
import { upvoteMarket, downvoteMarket, addComment } from "~/actions/market";

export type MarketWithVotesAndComments = Market & {
    upvoters: { userId: string }[];
    downvoters: { userId: string }[];
    comments: (Comment & { author: { email: string } })[];
    author: { email: string };
};

export function MarketItem({ market }: { market: MarketWithVotesAndComments }) {
    const { user } = useSession();
    const [comment, setComment] = useState("");

    const hasUpvoted = market.upvoters.some(u => u.userId === user?.id);
    const hasDownvoted = market.downvoters.some(u => u.userId === user?.id);

    return (
        <div className="border p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold">{market.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Created by: {market.author.email}</p>
            <p>{market.description}</p>
            <p className="text-sm text-gray-500">Resolution Criteria: {market.resolutionCriteria}</p>
            
            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => upvoteMarket(market.id)}
                    className={`px-3 py-1 rounded ${hasUpvoted ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    ↑ {market.upvotes}
                </button>
                <button 
                    onClick={() => downvoteMarket(market.id)}
                    className={`px-3 py-1 rounded ${hasDownvoted ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                >
                    ↓ {market.downvotes}
                </button>
            </div>

            <div className="mt-4">
                <h3 className="font-bold">Comments</h3>
                <div className="space-y-2">
                    {market.comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-2 rounded">
                            <p className="text-sm text-gray-500">{comment.author.email}</p>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
                
                {user && (
                    <div className="mt-2 flex gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="border rounded px-2 py-1 flex-1"
                        />
                        <button
                            onClick={async () => {
                                if (comment.trim()) {
                                    await addComment(market.id, comment);
                                    setComment("");
                                    // In a real app, you'd want to refresh the comments here
                                }
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Post
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 