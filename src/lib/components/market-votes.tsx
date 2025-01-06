'use client';

import { useSession } from "@rubriclab/auth";
import { upvoteMarket, downvoteMarket } from "~/actions/market";
import type { MarketWithVotesAndComments } from "./market-item";

export function MarketVotes({ market }: { market: MarketWithVotesAndComments }) {
    const { user } = useSession();
    const hasUpvoted = market.upvoters.some(u => u.userId === user?.id);
    const hasDownvoted = market.downvoters.some(u => u.userId === user?.id);

    return (
        <div className="votes-container">
            <div 
                className={`vote-box ${hasUpvoted ? 'active' : ''}`}
                onClick={() => upvoteMarket(market.id)}
            >
                <div className="vote-count">
                    <div>↑ {market.upvotes}</div>
                    <div className="vote-label">Upvotes</div>
                </div>
            </div>
            <div 
                className={`vote-box ${hasDownvoted ? 'active' : ''}`}
                onClick={() => downvoteMarket(market.id)}
            >
                <div className="vote-count">
                    <div>↓ {market.downvotes}</div>
                    <div className="vote-label">Downvotes</div>
                </div>
            </div>
        </div>
    );
} 