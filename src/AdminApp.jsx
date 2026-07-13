import { useState, useEffect, useRef, useCallback } from "react";
import { api, imageUrl } from "./lib/api";

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

  // 업로드 폼 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  // 파일 선택/드롭 공통 처리
  const acceptFile = (f) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
      setMessage({ type: "error", text: "JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다." });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "10MB 이하의 이미지만 업로드할 수 있습니다." });
      return;
    }
    setFile(f);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !file) {
      setMessage({ type: "error", text: "제목, 설명, 이미지를 모두 입력해주세요." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file);

      const res = await api.post("/posts", formData);

      setPosts((prev) => [res.data, ...prev]);
      resetForm();
      setMessage({ type: "success", text: `"${res.data.title}" 업로드 완료!` });
    } catch (err) {
      console.error(err);
      const text =
        err.response?.data?.message ??
        "업로드에 실패했습니다. 서버에 업로드 API가 배포되어 있는지 확인해주세요.";
      setMessage({ type: "error", text });
    } finally {
      setSubmitting(false);
    }
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
            <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black text-lg transform -rotate-6">
              무
            </div>
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

      <main className="w-full max-w-5xl mx-auto px-4 py-10 space-y-12">
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

        {/* 업로드 섹션 */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">새 짤 업로드</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 이미지 드롭존 */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center min-h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
                dragging
                  ? "border-yellow-400 bg-yellow-400/5"
                  : "border-gray-700 bg-[#1c1c21] hover:border-gray-500"
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="미리보기" className="absolute inset-0 w-full h-full object-contain bg-black" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm text-xs">
                    <span className="truncate text-gray-300">{file?.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="ml-3 shrink-0 text-red-400 hover:text-red-300 font-semibold"
                    >
                      제거
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-300 font-medium">이미지를 끌어다 놓거나 클릭해서 선택</p>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF, WEBP · 최대 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </div>

            {/* 텍스트 입력 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예) 무야호~"
                  className="w-full bg-[#1c1c21] text-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/60 placeholder-gray-600"
                />
              </div>

              <div className="flex-grow flex flex-col">
                <label className="block text-sm font-semibold text-gray-400 mb-2">설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="짤에 대한 설명을 적어주세요. 어떤 에피소드의 어떤 장면인지!"
                  rows={5}
                  className="w-full flex-grow bg-[#1c1c21] text-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/60 placeholder-gray-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold text-base transition-colors"
              >
                {submitting ? "업로드 중..." : "짤 업로드"}
              </button>
            </div>
          </form>
        </section>

        {/* 게시글 관리 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">게시글 관리</h2>
            <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">
              {posts.length}개
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-[#1c1c21] border border-gray-800 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-[#1c1c21] rounded-2xl border border-gray-800 border-dashed">
              <p className="text-gray-500">아직 게시글이 없습니다. 위에서 첫 짤을 올려보세요!</p>
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
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400 shrink-0">
                    <span>추천 {post.upvotes}</span>
                    <span>비추천 {post.downvotes}</span>
                    <span>댓글 {post.comments?.length ?? 0}</span>
                    <span className="text-gray-600">{formatDate(post.createdAt)}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(post)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-sm font-semibold transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
