import React, {
    useState,
    useMemo,
    useEffect
} from "react";

import axios from "axios";
//import { initialMemes } from "./data/memes";
import MemeModal from "./components/MemeModal";
import Header from "./components/Header";
import TodayMeme from "./components/TodayMeme";
import MemeGrid from "./components/MemeGrid"; 
import SearchBar from "./components/SearchBar"; 

export default function MudoApp() {
  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
        .then(res => {
            setMemes(res.data);
        })
        .catch(err => {
            console.error(err);
        });
}, []);

  const [memes, setMemes] = useState([]);
  //const [memes, setMemes] = useState(initialMemes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 오늘의 무도짤
  const todayMeme = useMemo(() => memes[0], [memes]);

  // 검색 필터링
  const filteredMemes = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowercasedTerm = searchTerm.toLowerCase();
    return memes.filter(
      meme => 
        meme.title.toLowerCase().includes(lowercasedTerm) || 
        meme.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [memes, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setHasSearched(e.target.value.trim().length > 0);
  };

  const handleUpdateMeme = (updatedMeme) => {
    const updatedMemes = memes.map(m =>
    m._id === updatedMeme._id ? updatedMeme : m);
    setMemes(updatedMemes);
    setSelectedMeme(updatedMeme); 
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-200 font-sans selection:bg-indigo-500/30 flex flex-col items-center">

      <Header
        onLogoClick={() => {
            setSearchTerm("");
            setHasSearched(false);
        }}
      />

      <main className="w-full max-w-5xl px-4 flex flex-col items-center justify-center flex-grow pt-10 pb-20">
        
        <SearchBar 
          value={searchTerm} 
          onChange={handleSearchChange} 
          hasSearched={hasSearched} 
        />

        {/* 결과 표시 영역 */}
        <div className="w-full">
          {!hasSearched ? (
            <TodayMeme 
              meme={todayMeme} 
              onClick={() => setSelectedMeme(todayMeme)} 
            />
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

              <MemeGrid 
                memes={filteredMemes} 
                onMemeClick={setSelectedMeme} 
              />
              
            </div>
          )}
        </div>
      </main>

      {selectedMeme && (
        <MemeModal 
          meme={selectedMeme} 
          onClose={() => setSelectedMeme(null)} 
          onUpdateMeme={handleUpdateMeme}
        />
      )}

    </div>
  );
}