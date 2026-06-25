"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";

const staticReviews = [
  {
    name: "Aarav Mehta",
    rating: 5,
    text: "Best butter chicken in town. Warm staff and the ambience feels premium without being stuffy.",
  },
  {
    name: "Priya Nair",
    rating: 5,
    text: "Loved the dosa and the Chinese starters equally — rare to find both done so well in one place.",
  },
  {
    name: "Rohan Kapoor",
    rating: 4,
    text: "Great spot for a casual family dinner. Portions are generous and the desserts are worth saving room for.",
  },
  {
    name: "Sneha Iyer",
    rating: 5,
    text: "The filter coffee and biryani took us right back home. Will definitely be returning soon.",
  },
];

export default function Reviews() {
  const { data: session, status } = useSession();
  const [userReviews, setUserReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setUserReviews)
      .catch(() => setUserReviews([]));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!rating || !text.trim()) {
      setError("Please add a star rating and a short review.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, text }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const { error: message } = await res.json();
      setError(message ?? "Something went wrong. Please try again.");
      return;
    }

    const newReview = await res.json();
    setUserReviews((prev) => [newReview, ...prev.filter((r) => r.userId !== newReview.userId)]);
    setRating(0);
    setText("");
  }

  return (
    <section className="bg-[#0F0F0F] px-4 py-16 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          What Our Guests Say
        </h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#D4AF37]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
      >
        <GoogleIcon />
        <span className="font-serif text-4xl font-bold text-[#D4AF37]">4.8</span>
        <Stars rating={5} />
        <p className="text-sm text-white/60">Based on 26 reviews on Google</p>
        <a
          href="https://www.google.com/search?q=silver+spoon+restaurant+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full border-2 border-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition-transform hover:scale-105"
        >
          Write a Review
        </a>

        <div className="mt-4 w-full border-t border-white/10 pt-6">
          {status === "authenticated" ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <p className="text-sm text-white/80">{session.user.name}</p>
              </div>
              <StarRatingInput rating={rating} onChange={setRating} />
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Share a quick note about your visit..."
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-105 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition-transform hover:scale-105"
            >
              <GoogleIcon small />
              Sign in with Google to write a review
            </button>
          )}
        </div>
      </motion.div>

      <div className="mx-auto mt-12 flex max-w-6xl gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
        {[...userReviews, ...staticReviews].map((review, index) => (
          <motion.div
            key={review.userId ?? review.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            className="w-72 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-6 sm:w-auto"
          >
            <div className="flex items-center gap-3">
              {review.image ? (
                <Image
                  src={review.image}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-sm font-semibold text-[#D4AF37]">
                  {review.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[#F5F1E8]">{review.name}</p>
                <Stars rating={review.rating} />
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={index < rating ? "#D4AF37" : "none"}
          stroke="#D4AF37"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.9 6.5 7.1.6-5.4 4.7 1.7 6.9L12 17l-6.3 3.7 1.7-6.9L2 8.1l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function StarRatingInput({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index + 1)}
          aria-label={`Rate ${index + 1} stars`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill={index < rating ? "#D4AF37" : "none"}
            stroke="#D4AF37"
            strokeWidth="1.5"
          >
            <path d="M12 2l2.9 6.5 7.1.6-5.4 4.7 1.7 6.9L12 17l-6.3 3.7 1.7-6.9L2 8.1l7.1-.6L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function GoogleIcon({ small }) {
  const size = small ? 18 : 28;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.14c-.22-.65-.34-1.34-.34-2.14s.12-1.49.34-2.14V7.02H2.18C1.43 8.52 1 10.21 1 12s.43 3.48 1.18 4.98l2.85-2.21z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.48 6.16-4.48z"
      />
    </svg>
  );
}
