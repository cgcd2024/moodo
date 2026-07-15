import { useState } from "react";
import { imageUrl } from "../lib/api";
import SearchIcon from "./icons/SearchIcon";

export default function SearchBar({ value, onChange, hasSearched, suggestions = [], onSelectSuggestion }) {
  const [focused, setFocused] = useState(false);

  const showDropdown = focused && value.trim().length > 0 && suggestions.length > 0;

  return (
    <div className={`w-full max-w-2xl transition-all duration-500 ease-in-out ${hasSearched ? "mb-10" : "mb-14 mt-6"}`}>
      {!hasSearched && (
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg animate-fade-in">
          기억나는 <span className="text-yellow-400">무도 짤</span>이 있나요?
        </h2>
      )}
      <div className="relative w-full group">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="검색어를 입력하세요."
          className="w-full bg-[#1a1a20]/80 backdrop-blur-md text-gray-100 text-base md:text-lg rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/50 shadow-2xl placeholder-gray-600 transition-all hover:bg-[#1a1a20]"
        />
        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-yellow-400 transition-colors">
          <SearchIcon />
        </div>

        {/* 검색 자동완성 드롭다운 */}
        {showDropdown && (
          <div className="absolute top-full inset-x-0 mt-2 z-30 rounded-2xl border border-gray-700/60 bg-[#1a1a20]/95 backdrop-blur-md shadow-2xl overflow-hidden animate-fade-in">
            {suggestions.slice(0, 6).map((meme) => (
              <button
                type="button"
                key={meme._id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelectSuggestion?.(meme)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-yellow-400/10 transition-colors"
              >
                <img
                  src={imageUrl(meme.imageUrl)}
                  alt={meme.title}
                  className="w-12 h-8 object-cover rounded-md border border-gray-700 shrink-0 bg-black"
                />
                <span className="truncate text-sm text-gray-200">{meme.title}</span>
                <span className="ml-auto text-xs text-gray-500 shrink-0">추천 {meme.upvotes}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
