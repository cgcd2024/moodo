import { imageUrl } from "../lib/api";
import TrendingUpIcon from "./icons/TrendingUpIcon";
import UserIcon from "./icons/UserIcon";

export default function TodayMeme({ meme, onClick }) {
  if (!meme) return null;

  return (
    <section className="animate-fade-in-up">
      <div
        onClick={onClick}
        className="relative w-full rounded-3xl overflow-hidden border border-gray-800 hover:border-yellow-400/40 cursor-pointer transition-all duration-500 hover:shadow-[0_0_50px_rgba(250,204,21,0.15)] group"
      >
        {/* 이미지 */}
        <div className="relative aspect-video bg-black overflow-hidden">
          <img
            src={imageUrl(meme.imageUrl)}
            alt={meme.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* 하단 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        </div>

        {/* 뱃지 */}
        <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-yellow-400 text-black text-sm font-black shadow-lg">
          오늘의 무도짤
        </div>

        {/* 텍스트 오버레이 */}
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-2xl md:text-4xl font-black text-white mb-2 group-hover:text-yellow-400 transition-colors drop-shadow-md">
              {meme.title}
            </h4>
            <p className="text-gray-300 text-sm md:text-base max-w-2xl line-clamp-2 drop-shadow">
              {meme.description}
            </p>
          </div>

          {/* 통계 요약 */}
          <div className="flex gap-4 shrink-0 bg-black/50 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-green-400"><TrendingUpIcon /></span>
              <span className="font-bold text-white">{meme.upvotes}</span>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-gray-300"><UserIcon className="w-5 h-5" /></span>
              <span className="font-bold text-white">{meme.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
