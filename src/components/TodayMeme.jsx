import React from 'react';
import TrendingUpIcon from "./icons/TrendingUpIcon";
import UserIcon from "./icons/UserIcon";

export default function TodayMeme({ meme, onClick }) {
  // 데이터가 로드되지 않았을 경우 에러 방지
  if (!meme) return null; 

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-6 flex items-center gap-3">
        <span className="w-8 h-1 bg-yellow-400 rounded-full"></span>
        오늘의 무도짤
        <span className="w-8 h-1 bg-yellow-400 rounded-full"></span>
      </h3>
      
      <div 
        onClick={onClick}
        className="w-full max-w-4xl bg-[#1c1c21] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.15)] group"
      >
        <div className="relative aspect-video bg-black overflow-hidden">
          {/* 하드코딩되었던 주소 대신 전달받은 데이터의 URL을 사용합니다 */}
          <img 
            src={`http://144.24.81.60:5000${meme.imageUrl}`}
            alt={meme.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          {/* 오버레이 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c21] via-transparent to-transparent"></div>
        </div>
        
        <div className="p-8 md:p-10 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-yellow-400 transition-colors drop-shadow-md">
              {meme.title}
            </h4>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl">
              {meme.description}
            </p>
          </div>
          
          {/* 통계 요약 */}
          <div className="flex gap-4 shrink-0 bg-[#0f0f13]/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
            <div className="flex flex-col items-center px-2">
              <span className="text-green-400 text-sm mb-1"><TrendingUpIcon/></span>
              <span className="font-bold text-white">{meme.upvotes}</span>
            </div>
            <div className="w-px bg-gray-700"></div>
            <div className="flex flex-col items-center px-2">
              <span className="text-gray-400 text-sm mb-1"><UserIcon className="w-5 h-5"/></span>
              <span className="font-bold text-white">{meme.comments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}