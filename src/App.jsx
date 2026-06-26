import React, { useState, useMemo } from 'react';
import { initialMemes } from "./data/memes";
import SearchIcon from "./components/icons/SearchIcon";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
  </svg>
);

const MemeModal = ({ meme, onClose, onUpdateMeme }) => {
  const [newComment, setNewComment] = useState('');
  const [hasVoted, setHasVoted] = useState(null); // 'up', 'down', null

  if (!meme) return null;

  const totalVotes = meme.upvotes + meme.downvotes;
  const upvotePercent = totalVotes === 0 ? 0 : Math.round((meme.upvotes / totalVotes) * 100);
  const downvotePercent = totalVotes === 0 ? 0 : Math.round((meme.downvotes / totalVotes) * 100);

  const handleVote = (type) => {
    if (hasVoted === type) return; // 이미 같은 투표를 했으면 무시

    let newUpvotes = meme.upvotes;
    let newDownvotes = meme.downvotes;

    if (type === 'up') {
      newUpvotes++;
      if (hasVoted === 'down') newDownvotes--;
    } else {
      newDownvotes++;
      if (hasVoted === 'up') newUpvotes--;
    }

    setHasVoted(type);
    onUpdateMeme({ ...meme, upvotes: newUpvotes, downvotes: newDownvotes });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: '익명 사용자', // 실제 앱에서는 로그인된 사용자 정보 사용
      text: newComment,
      timestamp: '방금 전'
    };

    onUpdateMeme({ ...meme, comments: [...meme.comments, comment] });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      {/* 모달 컨테이너 - 클릭 이벤트 버블링 방지 */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1e1e24] text-gray-200 rounded-xl shadow-2xl flex flex-col hide-scrollbar border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1e1e24]/95 border-b border-gray-700 backdrop-blur">
          <h2 className="text-xl font-bold text-white truncate pr-4">{meme.title}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* 이미지 및 설명 */}
          <div className="space-y-4">
            <img src={meme.imageUrl} alt={meme.title} className="w-full h-auto rounded-lg object-contain bg-black max-h-[600px]" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{meme.description}</p>
          </div>

          {/* 평가 섹션 (첨부 이미지 스타일 반영) */}
          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">이 짤은 어떠셨나요?</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* 긍정적 버튼 */}
              <button 
                onClick={() => handleVote('up')}
                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                  hasVoted === 'up' ? 'bg-[#1a2e25] border border-green-500' : 'bg-[#141418] hover:bg-[#1a1a20] border border-transparent'
                }`}
              >
                <div className={`p-3 rounded-full mb-3 ${hasVoted === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-500'}`}>
                  <TrendingUpIcon />
                </div>
                <span className="text-green-500 font-bold mb-1">긍정적</span>
                <span className="text-green-400 text-sm font-semibold">{upvotePercent}%</span>
              </button>

              {/* 부정적 버튼 */}
              <button 
                onClick={() => handleVote('down')}
                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                  hasVoted === 'down' ? 'bg-[#3a1c22] border border-pink-500' : 'bg-[#141418] hover:bg-[#1a1a20] border border-transparent'
                }`}
              >
                <div className={`p-3 rounded-full mb-3 ${hasVoted === 'down' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-500/10 text-pink-500'}`}>
                  <TrendingDownIcon />
                </div>
                <span className="text-pink-500 font-bold mb-1">부정적</span>
                <span className="text-pink-400 text-sm font-semibold">{downvotePercent}%</span>
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">댓글 <span className="text-indigo-400">{meme.comments.length}개</span></h3>
            </div>
            
            {/* 댓글 목록 */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {meme.comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
              ) : (
                meme.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-300">
                      <UserIcon />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-200 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 댓글 입력창 (하단 고정) */}
        <div className="sticky bottom-0 p-4 bg-[#1e1e24] border-t border-gray-700">
          <form onSubmit={handleAddComment} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
              <UserIcon />
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력해 보세요..."
                className="w-full bg-[#141418] text-gray-200 text-sm md:text-base rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-gray-800"
              />
              <button 
                type="submit" 
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full transition-colors flex items-center justify-center"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function MudoApp() {
  const [memes, setMemes] = useState(initialMemes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 오늘의 무도짤 (랜덤 혹은 특정 짤 지정, 여기서는 0번째 인덱스 고정 예시)
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
    const updatedMemes = memes.map(m => m.id === updatedMeme.id ? updatedMeme : m);
    setMemes(updatedMemes);
    setSelectedMeme(updatedMeme); 
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-200 font-sans selection:bg-indigo-500/30 flex flex-col items-center">
      
      {/* CSS 스타일 추가 (스크롤바 등) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 20px; }
      `}} />

      {/* 헤더 (로고만) */}
      <header className="w-full max-w-7xl px-4 py-6 flex justify-start">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSearchTerm(''); setHasSearched(false);}}>
            {/* 로고 아이콘 (무한도전 느낌의 텍스트 로고) */}
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black text-xl transform -rotate-6">
              무
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">무도<span className="text-yellow-400">짤</span> 저장소</h1>
          </div>
      </header>

      {/* 메인 콘텐츠 영역 (중앙 정렬) */}
      <main className="w-full max-w-5xl px-4 flex flex-col items-center justify-center flex-grow pt-10 pb-20">
        
        {/* 중앙 검색창 영역 */}
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
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-[#1a1a20]/80 backdrop-blur-md text-gray-100 text-lg rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/50 shadow-2xl placeholder-gray-500 transition-all hover:bg-[#1a1a20]"
            />
          </div>
        </div>

        {/* 검색 결과 or 오늘의 짤 표시 영역 */}
        <div className="w-full">
          {!hasSearched ? (
            /* 오늘의 짤 뷰 (큰 이미지) */
            <div className="flex flex-col items-center animate-fade-in-up">
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-6 flex items-center gap-3">
                 <span className="w-8 h-1 bg-yellow-400 rounded-full"></span>
                 오늘의 레전드 짤
                 <span className="w-8 h-1 bg-yellow-400 rounded-full"></span>
              </h3>
              
              <div 
                onClick={() => setSelectedMeme(todayMeme)}
                className="w-full max-w-4xl bg-[#1c1c21] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 cursor-pointer transition-all duration-500 hover:shadow-[0_0_40px_rgba(250,204,21,0.15)] group"
              >
                 <div className="relative aspect-video bg-black overflow-hidden">
                    <img 
                      src="https://i.namu.wiki/i/bMwinvfPVVOg2B2-F6_Oyf-_LN7SlaxoRJipamUTKMyEWZtfcrmjfLKElsPOMLVUnYpH6AfI2pShVowyk9D60QaYBWUAKpTZelL2cJReuQqYOLZ-8zB7cN3UXXSb9F2cRM3VOPiC88OSZ2bL3OOKWQ.webp"
                      alt={todayMeme.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    {/* 오버레이 그라데이션 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c21] via-transparent to-transparent"></div>
                 </div>
                 <div className="p-8 md:p-10 -mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <h4 className="text-3xl md:text-4xl font-black text-white mb-3 group-hover:text-yellow-400 transition-colors drop-shadow-md">
                        {todayMeme.title}
                      </h4>
                      <p className="text-gray-300 text-base md:text-lg max-w-2xl">
                        {todayMeme.description}
                      </p>
                    </div>
                    
                    {/* 통계 요약 (오늘의 짤) */}
                    <div className="flex gap-4 shrink-0 bg-[#0f0f13]/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-800">
                      <div className="flex flex-col items-center px-2">
                        <span className="text-green-400 text-sm mb-1"><TrendingUpIcon/></span>
                        <span className="font-bold text-white">{todayMeme.upvotes}</span>
                      </div>
                      <div className="w-px bg-gray-700"></div>
                      <div className="flex flex-col items-center px-2">
                        <span className="text-gray-400 text-sm mb-1"><UserIcon className="w-5 h-5"/></span>
                        <span className="font-bold text-white">{todayMeme.comments.length}</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            /* 검색 결과 리스트 뷰 */
            <div className="animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  "<span className="text-yellow-400">{searchTerm}</span>" 검색 결과
                </h3>
                <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">
                  {filteredMemes.length}건
                </span>
              </div>

              {filteredMemes.length === 0 ? (
                <div className="text-center py-20 bg-[#1c1c21] rounded-3xl border border-gray-800 border-dashed">
                  <div className="text-6xl mb-4">🥲</div>
                  <p className="text-xl text-gray-400 font-medium">검색 결과가 없쒀요!!</p>
                  <p className="text-sm text-gray-500 mt-2">다른 검색어로 다시 시도해보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMemes.map((meme) => (
                    <div 
                      key={meme.id}
                      onClick={() => setSelectedMeme(meme)}
                      className="group flex flex-col bg-[#1c1c21] rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    >
                      {/* 썸네일 */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
                        <img 
                          src={meme.imageUrl} 
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
                           <span className="flex items-center gap-1 text-green-500/80"><TrendingUpIcon/> {meme.upvotes}</span>
                           <span className="flex items-center gap-1"><UserIcon className="w-4 h-4"/> {meme.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 모달 렌더링 */}
      {selectedMeme && (
        <MemeModal 
          meme={selectedMeme} 
          onClose={() => setSelectedMeme(null)} 
          onUpdateMeme={handleUpdateMeme}
        />
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />

    </div>
  );
}