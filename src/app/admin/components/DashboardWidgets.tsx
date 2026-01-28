"use client";

import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";

export function StatCard({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">{label}</p>
                <h3 className="text-3xl font-black text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-current border-opacity-10`}>
                <Icon size={24} className={color.replace("bg-", "text-").split(" ")[1]} />
            </div>
        </div>
    )
}

export function QuickAction({ href, title, icon: Icon, color }: any) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all active:scale-95 duration-200"
        >
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-100 transition-colors`}>
                <Icon size={18} className="text-current" />
            </div>
            <span className="font-bold text-xs text-slate-700 group-hover:text-black uppercase tracking-wide">{title}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <Plus size={16} className="text-gray-400" />
            </div>
        </Link>
    )
}

export function ModuleCard({ href, title, description, icon: Icon }: any) {
    return (
        <Link href={href} className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-[#002FA7]/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-[#002FA7] group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#002FA7] transition-colors">{title}</h2>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
                </div>
                <div className="ml-auto">
                    <ChevronRight className="text-gray-300 group-hover:text-[#002FA7] group-hover:translate-x-1 transition-all" size={20} />
                </div>
            </div>
        </Link>
    )
}
