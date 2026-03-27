export default function AdminPodesavanjaLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-44 bg-silver-light/80 rounded" />
      <div className="h-4 w-full max-w-xl bg-silver-light/60 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-52 border border-silver-light bg-off-white" />
        <div className="h-52 border border-silver-light bg-off-white" />
      </div>
    </div>
  );
}
