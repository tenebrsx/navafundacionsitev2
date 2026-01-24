import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-background text-white border-t border-zinc-800">

            {/* Newsletter Block Top */}
            <div className="p-6 md:p-12 border-b border-zinc-800 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold uppercase mb-2">Newsletter</h3>
                    <p className="text-zinc-500 font-mono text-sm max-w-sm">
                        Subscribe to receive updates on our exhibitions, publications, and public programs.
                    </p>
                </div>
                <div className="flex w-full md:w-auto gap-0 border border-white">
                    <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent p-3 outline-none w-full md:w-80 placeholder:text-zinc-600" />
                    <button className="bg-white text-black px-6 font-bold uppercase hover:bg-zinc-200 transition-colors">Submit</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 p-6 md:p-12 font-mono text-sm uppercase">

                {/* Column 1: About */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-zinc-600 border-b border-zinc-900 pb-2 mb-2">About</h4>
                    <Link href="/about" className="hover:text-zinc-400 transition-colors">Mission</Link>
                    <Link href="/about" className="hover:text-zinc-400 transition-colors">Team</Link>
                    <Link href="/about" className="hover:text-zinc-400 transition-colors">History</Link>
                </div>

                {/* Column 2: Programs */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-zinc-600 border-b border-zinc-900 pb-2 mb-2">Programs</h4>
                    <Link href="/movements" className="hover:text-zinc-400 transition-colors">Movements</Link>
                    <Link href="/movements" className="hover:text-zinc-400 transition-colors">Exhibitions</Link>
                    <Link href="/movements" className="hover:text-zinc-400 transition-colors">Research</Link>
                </div>

                {/* Column 3: Visit */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-zinc-600 border-b border-zinc-900 pb-2 mb-2">Visit</h4>
                    <Link href="/visit" className="hover:text-zinc-400 transition-colors">Location</Link>
                    <Link href="/visit" className="hover:text-zinc-400 transition-colors">Hours</Link>
                    <Link href="/visit" className="hover:text-zinc-400 transition-colors">Accessibility</Link>
                </div>

                {/* Column 4: Info */}
                <div className="flex flex-col gap-4 text-zinc-500">
                    <h4 className="text-zinc-600 border-b border-zinc-900 pb-2 mb-2 opacity-0">Info</h4>
                    <p>C. Arzobispo Meriño 2<br />Santo Domingo, D.R.</p>
                    <a href="mailto:info@nava.dr" className="hover:text-white transition-colors">info@nava.dr</a>
                    <div className="mt-8">
                        <p>© 2026 Nava Fundacion</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
