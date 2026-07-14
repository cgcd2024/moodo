import { useState, useEffect, useRef } from "react";
import { api, imageUrl } from "../lib/api";
import CloseIcon from "./icons/CloseIcon";

// 관리자 게시글 등록/수정 모달
// mode: "create" | "edit" — 수정 시에는 이미지 교체 불가(제목/태그/설명만)
export default function PostFormModal({ mode, post, onClose, onSuccess }) {
  const isEdit = mode === "edit";

  const [title, setTitle] = useState(post?.title ?? "");
  const [tags, setTags] = useState(post?.tags ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(isEdit ? imageUrl(post.imageUrl) : null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Esc로 닫기 + 배경 스크롤 잠금
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

  const acceptFile = (f) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
      setError("JPEG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("10MB 이하의 이미지만 업로드할 수 있습니다.");
      return;
    }
    setFile(f);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || (!isEdit && !file)) {
      setError(isEdit ? "제목과 설명은 비워둘 수 없습니다." : "제목, 설명, 이미지를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let res;

      if (isEdit) {
        res = await api.put(`/posts/${post._id}`, { title, description, tags });
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("image", file);
        res = await api.post("/posts", formData);
      }

      onSuccess(res.data, mode);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ??
          `${isEdit ? "수정" : "등록"}에 실패했습니다. 서버 API 배포 상태를 확인해주세요.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh] overflow-y-auto bg-[#1e1e24] text-gray-200 rounded-none sm:rounded-xl shadow-2xl flex flex-col hide-scrollbar border-0 sm:border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1e1e24]/95 border-b border-gray-700 backdrop-blur">
          <h2 className="text-xl font-bold text-white">{isEdit ? "짤 수정" : "새 짤 등록"}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/30">
              {error}
            </div>
          )}

          {/* 이미지 영역 */}
          {isEdit ? (
            <div>
              <img
                src={preview}
                alt={title}
                className="w-full max-h-64 object-contain rounded-xl bg-black border border-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">이미지는 수정할 수 없습니다.</p>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); acceptFile(e.dataTransfer.files?.[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center min-h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors overflow-hidden ${
                dragging
                  ? "border-yellow-400 bg-yellow-400/5"
                  : "border-gray-700 bg-[#141418] hover:border-gray-500"
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
                <div className="text-center p-6">
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
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 무야호~"
              className="w-full bg-[#141418] text-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/60 placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              태그 <span className="text-gray-600 font-normal">(검색용, 쉼표로 구분 — 게시글에는 표시되지 않음)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예) 명수옹, 화남, 일하기 싫을때"
              className="w-full bg-[#141418] text-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/60 placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="짤에 대한 설명을 적어주세요. 어떤 에피소드의 어떤 장면인지!"
              rows={4}
              className="w-full bg-[#141418] text-gray-100 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-400/80 border border-gray-700/60 placeholder-gray-600 resize-none"
            />
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-semibold transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-black text-sm font-bold transition-colors"
            >
              {submitting ? (isEdit ? "저장 중..." : "등록 중...") : isEdit ? "저장" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
