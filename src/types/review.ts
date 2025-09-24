// 내가 작성한 리뷰
export interface WrittenReview {
  reviewId: number;
  productId: number;
  productName: string;
  thumbnailImageUrl: string;
  purchaseDate: string; // "YYYY-MM-DD"
  rating: number;
  content: string;
  reviewImages: string[];
}

// 작성 가능한 리뷰
export interface WritableReview {
  productId: number;
  productName: string;
  thumbnailImageUrl: string;
  purchaseDate: string; // "YYYY-MM-DD"
}

// [GET /api/users/me/reviews] API의 전체 응답 타입
export interface MyReviewListResponse {
  writtenReviews: WrittenReview[];
  writableReviews: WritableReview[];
}

// [POST /api/users/me/reviews] API로 보낼 요청 타입
export interface ReviewCreateRequest {
  productId: number;
  rating: number;
  content: string;
  reviewImages: string[];
}

// [PATCH /api/users/me/reviews/{reviewId}] API로 보낼 요청 타입
export interface ReviewUpdateRequest {
  content: string;
  reviewImages: string[];
}
