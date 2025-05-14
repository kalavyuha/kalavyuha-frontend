import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

const reviewData = [
  {
    name: 'Samira Hadid',
    avatar: '/placeholder.svg?height=80&width=80',
    rating: 5,
    review: "Kalavyuha is the best. I've been using them for my business for 3 years now and it's been a great experience."
  },
  {
    name: 'Helene Duquet',
    avatar: '/placeholder.svg?height=80&width=80',
    rating: 5,
    review: "Kalavyuha is so creative. The quality of their work is superior. I highly recommend this company."
  },
  {
    name: 'Mirran Maxwell',
    avatar: '/placeholder.svg?height=80&width=80',
    rating: 5,
    review: "Thank you very much! An amazing job that exceeds all expectations! I am very glad that I trusted you! Thank you"
  }
]

function StarRating({rating}) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewSection() {
  return (
    <section className="w-full py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-3xl font-bold">
            Reviews <span className="text-gray-500 font-normal text-lg">(written by customers after their visit)</span>
          </h2>
          <a href="#" className="text-blue-600 hover:underline">See all</a>
        </div>
        <div className="space-y-6">
          {reviewData.map((review, index) => (
            <Card key={index} className="p-6 bg-white">
              <div className={`flex ${index === 1 ? 'flex-row' : 'flex-row-reverse'} justify-between items-start`}>
                <div className={`flex ${index === 1 ? 'flex-row' : 'flex-col'} items-start gap-4`}>
                  {index === 1 && (
                    <Avatar className="w-20 h-20 rounded-full overflow-hidden">
                      <AvatarImage src={review.avatar} alt={review.name} />
                    </Avatar>
                  )}
                  <div className={`flex ${index === 1 ? 'flex-col items-start' : 'flex-row justify-between w-full'}`}>
                    <h3 className={`text-2xl font-script ${index === 1 ? 'text-blue-600' : 'text-teal-600'}`}>{review.name}</h3>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                {index !== 1 && (
                  <Avatar className="w-20 h-20 rounded-full overflow-hidden">
                    <AvatarImage src={review.avatar} alt={review.name} />
                  </Avatar>
                )}
              </div>
              <p className={`mt-4 ${index === 0 ? 'text-center' : index === 1 ? 'text-right' : 'text-left'}`}>
                {review.review}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}