"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import MagneticButton from "./anim/MagneticButton";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    longBio?: string;
    email?: string;
    image?: string;
}

interface TeamMemberDetailProps {
    member: TeamMember;
}

export default function TeamMemberDetail({ member }: TeamMemberDetailProps) {
    const isUrl = member.image?.startsWith('http') || member.image?.startsWith('/');

    return (
        <article className="min-h-screen text-[#002FA7]">
            {/* Header / Nav */}
            <div className="mb-12 border-b border-[#002FA7] pb-8">
                <MagneticButton>
                    <Link href="/team" className="flex items-center gap-2 group w-fit">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-mono text-xs uppercase tracking-widest">Back to Team</span>
                    </Link>
                </MagneticButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

                {/* Visual / Left Col */}
                <div className="md:col-span-5">
                    <div className={`w-full aspect-[3/4] ${!isUrl && member.image ? member.image : 'bg-zinc-100'} border border-[#002FA7]/10 overflow-hidden relative`}>
                        {isUrl && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
                        {!isUrl && (
                            <div className="absolute inset-0 flex items-center justify-center text-[#002FA7]/10 text-[15vw] font-bold leading-none">
                                {member.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Contact Info Block */}
                    {member.email && (
                        <div className="mt-8 border-t border-[#002FA7] pt-4">
                            <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">Contact</span>
                            <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:underline">
                                <Mail size={16} />
                                <span>{member.email}</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Content / Right Col */}
                <div className="md:col-span-7 flex flex-col gap-8">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">{member.role}</span>
                        <h1 className="text-5xl md:text-7xl leading-[0.9] tracking-tighter">
                            {member.name}
                        </h1>
                    </div>

                    <div className="prose prose-lg prose-p:text-[#002FA7] prose-p:leading-relaxed max-w-none">
                        {member.longBio ? (
                            member.longBio.split('\n').map((para, i) => (
                                <p key={i}>{para}</p>
                            ))
                        ) : (
                            <div className="whitespace-pre-wrap">{member.bio}</div>
                        )}
                    </div>
                </div>

            </div>
        </article>
    );
}
