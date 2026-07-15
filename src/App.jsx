import { useState, useMemo, useEffect, useCallback } from "react";

import { api } from "./lib/api";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import TodayMeme from "./components/TodayMeme";
import MemeCarousel from "./components/MemeCarousel";
import MemeGrid from "./components/MemeGrid";
import MemeModal from "./components/MemeModal";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden border border-gray-800 bg-[#1c1c21] animate-pulse">
          <div className="aspect-[4/3] bg-gray-800/60" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-2/3 bg-gray-800/60 rounded" />
            <div className="h-4 w-full bg-gray-800/40 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorPanel({ onRetry }) {
  return (
    <div className="text-center py-20 bg-[#1c1c21] rounded-3xl border border-gray-800 border-dashed">
      <p className="text-xl text-gray-300 font-medium">짤 서버가 잠시 쉬는 중이에요</p>
      <p className="text-sm text-gray-500 mt-2">네트워크 상태를 확인하고 다시 시도해주세요.</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2.5 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors"
      >
        다시 불러오기
      </button>
    </div>
  );
}

export default function MudoApp() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchMemes = useCallback(() => {
    api.get("/posts")
      .then((res) => {
        setMemes(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  // 공유 딥링크: #/meme/<id>로 진입하면 해당 짤 모달을 연다
  useEffect(() => {
    const openFromHash = () => {
      const match = window.location.hash.match(/^#\/meme\/([0-9a-f]{24})$/i);
      if (!match) return;
      const target = memes.find((m) => m._id === match[1]);
      if (target) setSelectedMeme(target);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [memes]);

  const handleCloseModal = () => {
    setSelectedMeme(null);
    // 딥링크로 열린 상태였다면 주소를 원래대로
    if (window.location.hash.startsWith("#/meme/")) {
      history.replaceState(null, "", "#/");
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    fetchMemes();
  };

  // 오늘의 무도짤 (최신 글)
  const todayMeme = useMemo(() => memes[0], [memes]);

  // 인기 짤 (추천순 상위 10개)
  const popularMemes = useMemo(
    () => [...memes].sort((a, b) => b.upvotes - a.upvotes).slice(0, 10),
    [memes]
  );

  // 검색 필터링
  const filteredMemes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return memes.filter(
      (meme) =>
        meme.title.toLowerCase().includes(lowercasedTerm) ||
        meme.description.toLowerCase().includes(lowercasedTerm) ||
        (meme.tags ?? "").toLowerCase().includes(lowercasedTerm)
    );
  }, [memes, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setHasSearched(e.target.value.trim().length > 0);
  };

  const handleUpdateMeme = (updatedMeme) => {
    setMemes((prev) => prev.map((m) => (m._id === updatedMeme._id ? updatedMeme : m)));
    setSelectedMeme(updatedMeme);
  };

  return (
    <div className="relative min-h-screen bg-[#0f0f13] text-gray-200 font-sans selection:bg-yellow-400/30 flex flex-col items-center overflow-x-hidden">
      {/* 상단 은은한 글로우 */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[480px] bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.07),transparent_60%)]" />

      <Header
        onLogoClick={() => {
          setSearchTerm("");
          setHasSearched(false);
        }}
      />

      <main className="relative w-full max-w-5xl px-4 flex flex-col items-center flex-grow pt-6 pb-16">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          hasSearched={hasSearched}
          suggestions={filteredMemes}
          onSelectSuggestion={setSelectedMeme}
        />

        <div className="w-full">
          {loading ? (
            <GridSkeleton />
          ) : error ? (
            <ErrorPanel onRetry={handleRetry} />
          ) : !hasSearched ? (
            <div className="space-y-16">
              <TodayMeme meme={todayMeme} onClick={() => setSelectedMeme(todayMeme)} />

              <MemeCarousel memes={popularMemes} onMemeClick={setSelectedMeme} />

              {/* 전체 짤 그리드 */}
              <section className="animate-fade-in">
                <div className="mb-6 flex items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-white">전체 무도짤</h3>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">
                    {memes.length}개
                  </span>
                </div>
                <MemeGrid memes={memes} onMemeClick={setSelectedMeme} />
              </section>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  "<span className="text-yellow-400">{searchTerm}</span>" 검색 결과
                </h3>

                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">
                  {filteredMemes.length}건
                </span>
              </div>

              <MemeGrid memes={filteredMemes} onMemeClick={setSelectedMeme} />
            </div>
          )}
        </div>
      </main>

      <footer className="relative w-full border-t border-gray-800/60 py-8 mt-auto">
        <p className="text-center text-sm text-gray-600">
          무도짤 저장소 — 무한도전의 레전드 순간들을 한곳에
        </p>
      </footer>

      {selectedMeme && (
        <MemeModal
          meme={selectedMeme}
          onClose={handleCloseModal}
          onUpdateMeme={handleUpdateMeme}
        />
      )}
    </div>
  );
}
