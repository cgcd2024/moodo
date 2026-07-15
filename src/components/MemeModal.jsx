import { useState, useEffect } from "react";
import { api, imageUrl } from "../lib/api";
import CloseIcon from "./icons/CloseIcon";
import UserIcon from "./icons/UserIcon";
import SendIcon from "./icons/SendIcon";
import TrendingUpIcon from "./icons/TrendingUpIcon";
import TrendingDownIcon from "./icons/TrendingDownIcon";

// createdAt을 "N분 전" 형태로 변환
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMin = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay}일 전`;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

const MemeModal = ({ meme, onClose, onUpdateMeme }) => {
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  // 투표 여부를 localStorage에 기록해 재투표 방지
  const [hasVoted, setHasVoted] = useState(() =>
    localStorage.getItem(`moodo-voted-${meme?._id}`)
  );
  // 댓글 좋아요도 댓글당 1회로 제한
  const [likedComments, setLikedComments] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(`moodo-comment-likes-${meme?._id}`) ?? "[]"));
    } catch {
      return new Set();
    }
  });

  // Esc로 닫기 + 모달이 떠 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!meme) return null;

  const totalVotes = meme.upvotes + meme.downvotes;
  const upvotePercent = totalVotes === 0 ? 0 : Math.round((meme.upvotes / totalVotes) * 100);
  const downvotePercent = totalVotes === 0 ? 0 : Math.round((meme.downvotes / totalVotes) * 100);

  // 공유: Web Share API(모바일 OS 공유 시트, HTTPS 필요) 우선, 미지원 시 링크 복사
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/meme/${meme._id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `무도짤 저장소 — ${meme.title}`, url: shareUrl });
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // 사용자가 공유 시트를 닫음
      }
    }

    // http 환경이나 clipboard API 거부 시에도 동작하는 레거시 복사
    const legacyCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        legacyCopy();
      }
    } catch {
      legacyCopy();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async (type) => {
    if (hasVoted) return;

    try {
      const res = await api.post(`/posts/${meme._id}/vote`, { type });

      localStorage.setItem(`moodo-voted-${meme._id}`, type);
      setHasVoted(type);
      onUpdateMeme(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      // author를 보내지 않으면 서버가 랜덤 닉네임을 생성한다
      const res = await api.post(`/posts/${meme._id}/comments`, {
        content: newComment,
      });

      onUpdateMeme(res.data);
      setNewComment("");

    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (likedComments.has(commentId)) return;

    try {
      const res = await api.post(`/posts/${meme._id}/comments/${commentId}/like`);

      const next = new Set(likedComments).add(commentId);
      setLikedComments(next);
      localStorage.setItem(`moodo-comment-likes-${meme._id}`, JSON.stringify([...next]));

      onUpdateMeme(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      {/* 모달 컨테이너 - 클릭 이벤트 버블링 방지, 모바일에서는 전체 화면 */}
      <div
        className="relative w-full max-w-3xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto bg-[#1e1e24] text-gray-200 rounded-none sm:rounded-xl shadow-2xl flex flex-col hide-scrollbar border-0 sm:border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1e1e24]/95 border-b border-gray-700 backdrop-blur">
          <h2 className="text-xl font-bold text-white truncate pr-4">{meme.title}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                copied
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-700/60 text-gray-200 hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {copied ? "링크 복사됨" : "공유"}
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* 본문 콘텐츠 */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* 이미지 및 설명 */}
          <div className="space-y-4">
            <img src={imageUrl(meme.imageUrl)} alt={meme.title} className="w-full h-auto rounded-lg object-contain bg-black max-h-[600px]" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{meme.description}</p>
          </div>

          {/* 평가 섹션 */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-lg font-bold text-white">이 짤은 어떠셨나요?</h3>
              {hasVoted && <span className="text-xs text-gray-500">투표 완료</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* 긍정적 버튼 */}
              <button
                onClick={() => handleVote('up')}
                disabled={!!hasVoted}
                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                  hasVoted === 'up' ? 'bg-[#1a2e25] border border-green-500' : 'bg-[#141418] border border-transparent'
                } ${hasVoted ? 'cursor-default' : 'hover:bg-[#1a1a20] cursor-pointer'} ${hasVoted && hasVoted !== 'up' ? 'opacity-40' : ''}`}
              >
                <div className={`p-3 rounded-full mb-3 ${hasVoted === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-500'}`}>
                  <TrendingUpIcon />
                </div>
                <span className="text-green-500 font-bold mb-1">긍정적</span>
                <span className="text-green-400 text-sm font-semibold">{upvotePercent}% · {meme.upvotes}표</span>
              </button>

              {/* 부정적 버튼 */}
              <button
                onClick={() => handleVote('down')}
                disabled={!!hasVoted}
                className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                  hasVoted === 'down' ? 'bg-[#3a1c22] border border-pink-500' : 'bg-[#141418] border border-transparent'
                } ${hasVoted ? 'cursor-default' : 'hover:bg-[#1a1a20] cursor-pointer'} ${hasVoted && hasVoted !== 'down' ? 'opacity-40' : ''}`}
              >
                <div className={`p-3 rounded-full mb-3 ${hasVoted === 'down' ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-500/10 text-pink-500'}`}>
                  <TrendingDownIcon />
                </div>
                <span className="text-pink-500 font-bold mb-1">부정적</span>
                <span className="text-pink-400 text-sm font-semibold">{downvotePercent}% · {meme.downvotes}표</span>
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">댓글 <span className="text-yellow-400">{meme.comments.length}개</span></h3>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {meme.comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">첫 번째 댓글을 남겨보세요!</p>
              ) : (
                meme.comments.map(comment => (
                  <div key={comment._id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400">
                      <UserIcon />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-200 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          disabled={likedComments.has(comment._id)}
                          className={`text-sm transition-colors ${
                            likedComments.has(comment._id)
                              ? "text-yellow-400 cursor-default"
                              : "text-gray-400 hover:text-yellow-400"
                          }`}
                        >
                          추천 {comment.likeCount}
                        </button>
                      </div>
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
                className="w-full bg-[#141418] text-gray-200 text-base rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-yellow-400 border border-gray-800"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-black rounded-full transition-colors flex items-center justify-center"
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

export default MemeModal;
