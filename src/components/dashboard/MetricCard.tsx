export default function MetricCard({
  title,
  value,
}: {
  title: string;
  value:
    | string
    | number;
}) {
  return (
    <div
      className="
      rounded-xl
      bg-slate-900
      p-4
      border
      border-slate-700
    "
    >
      <div className="text-slate-400 text-sm">
        {title}
      </div>

      <div className="text-3xl font-bold text-white mt-2">
        {value}
      </div>
    </div>
  );
}