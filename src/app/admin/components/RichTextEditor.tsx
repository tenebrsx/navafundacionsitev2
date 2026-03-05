"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Link as LinkIcon, Heading2,
    List, ListOrdered, Quote, Image as ImageIcon, Undo, Redo
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const mod = isMac ? '⌘' : 'Ctrl';

interface ToolbarBtnProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    label: string;
    shortcut?: string;
    children: React.ReactNode;
}

const ToolbarBtn = ({ onClick, isActive = false, disabled = false, label, shortcut, children }: ToolbarBtnProps) => (
    <div className="relative group/btn">
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`
                p-1.5 rounded-md transition-colors
                ${isActive ? 'bg-[#002FA7] text-white' : 'text-[#002FA7] hover:bg-[#002FA7]/10'}
                ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
            `}
        >
            {children}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap">
            <div className="bg-[#0a0a0a] text-white text-[11px] px-2.5 py-1.5 rounded-md flex items-center gap-2 shadow-lg">
                <span className="font-medium">{label}</span>
                {shortcut && (
                    <kbd className="font-mono bg-white/15 text-white/80 px-1.5 py-0.5 rounded text-[10px] leading-none">
                        {shortcut}
                    </kbd>
                )}
            </div>
            {/* Arrow */}
            <div className="w-2 h-2 bg-[#0a0a0a] rotate-45 mx-auto -mt-1 rounded-sm"></div>
        </div>
    </div>
);

const Divider = () => <div className="w-px h-5 bg-[#002FA7]/20 mx-1" />;

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
        else if (url === '') editor.chain().focus().unsetLink().run();
    };

    const addImage = () => {
        const url = window.prompt('Enter image URL (upload via Firebase first, then paste link):');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <div className="border-b border-[#002FA7]/20 bg-[#F4F4F2] sticky top-0 z-10">
            {/* Toolbar Row */}
            <div className="flex flex-wrap items-center gap-1 p-2">
                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    label="Bold"
                    shortcut={`${mod}+B`}
                >
                    <Bold size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    label="Italic"
                    shortcut={`${mod}+I`}
                >
                    <Italic size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    label="Add Link"
                    shortcut={`${mod}+K`}
                >
                    <LinkIcon size={16} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    label="Heading"
                    shortcut={`${mod}+Alt+2`}
                >
                    <Heading2 size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    label="Bullet List"
                    shortcut={`${mod}+Shift+8`}
                >
                    <List size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    label="Numbered List"
                    shortcut={`${mod}+Shift+7`}
                >
                    <ListOrdered size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    label="Blockquote"
                    shortcut={`${mod}+Shift+B`}
                >
                    <Quote size={16} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn onClick={addImage} label="Insert Image">
                    <ImageIcon size={16} />
                </ToolbarBtn>

                <Divider />

                <ToolbarBtn
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    label="Undo"
                    shortcut={`${mod}+Z`}
                >
                    <Undo size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    label="Redo"
                    shortcut={`${mod}+Shift+Z`}
                >
                    <Redo size={16} />
                </ToolbarBtn>
            </div>
        </div>
    );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#002FA7] underline underline-offset-4 decoration-1 cursor-pointer hover:font-bold',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'w-full object-cover my-6 rounded-sm border border-[#002FA7]/10',
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-headings:font-normal prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-[#002FA7] prose-p:leading-relaxed prose-headings:text-[#002FA7] max-w-none focus:outline-none min-h-[400px] p-6 text-[#002FA7] bg-white',
            },
        },
    });

    return (
        <div className="border border-[#002FA7]/20 rounded-md overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-[#002FA7] focus-within:border-[#002FA7]">
            <MenuBar editor={editor} />
            <div className="flex-grow bg-white">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
