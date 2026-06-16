"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { X, UserPlus, Send, Loader2, CheckCircle, AlertCircle, Users, Link2, Check } from "lucide-react";

interface InviteResult {
  email: string;
  status: "success" | "error";
  message: string;
  link?: string;
}

interface InviteModalProps {
  assignmentId: number;
  assignmentTitle: string;
  onClose: () => void;
}

export default function InviteModal({ assignmentId, assignmentTitle, onClose }: InviteModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<InviteResult[] | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Generic, Trello-style shareable link (works for anyone who opens it).
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers/contexts where the Clipboard API is unavailable
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  async function handleCopyShareLink() {
    setLinkError(null);
    try {
      let link = shareLink;
      if (!link) {
        setLinkLoading(true);
        const res = await axiosInstance.get(`/assignments/${assignmentId}/invite-link`);
        link = (res.data?.data?.inviteLink as string | undefined) ?? null;
        setShareLink(link);
      }
      if (!link) { setLinkError("Couldn't generate a link. Please try again."); return; }
      await copyToClipboard(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkError("Couldn't generate a link. Please try again.");
    } finally {
      setLinkLoading(false);
    }
  }

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function addEmail() {
    const val = inputValue.trim();
    if (!val) return;
    if (!isValidEmail(val)) { setInputError("Invalid email address"); return; }
    if (emails.includes(val)) { setInputError("That email's already on the list."); return; }
    setEmails((prev) => [...prev, val]);
    setInputValue("");
    setInputError(null);
    inputRef.current?.focus();
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter((e) => e !== email));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail();
    }
    if (e.key === "Backspace" && inputValue === "" && emails.length > 0) {
      setEmails((prev) => prev.slice(0, -1));
    }
  }

  async function handleSend() {
    // Add any pending input first
    const val = inputValue.trim();
    let finalEmails = [...emails];
    if (val) {
      if (!isValidEmail(val)) { setInputError("Invalid email address"); return; }
      if (!finalEmails.includes(val)) finalEmails = [...finalEmails, val];
      setInputValue("");
      setInputError(null);
    }
    if (finalEmails.length === 0) { setInputError("Add at least one email to send an invite."); return; }

    setSending(true);

    // Call the endpoint once per email in parallel
    const settled = await Promise.allSettled(
      finalEmails.map((email) =>
        axiosInstance.post(`/assignments/${assignmentId}/invite`, { email })
      )
    );

    const results: InviteResult[] = settled.map((result, i) => {
      if (result.status === "fulfilled") {
        const link = (result.value as any)?.data?.data?.inviteLink as string | undefined;
        return { email: finalEmails[i], status: "success", message: "Invitation sent", link };
      } else {
        const msg =
          (result.reason as any)?.response?.data?.message ?? "We couldn't send this invite.";
        return { email: finalEmails[i], status: "error", message: msg };
      }
    });

    setSending(false);
    setResults(results);
    setEmails([]);
  }

  async function handleCopyLink(email: string, link: string) {
    await copyToClipboard(link);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail((cur) => (cur === email ? null : cur)), 2000);
  }

  function handleGoToChat() {
    onClose();
    router.push(`/groups?assignmentId=${assignmentId}`);
  }

  const anySuccess = results?.some((r) => r.status === "success");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Invite members</p>
                <p className="text-xs text-stone-400 truncate max-w-[220px]">{assignmentTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">

            {/* Results view */}
            {results ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {results.map((r) => (
                    <div
                      key={r.email}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${
                        r.status === "success"
                          ? "bg-green-50 border-green-100"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      {r.status === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-700 truncate">{r.email}</p>
                        <p className={`text-[11px] ${r.status === "success" ? "text-green-600" : "text-red-500"}`}>
                          {r.message}
                        </p>
                      </div>
                      {r.status === "success" && r.link && (
                        <button
                          onClick={() => handleCopyLink(r.email, r.link!)}
                          title="Copy invite link"
                          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            copiedEmail === r.email
                              ? "bg-green-100 text-green-700"
                              : "bg-white border border-green-200 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {copiedEmail === r.email ? (
                            <><Check className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Link2 className="w-3 h-3" /> Copy link</>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  {anySuccess && (
                    <button
                      onClick={handleGoToChat}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Go to group chat
                    </button>
                  )}
                  <button
                    onClick={() => setResults(null)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-semibold transition-colors"
                  >
                    Invite more
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Shareable link — anyone who opens it can join after signing in */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 mb-2">
                    Share a link
                  </p>
                  <button
                    onClick={handleCopyShareLink}
                    disabled={linkLoading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                      linkCopied
                        ? "bg-purple-50 border-purple-200 text-purple-700"
                        : "bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    {linkLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Preparing link…</>
                    ) : linkCopied ? (
                      <><Check className="w-4 h-4" /> Link copied</>
                    ) : (
                      <><Link2 className="w-4 h-4" /> Copy invite link</>
                    )}
                  </button>
                  {linkError ? (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{linkError}</p>
                  ) : (
                    <p className="text-[11px] text-stone-400 mt-1.5">
                      Anyone with this link can join — they'll sign in or create an account first.
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-stone-100" />
                  <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wide">or invite by email</span>
                  <div className="flex-1 h-px bg-stone-100" />
                </div>

                {/* Email input area */}
                <div>
                  <p className="text-xs font-semibold text-stone-500 mb-2">
                    Email addresses
                  </p>

                  {/* Tag input */}
                  <div
                    className="min-h-[80px] flex flex-wrap gap-1.5 p-3 border border-stone-200 rounded-xl cursor-text focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all"
                    onClick={() => inputRef.current?.focus()}
                  >
                    {emails.map((email) => (
                      <span
                        key={email}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-100 text-purple-700 text-xs font-semibold rounded-lg"
                      >
                        {email}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeEmail(email); }}
                          className="hover:text-purple-900 ml-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      ref={inputRef}
                      type="email"
                      value={inputValue}
                      onChange={(e) => { setInputValue(e.target.value); setInputError(null); }}
                      onKeyDown={handleKeyDown}
                      onBlur={addEmail}
                      placeholder={emails.length === 0 ? "Type email and press Enter…" : "Add another…"}
                      className="flex-1 min-w-[140px] outline-none text-sm text-stone-700 placeholder:text-stone-300 bg-transparent"
                    />
                  </div>

                  {inputError && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">{inputError}</p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1.5">
                    Press Enter, comma, or space after each email. They'll receive an invite link by email — and you can copy a shareable link after sending.
                  </p>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={sending || (emails.length === 0 && !inputValue.trim())}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending invites…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send {emails.length > 1 ? `${emails.length} invites` : "invite"}</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}