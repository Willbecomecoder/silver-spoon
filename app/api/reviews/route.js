import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/auth";

// TODO: replace this JSON file with a real database (e.g. Postgres, MongoDB).
// This is a placeholder so the review form works end-to-end without extra setup.
const dataFile = path.join(process.cwd(), "data", "reviews.json");

async function readReviews() {
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw);
}

async function writeReviews(reviews) {
  await fs.writeFile(dataFile, JSON.stringify(reviews, null, 2));
}

export async function GET() {
  const reviews = await readReviews();
  return Response.json(reviews);
}

export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "You must be signed in to submit a review." }, { status: 401 });
  }

  const { rating, text } = await request.json();

  if (!rating || rating < 1 || rating > 5 || !text?.trim()) {
    return Response.json({ error: "A rating (1-5) and review text are required." }, { status: 400 });
  }

  const userId = session.user.id ?? session.user.email;
  const reviews = await readReviews();

  const review = {
    userId,
    name: session.user.name,
    image: session.user.image,
    rating,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  // One review per Google account: replace any existing review from this user.
  const filtered = reviews.filter((existing) => existing.userId !== userId);
  filtered.unshift(review);

  await writeReviews(filtered);

  return Response.json(review, { status: 201 });
}
