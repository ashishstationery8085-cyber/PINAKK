export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="loading-spinner" />
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Loading PINAKK</p>
      </div>
    </div>
  );
}
