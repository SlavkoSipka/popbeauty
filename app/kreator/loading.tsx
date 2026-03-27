export default function KreatorLoading() {
  return (
    <main className="section-padding py-16 max-w-[900px] mx-auto px-6">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-64 bg-silver-light/80 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 border border-silver-light bg-off-white" />
          ))}
        </div>
        <div className="h-48 border border-silver-light bg-off-white" />
      </div>
    </main>
  );
}
