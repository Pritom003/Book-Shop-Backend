// Review Routes
import express from 'express';
import { ReviewController } from './Review.cotroller';
import auth from '../Middleware/auth';
// import { ReviewController } from './Review.controller';

// const router = express.Router();

const ReviewRoute = express.Router();
ReviewRoute.post('/', auth('ADMIN', 'USER'),ReviewController.createReview);
ReviewRoute.get('/:productId', ReviewController.getProductReviews);
ReviewRoute.delete('/:reviewId', auth('ADMIN', 'USER'), ReviewController.deleteReview);
ReviewRoute.put('/:reviewId', ReviewController.updateReview);

export default ReviewRoute;