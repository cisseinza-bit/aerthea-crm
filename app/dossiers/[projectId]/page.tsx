"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  file?: { id: string; originalName: string; size: number } | null;
};

type SharedFile = {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DossierPage() {
  const { projectId }         = useParams() as { projectId: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles]       = useState<SharedFile[]>([]);
  const [text, setText]         = useState("");
  const [author, setAuthor]     = useState("Studio");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const fileRef                 = useRef<HTMLInputElement>(null);

  async function loadMessages() {
    const res = await fetch(`/api/dossiers/${projectId}/messages`);
    if (res.ok) setMessages(await res.json());
  }

  async function loadFiles() {
    const res = await fetch(`/api/dossiers/${projectId}/upload`);
    if (res.ok) setFiles(await res.json());
  }

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const [msgRes, fileRes] = await Promise.all([
        fetch(`/api/dossiers/${projectId}/messages`),
        fetch(`/api/dossiers/${projectId}/upload`),
      ]);
      if (cancelled) return;
      if (msgRes.ok)  setMessages(await msgRes.json());
      if (fileRes.ok) setFiles(await fileRes.json());
    }
    init();
    const interval = setInterval(() => {
      if (!cancelled) loadMessages();
    }, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    await fetch(`/api/dossiers/${projectId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text.trim(), author }),
    });
    setText("");
    await loadMessages();
    setSending(false);
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`/api/dossiers/${projectId}/upload`, { method: "POST", body: fd });
    await Promise.all([loadMessages(), loadFiles()]);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#111]">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="text-[#888888] hover:text-white text-xs font-mono transition-colors">← Projets</Link>
          <div className="w-px h-4 bg-[#2A2A2A]" />
          <p className="text-[#F5F5F5] text-sm font-semibold">📁 Dossier partagé</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] text-xs px-2 py-1 font-mono"
          >
            <option value="Studio">Studio</option>
            <option value="Client">Client</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-[#888888] text-xs text-center py-10 font-mono">Aucun message — démarrez la conversation</p>
            )}
            {messages.map((msg) => {
              const isStudio = msg.author === "Studio";
              return (
                <div key={msg.id} className={`flex ${isStudio ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-md ${isStudio ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed ${
                      isStudio
                        ? "bg-[#D8FF57] text-[#0A0A0A] font-medium"
                        : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5]"
                    }`}>
                      {msg.content}
                      {msg.file && (
                        <div className={`mt-2 text-xs font-mono ${isStudio ? "text-[#0A0A0A]/70" : "text-[#888888]"}`}>
                          📎 {msg.file.originalName} · {formatSize(msg.file.size)}
                        </div>
                      )}
                    </div>
                    <p className="text-[#444444] text-[10px] font-mono px-1">
                      {msg.author} · {new Date(msg.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="px-6 py-4 border-t border-[#2A2A2A] bg-[#111] flex gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] transition-colors text-sm"
            >
              {uploading ? "…" : "📎"}
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={uploadFile} />
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Écris un message…"
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] text-[#F5F5F5] px-4 py-2 text-sm placeholder:text-[#888888] focus:outline-none focus:border-[#D8FF57]"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="px-4 py-2 bg-[#D8FF57] text-[#0A0A0A] text-sm font-bold hover:bg-[#c2e84d] transition-colors disabled:opacity-40"
            >
              Envoyer
            </button>
          </form>
        </div>

        {/* Files panel */}
        <div className="w-64 border-l border-[#2A2A2A] bg-[#111] flex flex-col">
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <p className="text-[#888888] text-xs font-mono uppercase tracking-widest">Fichiers</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {files.length === 0 && (
              <p className="text-[#888888] text-[10px] text-center py-4">Aucun fichier</p>
            )}
            {files.map(file => (
              <div key={file.id} className="bg-[#1A1A1A] border border-[#2A2A2A] p-3 hover:border-[#D8FF57] transition-colors">
                <p className="text-[#F5F5F5] text-xs truncate">{file.originalName}</p>
                <p className="text-[#888888] text-[10px] mt-1 font-mono">{formatSize(file.size)}</p>
                <p className="text-[#444444] text-[10px]">{new Date(file.uploadedAt).toLocaleDateString("fr-FR")}</p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#2A2A2A]">
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-2 border border-[#2A2A2A] text-[#888888] hover:border-[#D8FF57] hover:text-[#D8FF57] text-xs font-mono uppercase tracking-widest transition-colors"
            >
              + Déposer un fichier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
