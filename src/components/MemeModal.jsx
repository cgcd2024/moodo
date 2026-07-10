import axios from "axios";
import { useState } from "react";
import CloseIcon from "./icons/CloseIcon";
import UserIcon from "./icons/UserIcon";
import SendIcon from "./icons/SendIcon";
import TrendingUpIcon from "./icons/TrendingUpIcon";
import TrendingDownIcon from "./icons/TrendingDownIcon";

const MemeModal = ({ meme, onClose, onUpdateMeme }) => {
  const [newComment, setNewComment] = useState('');
  const [hasVoted, setHasVoted] = useState(null); // 'up', 'down', null

  if (!meme) return null;

  const totalVotes = meme.upvotes + meme.downvotes;
  const upvotePercent = totalVotes === 0 ? 0 : Math.round((meme.upvotes / totalVotes) * 100);
  const downvotePercent = totalVotes === 0 ? 0 : Math.round((meme.downvotes / totalVotes) * 100);

  const handleVote = async (type) => {
    try {
      const res = await axios.post(
        `http://144.24.81.60:5000/api/posts/${meme._id}/vote`,
        {
          type,
        }
      );

      onUpdateMeme(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://144.24.81.60:5000/api/posts/${meme._id}/comments`,
        {
          author: "익명",
          content: newComment,
        }
      );

      onUpdateMeme(res.data);

      setNewComment("");

    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId) => {
  try {
    const res = await axios.post(
      `http://144.24.81.60:5000/api/posts/${meme._id}/comments/${commentId}/like`
    );

    onUpdateMeme(res.data);

  } catch (err) {
    console.error(err);
  }
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
            <img src={`http://144.24.81.60:5000${meme.imageUrl}`} alt={meme.title} className="w-full h-auto rounded-lg object-contain bg-black max-h-[600px]" />
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
                  <div key={comment._id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-300">
                      <UserIcon />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-gray-200 text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleLikeComment(comment._id)}
                          className="text-sm text-indigo-400 hover:text-indigo-300"
                        >
                          👍 {comment.likeCount}
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

export default MemeModal;