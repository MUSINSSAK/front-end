import { api } from "../lib/axios";
import type {
  MyReviewListResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
} from "../types/review";

// 1. 내 리뷰 목록 조회 API
export const getMyReviews = async (): Promise<MyReviewListResponse> => {
  const response = await api.get("/users/me/reviews");
  return response.data.data;
};

// 2. 리뷰 작성 API
export const createReview = async (
  reviewData: ReviewCreateRequest,
): Promise<void> => {
  await api.post("/users/me/reviews", reviewData);
};

// 3. 리뷰 수정 API
export const updateReview = async (
  reviewId: number,
  reviewData: ReviewUpdateRequest,
): Promise<void> => {
  await api.patch(`/users/me/reviews/${reviewId}`, reviewData);
};

// 4. 리뷰 삭제 API
export const deleteReview = async (reviewId: number): Promise<void> => {
  await api.delete(`/users/me/reviews/${reviewId}`);
};
