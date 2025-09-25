import { api } from "../lib/axios";
import type {
  ListProductsData,
  ListProductsParams,
  Product,
  ProductDetail,
} from "../types/products";
import type { WrittenReview } from "../types/review";

// 메인 페이지 신상품 조회
export async function getNewProducts(): Promise<Product[]> {
  const res = await api.get("/products/main");
  return res.data.data.products as Product[];
}

// 메인 페이지 베스트 상품 조회
export async function getBestProducts(): Promise<Product[]> {
  const res = await api.get("/products/main"); // 주문 구현이후 수정
  return res.data.data.products as Product[];
}

// 목록 조회 함수
export async function listProducts(
  params: ListProductsParams,
): Promise<ListProductsData> {
  const res = await api.get("/products", {
    params,
    // brand 배열을 &brand=a&brand=b 로 직렬화
    paramsSerializer: {
      serialize: (p: Record<string, unknown>) => {
        const usp = new URLSearchParams();
        Object.entries(p).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "") return;
          if (Array.isArray(v)) {
            v.forEach((item) => usp.append(k, String(item)));
          } else {
            usp.set(k, String(v));
          }
        });
        return usp.toString();
      },
    },
  });

  // 서버 공통 포맷: { status, code, message, data }
  return res.data.data as ListProductsData;
}

// 상품 상세 조회
export async function getProductDetail(
  productId: number,
): Promise<ProductDetail> {
  const res = await api.get(`/products/${productId}`);
  return res.data.data as ProductDetail;
}

// 상품 문의 목록 조회
type QuestionAnswer = {
  responder: string;
  content: string;
  answerDate: string; // yyyy-MM-dd
};

type ProductQuestionItem = {
  id: number;
  author: string; // "박**"
  status: "PENDING" | "ANSWERED";
  question: string;
  questionDate: string; // yyyy-MM-dd
  answer?: QuestionAnswer;
};

type ProductQuestionsData = {
  productId: number;
  totalQuestions: number;
  questions: ProductQuestionItem[];
  page: number; // 1-base
  size: number;
  hasNext: boolean;
};

type ProductQuestionsParams = {
  sort?: "latest" | "pendingFirst";
  page: number; // 1부터 시작
  size: number;
};

export async function getProductQuestions(
  productId: number,
  params: ProductQuestionsParams,
): Promise<ProductQuestionsData> {
  const res = await api.get(`/products/${productId}/questions`, { params });
  return res.data.data as ProductQuestionsData;
}

// 상품 리뷰 목록 조회
type ProductReviewsParams = {
  sort?: "latest" | "high" | "low";
  page: number; // 1부터 시작
  size: number;
};

type ProductReviewsData = {
  productId: number;
  totalReviews: number;
  averageRating: number; // 0.0 ~ 5.0
  ratingDistribution: Record<string, number>; // {"5":89,"4":25,...}
  reviews: WrittenReview[];
  page: number; // 1-base
  size: number;
  hasNext: boolean;
};

export async function getProductReviews(
  productId: number,
  params: ProductReviewsParams,
): Promise<ProductReviewsData> {
  const res = await api.get(`/products/${productId}/reviews`, { params });
  // 서버 공통 포맷: { status, code, message, data }
  return res.data.data as ProductReviewsData;
}
