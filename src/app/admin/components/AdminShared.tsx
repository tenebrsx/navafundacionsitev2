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
            ${sticky ? "sticky top-0 bg-[#F0F0F2]/80 backdrop-blur-xl z-30 px-8 py-6 -mx-8 shadow-sm border-gray-200/50 supports-[backdrop-filter]:bg-[#F0F0F2]/60" : "px-8 md:px-12 pt-12"}
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
            px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-2
            ${isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
            }
        `}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            {status || "draft"}
        </span>
    );
}

export function FormActions({ loading, onCancel }: { loading: boolean; onCancel: () => void }) {
    return (
        <div className="fixed bottom-6 right-6 md:right-12 z-50">
            <div className="bg-[#002FA7]/90 backdrop-blur-xl text-white p-2 pl-6 pr-2 rounded-2xl shadow-2xl shadow-[#002FA7]/30 border border-white/10 flex items-center gap-4 transition-all hover:scale-[1.02] hover:bg-[#002FA7]">
                <span className="text-xs font-medium text-white/60 hidden sm:inline-block mr-2">Unsaved changes</span>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-white/70 font-bold uppercase text-[10px] tracking-wider hover:text-white hover:bg-white/10 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-white text-[#002FA7] px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-wider hover:bg-gray-100 transition disabled:opacity-50 active:scale-95"
                >
                    {loading ? <div className="w-3 h-3 border-2 border-[#002FA7]/30 border-t-[#002FA7] rounded-full animate-spin" /> : <Save size={14} />}
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
}
