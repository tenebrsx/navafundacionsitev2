import Link from "next/link";
import { Plus, ChevronLeft, Save } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description: string | React.ReactNode;
    actionLabel?: string;
    actionHref?: string;
    children?: React.ReactNode;
    backHref?: string;
    sticky?: boolean;
}

export function PageHeader({ title, description, actionLabel, actionHref, children, backHref, sticky = false }: PageHeaderProps) {
    return (
        <div className={`
            flex justify-between items-end mb-8 border-b border-gray-200 pb-6 transition-all duration-300
            ${sticky ? "sticky top-0 bg-[#F0F0F2]/90 backdrop-blur-xl z-30 px-8 py-6 -mx-8 shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border-gray-200/60 supports-[backdrop-filter]:bg-[#F0F0F2]/70" : "px-8 md:px-12 pt-12"}
        `}>
            <div>
                {backHref && (
                    <Link href={backHref} className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider mb-2 transition-colors">
                        <ChevronLeft size={12} />
                        Back
                    </Link>
                )}
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none">{title}</h1>
                <p className="text-slate-500 mt-2 font-medium text-sm">{description}</p>
            </div>
            <div className="flex items-center gap-3">
                {children}
                {actionLabel && actionHref && (
                    <Link
                        href={actionHref}
                        className="flex items-center gap-2 bg-[#002FA7] text-white px-5 py-2.5 rounded-lg font-bold uppercase text-xs hover:bg-[#001f7a] transition shadow-lg shadow-[#002FA7]/20 active:scale-95 duration-200"
                    >
                        <Plus size={16} />
                        {actionLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const isPublished = status === "published";
    return (
        <span className={`
            px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-2 w-fit
            ${isPublished
                ? "bg-[#002FA7]/5 text-[#002FA7] border-[#002FA7]/20"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
            }
        `}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPublished ? "bg-[#002FA7]" : "bg-amber-500"}`}></span>
            {status || "draft"}
        </span>
    );
}

interface FormActionsProps {
    loading: boolean;
    onCancel: () => void;
    /** Optional save status from auto-save hook */
    saveStatus?: "idle" | "saving" | "saved" | "error";
    /** Optional handler for explicit "Save Draft" — if omitted, only Publish is shown */
    onSaveDraft?: () => void;
    /** Current publish state — affects button label */
    isPublished?: boolean;
}

export function FormActions({ loading, onCancel, saveStatus, onSaveDraft, isPublished }: FormActionsProps) {
    const statusText = saveStatus === "saving"
        ? "Saving draft..."
        : saveStatus === "saved"
            ? "Draft saved"
            : saveStatus === "error"
                ? "Save failed"
                : null;

    const statusColor = saveStatus === "saving"
        ? "text-white/50"
        : saveStatus === "saved"
            ? "text-emerald-300"
            : saveStatus === "error"
                ? "text-red-300"
                : "text-white/40";

    return (
        <div className="fixed bottom-6 right-6 md:right-12 z-50">
            <div className="bg-[#002FA7] backdrop-blur-xl text-white p-2 pl-5 pr-2 rounded-2xl shadow-2xl shadow-[#002FA7]/30 border border-white/10 flex items-center gap-3 transition-all">
                {/* Status indicator */}
                {statusText && (
                    <>
                        <div className="flex items-center gap-2">
                            {saveStatus === "saving" && (
                                <div className="w-2 h-2 border border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {saveStatus === "saved" && (
                                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            )}
                            {saveStatus === "error" && (
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                            )}
                            <span className={`text-[10px] font-medium ${statusColor} hidden sm:inline-block`}>
                                {statusText}
                            </span>
                        </div>
                        <div className="h-4 w-px bg-white/10 hidden sm:block" />
                    </>
                )}

                {onSaveDraft && (
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className="px-4 py-2 rounded-lg text-white/80 font-bold uppercase text-[10px] tracking-wider hover:text-white hover:bg-white/10 transition flex items-center gap-1.5 border border-white/10"
                    >
                        <Save size={12} />
                        Save Draft
                    </button>
                )}

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-white/60 font-bold uppercase text-[10px] tracking-wider hover:text-white hover:bg-white/10 transition"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-[#002FA7] px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-gray-100 transition disabled:opacity-50 active:scale-95"
                >
                    {loading ? <div className="w-3 h-3 border-2 border-[#002FA7]/30 border-t-[#002FA7] rounded-full animate-spin" /> : <Save size={14} />}
                    {loading ? "Publishing..." : isPublished ? "Update" : "Publish"}
                </button>
            </div>
        </div>
    );
}
