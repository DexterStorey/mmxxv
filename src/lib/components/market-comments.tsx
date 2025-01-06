'use client';

import { useState } from 'react';
import type { MarketWithVotesAndComments } from "./market-item";
import { AddCommentForm } from "./add-comment-form";

export function MarketComments({ market }: { market: MarketWithVotesAndComments }) {
    const [comments, setComments] = useState(market.comments);

    const refreshComments = async () => {
        const response = await fetch(`/api/markets/${market.id}`);
        const updatedMarket = await response.json();
        setComments(updatedMarket.comments);
    };

    return (
        <div className="comments-section">
            <h2 className="subtitle">Comments ({comments.length})</h2>
            <AddCommentForm marketId={market.id} onCommentAdded={refreshComments} />
            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <div className="comment-author">{comment.author.email}</div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 