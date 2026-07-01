export default function Header({ onLogoClick }) {
  return (
    <header className="w-full max-w-7xl px-4 py-6 flex justify-start">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onLogoClick}
      >
        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-black text-black text-xl transform -rotate-6">
          무
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          무도<span className="text-yellow-400">짤</span> 저장소
        </h1>
      </div>
    </header>
  );
}