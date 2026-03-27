export default function AdminPanelLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-silver-light/80 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 border border-silver-light bg-off-white">
            <div className="p-6 space-y-3">
              <div className="h-3 w-20 bg-silver-light/90 rounded" />
              <div className="h-8 w-16 bg-silver-light/90 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
