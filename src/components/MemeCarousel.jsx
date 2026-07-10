import React from "react";

export default function MemeCarousel({ memes, onMemeClick }) {
  if (!memes || memes.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {memes.map((meme) => (
          <div
            key={meme._id}
            onClick={() => onMemeClick(meme)}
            className="flex-shrink-0 w-48 cursor-pointer group"
          >
            <div className="overflow-hidden rounded-2xl border border-gray-800 hover:border-yellow-400 transition-all duration-300">
              <img
                src={`http://144.24.81.60:5000${meme.imageUrl}`}
                alt={meme.title}
                className="w-full h-28 object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            <p className="mt-2 text-sm text-gray-300 truncate group-hover:text-yellow-400 transition-colors">
              {meme.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}