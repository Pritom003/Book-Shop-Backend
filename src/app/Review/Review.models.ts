// import { Model } from "mongoose";
import { model } from "mongoose";
import { TReview, TReviewModel } from "./Review.interface";
import { Schema } from "mongoose";



  
  const ReviewSchema = new Schema<TReview, TReviewModel>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: 500,
      },
    },
    { timestamps: true }
  );
  
  ReviewSchema.statics.findByProductId = async function (productId: string) {
    return this.find({ productId }).sort({ createdAt: -1 });
  };
  
  const ReviewModel = model<TReview, TReviewModel>('Reviews', ReviewSchema);
  export default ReviewModel;