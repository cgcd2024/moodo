import React from 'react';
import SearchIcon from "./icons/SearchIcon";

export default function SearchBar({ value, onChange, hasSearched }) {
  return (
    <div className={`w-full max-w-2xl transition-all duration-500 ease-in-out ${hasSearched ? 'mb-12' : 'mb-20 mt-10'}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
        기억나는 <span className="text-yellow-400">무도 짤</span>이 있나요?
      </h2>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-400 transition-colors">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="아..아쉬워라, 저희 모친이 개를 키우십니다, 인절미 생강차! 등 검색"
          value={value}
          onChange={onChange}
          className="w-full bg-[#1a1a20]/80 backdrop-blur-md text-gray-100 text-lg rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/50 shadow-2xl placeholder-gray-500 transition-all hover:bg-[#1a1a20]"
        />
      </div>
    </div>
  );
}