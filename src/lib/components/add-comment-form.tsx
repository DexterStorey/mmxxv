'use client';

import { useState } from 'react';
import { useSession } from "@rubriclab/auth";
import { addComment } from "~/actions/market";

export function AddCommentForm({ marketId, onCommentAdded }: { 
    marketId: string;
    onCommentAdded: () => void;
}) {
    const [content, setContent] = useState('');
    const { user } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        try {
            await addComment(marketId, content.trim());
            setContent('');
            onCommentAdded();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="form">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add your comment..."
                className="textarea"
                rows={3}
            />
            <button 
                type="submit" 
                className="button"
                disabled={!content.trim()}
            >
                Add Comment
            </button>
        </form>
    );
} 