"use client";

interface ToggleSwitchProps {
    id: string;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

/**
 * Custom styled toggle switch replacing browser checkbox defaults.
 * Provides a premium, consistent look across all editors.
 */
export default function ToggleSwitch({
    id,
    label,
    description,
    checked,
    onChange,
}: ToggleSwitchProps) {
    return (
        <label
            htmlFor={id}
            className={`
                flex items-center gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200
                ${checked
                    ? "bg-[#002FA7]/[0.03] border-[#002FA7]/20"
                    : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                }
            `}
        >
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-700">{label}</div>
                {description && (
                    <div className="text-[11px] text-gray-400 mt-0.5">{description}</div>
                )}
            </div>

            {/* Toggle track */}
            <div className="relative flex-shrink-0">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className={`
                    w-11 h-6 rounded-full transition-colors duration-200
                    ${checked ? "bg-[#002FA7]" : "bg-gray-200"}
                `} />
                <div className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                    ${checked ? "translate-x-[22px]" : "translate-x-0.5"}
                `} />
            </div>
        </label>
    );
}
