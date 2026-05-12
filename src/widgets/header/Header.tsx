export function Header() {
  return (
    <header className="border-b border-slate-200/60 bg-white/60 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="날씨 아이콘" className="h-11 w-11" />
          <span className="text-lg font-bold text-slate-900">Weather App</span>
        </div>
        <p className="hidden text-sm text-slate-400 sm:block">
          대한민국 행정구역 날씨 조회
        </p>
      </div>
    </header>
  );
}
