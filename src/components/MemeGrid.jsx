import MemeCard from './MemeCard';

export default function MemeGrid({ memes, onMemeClick }) {
  // 검색 결과가 없을 때 보여줄 UI
  if (memes.length === 0) {
    return (
      <div className="text-center py-20 bg-[#1c1c21] rounded-3xl border border-gray-800 border-dashed">
        <div className="text-6xl mb-4">🥲</div>
        <p className="text-xl text-gray-400 font-medium">검색 결과가 없쒀요!!</p>
        <p className="text-sm text-gray-500 mt-2">다른 검색어로 다시 시도해보세요.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes.map((meme) => (
        <MemeCard
          key={meme._id}
          meme={meme}
          onClick={() => onMemeClick(meme)}
        />
      ))}
    </div>
  );
}
