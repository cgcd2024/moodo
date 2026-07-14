import { useState, useEffect, useCallback } from "react";
import { api, imageUrl } from "./lib/api";
import Logo from "./components/Logo";
import PostFormModal from "./components/PostFormModal";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function AdminApp() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }

  // 등록/수정 모달 상태: null | { mode: 'create' } | { mode: 'edit', post }
  const [modal, setModal] = useState(null);

  const fetchPosts = useCallback(() => {
    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error(err);
        setMessage({ type: "error", text: "게시글 목록을 불러오지 못했습니다." });
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleModalSuccess = (post, mode) => {
    if (mode === "create") {
      setPosts((prev) => [post, ...prev]);
      setMessage({ type: "success", text: `"${post.title}" 등록 완료` });
    } else {
      setPosts((prev) => prev.map((p) => (p._id === post._id ? post : p)));
      setMessage({ type: "success", text: `"${post.title}" 수정 완료` });
    }
    setModal(null);
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`"${post.title}" 게시글을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`)) return;

    try {
      await api.delete(`/posts/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      setMessage({ type: "success", text: `"${post.title}" 삭제 완료` });
    } catch (err) {
      console.error(err);
      const text =
        err.response?.data?.message ??
        "삭제에 실패했습니다. 서버에 삭제 API가 배포되어 있는지 확인해주세요.";
      setMessage({ type: "error", text });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-200 font-sans">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 w-full flex justify-center bg-[#0f0f13]/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="w-full max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-9 h-9 transform -rotate-6" />
            <h1 className="text-xl font-black tracking-tight text-white">
              무도<span className="text-yellow-400">짤</span> 관리자
            </h1>
            <span className="ml-2 px-2 py-0.5 rounded-md bg-red-500/15 text-red-400 text-xs font-bold border border-red-500/30">
              ADMIN
            </span>
          </div>

          <a href="#/" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors font-medium">
            ← 사이트로 돌아가기
          </a>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* 알림 메시지 */}
        {message && (
          <div
            className={`px-4 py-3 rounded-xl text-sm font-medium border animate-fade-in ${
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* 짤 목록 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">짤 목록</h2>
              <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">
                {posts.length}개
              </span>
            </div>

            <button
              onClick={() => setModal({ mode: "create" })}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-sm font-bold transition-colors"
            >
              + 새 짤 등록
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-[#1c1c21] border border-gray-800 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-[#1c1c21] rounded-2xl border border-gray-800 border-dashed">
              <p className="text-gray-500">아직 게시글이 없습니다. 첫 짤을 등록해보세요!</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
              {posts.map((post) => (
                <div key={post._id} className="flex items-center gap-4 p-4 bg-[#1c1c21] hover:bg-[#22222a] transition-colors">
                  <img
                    src={imageUrl(post.imageUrl)}
                    alt={post.title}
                    className="w-20 h-14 object-cover rounded-lg border border-gray-700 shrink-0 bg-black"
                  />

                  <div className="min-w-0 flex-grow">
                    <p className="font-bold text-white truncate">{post.title}</p>
                    <p className="text-sm text-gray-500 truncate">{post.description}</p>
                    {post.tags?.trim() && (
                      <p className="text-xs text-yellow-400/70 truncate mt-0.5">태그: {post.tags}</p>
                    )}
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400 shrink-0">
                    <span>추천 {post.upvotes}</span>
                    <span>비추천 {post.downvotes}</span>
                    <span>댓글 {post.comments?.length ?? 0}</span>
                    <span className="text-gray-600">{formatDate(post.createdAt)}</span>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setModal({ mode: "edit", post })}
                      className="px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600 text-sm font-semibold transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-sm font-semibold transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 등록/수정 모달 */}
      {modal && (
        <PostFormModal
          mode={modal.mode}
          post={modal.post}
          onClose={() => setModal(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
