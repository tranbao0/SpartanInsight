// src/components/AddReviewForm.js
import React, { useState } from 'react';
import { createReview } from '../api';

function AddReviewForm({ professorId }) {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { professorId, rating, comment };
            await createReview(data);
            alert("Review added successfully");
            setComment('');
            setRating(1);
        } catch (error) {
            console.error("Error adding review:", error);
            alert("Failed to add review");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Rating: </label>
                <input
                    type="number"
                    value={rating}
                    min="1"
                    max="5"
                    onChange={(e) => setRating(e.target.value)}
                />
            </div>
            <div>
                <label>Comment: </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <button type="submit">Add Review</button>
        </form>
    );
}

export default AddReviewForm;
