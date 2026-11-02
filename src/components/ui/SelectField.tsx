import { Icon } from "./Icon";

export function SelectField({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: string[];
}) {
  return (
    // Ganti 'flex-1' dengan 'w-full md:w-52 shrink-0'
    <label className="relative block w-full shrink-0 md:w-52">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none truncate rounded-xl border border-slate-200 bg-white pl-4 pr-9 text-sm font-semibold text-slate-700 outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-3.5 text-slate-400">
        <Icon name="arrowDown" size="size-4" />
      </span>
    </label>
  );
}
