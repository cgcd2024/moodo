import React from 'react';
import TrendingUpIcon from "./icons/TrendingUpIcon";
import UserIcon from "./icons/UserIcon";

export default function MemeCard({ meme, onClick }) {
  if (!meme) return null;

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-[#1c1c21] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* 썸네일 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
        <img 
          src={`http://localhost:5000${meme.imageUrl}`}
          alt={meme.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c21] to-transparent opacity-60"></div>
      </div>
      
      {/* 텍스트 영역 */}
      <div className="p-5 flex flex-col flex-grow relative -mt-4 bg-[#1c1c21] z-10">
        <h4 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-yellow-400 transition-colors">
          {meme.title}
        </h4>
        <p className="text-sm text-gray-400 line-clamp-2 mt-auto mb-4">
          {meme.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-t border-gray-800 pt-3">
            <span className="flex items-center gap-1 text-green-500/80">
              <TrendingUpIcon/> {meme.upvotes}
            </span>
            <span className="flex items-center gap-1">
              <UserIcon className="w-4 h-4"/> {meme.comments.length}
            </span>
        </div>
      </div>
    </div>
  );
}