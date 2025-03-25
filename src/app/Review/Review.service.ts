import AppError from "../Errors/AppErrors";
import { ObjectId } from "mongodb";
import { TReview } from "./Review.interface";
import ReviewModel from "./Review.models";

// Review Service

  
     const  createReview = (reviewData: TReview ,user:string) => {
      reviewData.userId = new ObjectId(user);

const review= ReviewModel.create(reviewData);
   return  review
    }
  
    const  getReviewsByProduct = (productId: string) => {
      const allreview= ReviewModel.findByProductId(productId);
      return allreview;
    }
  
    const deleteReview = async (reviewId: string, userId: string, isAdmin: boolean) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) throw new AppError (401,'Review not found');
      if (review.userId.toString() !== userId && !isAdmin) {
       throw new AppError (401,'Unauthorized to delete this review');
      }
      return  ReviewModel.findByIdAndDelete(reviewId);
    }
  
    const updateReview = async (reviewId: string, userId: string, updateData: Partial<TReview>) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) throw new Error('Review not found');
      if (review.userId.toString() !== userId) {
        throw new AppError (401,'Unauthorized to delete this review');
      }
      return  ReviewModel.findByIdAndUpdate(reviewId, updateData, { new: true });
    }
    
    export const ReviewService = { createReview, getReviewsByProduct, deleteReview, updateReview };