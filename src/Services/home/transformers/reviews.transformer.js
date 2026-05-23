import RecommendedImgPath from '../../../assets/images/recommended/recommended.png';

export const formatTimeAgo = (dateString) => {

  const date = new Date(dateString);

  const now = new Date();

  const diffInMs = now - date;

  const diffInHours =
    Math.floor(diffInMs / (1000 * 60 * 60));

  const diffInDays =
    Math.floor(diffInHours / 24);

  const diffInMonths =
    Math.floor(diffInDays / 30);

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }

  return `${diffInMonths} months ago`;
};

export const transformReviews = (items = []) => {

  return items.map((review, index) => ({

    id: review._id || index + 1,

    ReviewId: review._id,

    CustomerName: review.CustomerName,

    name: review.CustomerName,

    Rating: review.Rating || 5,

    rating: review.Rating || 5,

    ReviewText: review.ReviewText,

    content: review.ReviewText,

    avatar: RecommendedImgPath,

    timeAgo: formatTimeAgo(review.CreatedOn),

    CreatedOn: review.CreatedOn,

    IsActive: review.IsActive
  }));
};