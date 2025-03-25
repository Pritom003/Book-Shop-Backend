
import { Request, Response } from 'express';
import CatchAsync from '../Utils/CatchAsync';
import { ReviewService } from './Review.service';
import sendResponse from '../Utils/sendResponse';

export const createReview = CatchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString(); // Convert ObjectId to string
    console.log(userId, '📌');
    
  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User ID is required',
      data: null,
    });
  }
  const review = await ReviewService.createReview(req.body, userId);
  console.log(review);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'review Created  successfully',
    data: review,
  });
});

export const getProductReviews = CatchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const reviews = await ReviewService.getReviewsByProduct(productId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Reviews found successfully',
    data: reviews,
  });
});

export const deleteReview = CatchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const userId= req.user?._id.toString(); 
  const { isAdmin } = req.body; // Assuming userId and isAdmin are passed in the request body
  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: 'User ID is required',
      data: null,
    });
  }
  await ReviewService.deleteReview(reviewId, userId, isAdmin);
  res.status(200).json({ success: true, message: 'Review deleted' });
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review deleted',
    data: {}
  });
});

export const updateReview = CatchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { userId } = req.body; // Assuming userId is passed in the request body
  const updatedReview = await ReviewService.updateReview(reviewId, userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Review updated',
    data: updatedReview,
  });
});


export const ReviewController = { createReview, getProductReviews, deleteReview, updateReview };