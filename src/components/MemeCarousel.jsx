import { API_URL } from "../config";

export default function MemeCarousel({ memes, onMemeClick }) {
  if (!memes.length) return null;

  return (
    <div className="w-full mt-10">
      <div
        className="
          flex
          gap-4
          overflow-x-auto
          pb-2
          snap-x
          snap-mandatory
          scrollbar-hide
        "
      >
        {memes.map((meme) => (
          <div
            key={meme._id}
            onClick={() => onMemeClick(meme)}
            className="
              flex-shrink-0
              w-60
              h-36
              rounded-xl
              overflow-hidden
              cursor-pointer
              border
              border-gray-800
              hover:border-yellow-400
              transition-all
              duration-300
              snap-start
            "
          >
            <img
              src={`${API_URL}${meme.imageUrl}`}
              alt={meme.title}
              className="
                w-full
                h-full
                object-cover
                hover:scale-105
                transition-transform
                duration-300
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
}