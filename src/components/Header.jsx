export default function Header({ onLogoClick }) {
  return (
    <header className="sticky top-0 z-40 w-full flex justify-center bg-[#0f0f13]/80 backdrop-blur-md border-b border-gray-800/60">
      <div className="w-full max-w-5xl px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black text-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
            무
          </div>

          <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
            무도<span className="text-yellow-400">짤</span> 저장소
          </h1>
        </div>

        <span className="hidden sm:block text-xs text-gray-500 font-medium">
          무한도전 레전드 아카이브
        </span>
      </div>
    </header>
  );
}
