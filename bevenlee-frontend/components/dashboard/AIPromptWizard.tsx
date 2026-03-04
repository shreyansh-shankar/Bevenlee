"use client";

import { ChevronRight, Sparkles, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { useAIPromptWizard, WizardStep } from "@/lib/backend/useAIPromptWizard";

interface AIPromptWizardProps {
  onClose: () => void;
  onDone: () => void; // called when user clicks "I have my format, go back"
}

const AI_TOOLS = [
  { name: "ChatGPT", url: "https://chat.openai.com" },
  { name: "Claude", url: "https://claude.ai" },
  { name: "Gemini", url: "https://gemini.google.com" },
];

export function AIPromptWizard({ onClose, onDone }: AIPromptWizardProps) {
  const {
    step, setStep,
    courseName, setCourseName,
    userIntent, setUserIntent,
    copied,
    handleCopy,
    reset,
  } = useAIPromptWizard();

  const handleBack = () => {
    if (step === 1) { reset(); onClose(); }
    else setStep((step - 1) as WizardStep);
  };

  const handleDone = () => {
    reset();
    onDone();
  };

  return (
    <div className="flex flex-col gap-5 px-6 py-5">

      {/* ── Disclaimer banner ── */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
        <Sparkles size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          <span className="font-semibold">We don't have AI built in.</span> This wizard builds
          a prompt you can paste into any AI tool (ChatGPT, Claude, Gemini) to generate
          your course outline — then paste the result back here.
        </p>
      </div>

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2">
        {([1, 2, 3] as WizardStep[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-all ${
                step === s
                  ? "bg-accent text-accent-foreground"
                  : step > s
                  ? "bg-accent/30 text-accent"
                  : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`h-px w-8 transition-all ${step > s ? "bg-accent/40" : "bg-border"}`} />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {step === 1 && "Course name"}
          {step === 2 && "Your goals"}
          {step === 3 && "Copy prompt"}
        </span>
      </div>

      {/* ── Step 1: Course name ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">What course do you want to create?</h3>
            <p className="text-xs text-muted-foreground">Just the name is fine for now.</p>
          </div>
          <input
            autoFocus
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && courseName.trim() && setStep(2)}
            placeholder="e.g. React Complete Guide, DSA in Python..."
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      )}

      {/* ── Step 2: User intent ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Why do you want to take this course?</h3>
            <p className="text-xs text-muted-foreground">
              Be as raw and detailed as you want — your goals, what you already know,
              what you want to build, timeline, etc. The AI will use this to shape the outline.
            </p>
          </div>
          <textarea
            autoFocus
            value={userIntent}
            onChange={(e) => setUserIntent(e.target.value)}
            placeholder={`e.g. I'm a backend developer who knows basic HTML/CSS but never touched React. I want to build a dashboard app for my startup in 2 months. I care more about practical projects than theory...`}
            className="rounded-xl border border-border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 leading-relaxed"
            style={{ minHeight: "140px" }}
          />
        </div>
      )}

      {/* ── Step 3: Copy prompt ── */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Your prompt is ready</h3>
            <p className="text-xs text-muted-foreground">
              Copy it, open any AI tool below, paste it in, then bring the result back here.
            </p>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              copied
                ? "bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-accent text-accent-foreground hover:bg-accent/90"
            }`}
          >
            {copied ? (
              <><Check size={15} /> Copied to clipboard!</>
            ) : (
              <><Copy size={15} /> Copy AI Prompt</>
            )}
          </button>

          {/* AI tool quick links */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Open an AI tool:</p>
            <div className="flex gap-2">
              {AI_TOOLS.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted/20 transition"
                >
                  {tool.name}
                  <ExternalLink size={11} className="text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <ol className="flex flex-col gap-1.5 text-xs text-muted-foreground list-none">
            {[
              "Copy the prompt above",
              "Open ChatGPT, Claude, or Gemini",
              "Paste the prompt and send it",
              "Copy the AI's response",
              'Click "I have my format" below and paste it in',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-muted/30 flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {/* Done button */}
          <button
            onClick={handleDone}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted/20 transition mt-1"
          >
            I have my format → paste it in
          </button>
        </div>
      )}

      {/* ── Footer nav ── */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={13} />
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 && (
          <button
            onClick={() => setStep((step + 1) as WizardStep)}
            disabled={step === 1 ? !courseName.trim() : !userIntent.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition"
          >
            Next
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}