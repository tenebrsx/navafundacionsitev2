"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Link as LinkIcon, Heading2, List, ListOrdered, Quote, Image as ImageIcon, Undo, Redo } from 'lucide-react';
import { useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        } else if (url === '') {
            editor.chain().focus().unsetLink().run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Enter Image URL (or upload via Firebase first and paste link):');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const ToggleBtn = ({ onClick, isActive, disabled = false, title, children }: any) => (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-[#002FA7] text-white' : 'text-[#002FA7] hover:bg-[#002FA7]/10'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-[#002FA7]/20 bg-[#F4F4F2] p-2 sticky top-0 z-10">
            <ToggleBtn
                title="Bold (Cmd+B)"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
            >
                <Bold size={16} />
            </ToggleBtn>
            <ToggleBtn
                title="Italic (Cmd+I)"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
            >
                <Italic size={16} />
            </ToggleBtn>
            <ToggleBtn title="Add Link" onClick={addLink} isActive={editor.isActive('link')}>
                <LinkIcon size={16} />
            </ToggleBtn>

            <div className="w-px h-5 bg-[#002FA7]/20 mx-1"></div>

            <ToggleBtn
                title="Heading 2 (Cmd+Option+2)"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
            >
                <Heading2 size={16} />
            </ToggleBtn>
            <ToggleBtn
                title="Bullet List (Cmd+Shift+8)"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
            >
                <List size={16} />
            </ToggleBtn>
            <ToggleBtn
                title="Numbered List (Cmd+Shift+7)"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
            >
                <ListOrdered size={16} />
            </ToggleBtn>
            <ToggleBtn
                title="Quote (Cmd+Shift+B)"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
            >
                <Quote size={16} />
            </ToggleBtn>

            <div className="w-px h-5 bg-[#002FA7]/20 mx-1"></div>

            <ToggleBtn title="Insert Image" onClick={addImage}>
                <ImageIcon size={16} />
            </ToggleBtn>

            <div className="w-px h-5 bg-[#002FA7]/20 mx-1"></div>

            <ToggleBtn
                title="Undo (Cmd+Z)"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <Undo size={16} />
            </ToggleBtn>
            <ToggleBtn
                title="Redo (Cmd+Shift+Z)"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <Redo size={16} />
            </ToggleBtn>
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
