import { useRef } from "react";
import { imageUrl } from "../lib/api";

export default function MemeCarousel({ memes, onMemeClick }) {
  const scrollRef = useRef(null);

  if (!memes || memes.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-white">지금 인기있는 짤</h3>

        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="이전"
            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="다음"
            className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {memes.map((meme, idx) => (
          <div
            key={meme._id}
            onClick={() => onMemeClick(meme)}
            className="relative flex-shrink-0 w-56 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 group-hover:border-yellow-400 transition-all duration-300">
              <img
                src={imageUrl(meme.imageUrl)}
                alt={meme.title}
                className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
              />
              {/* 순위 뱃지 */}
              <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/70 backdrop-blur-sm text-yellow-400 text-sm font-black flex items-center justify-center border border-white/10">
                {idx + 1}
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-300 truncate group-hover:text-yellow-400 transition-colors font-medium">
              {meme.title}
            </p>
            <p className="text-xs text-gray-500">추천 {meme.upvotes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
