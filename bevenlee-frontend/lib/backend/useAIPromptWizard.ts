import { useState } from "react";

export type WizardStep = 1 | 2 | 3;

export function useAIPromptWizard() {
  const [step, setStep] = useState<WizardStep>(1);
  const [courseName, setCourseName] = useState("");
  const [userIntent, setUserIntent] = useState("");
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setStep(1);
    setCourseName("");
    setUserIntent("");
    setCopied(false);
  };

  const buildPrompt = () => `I want to create a structured learning course called "${courseName}".

Here's what I want to learn and why:
${userIntent}

Based on the above, generate a course outline in EXACTLY this format (no extra text, no markdown code blocks, just the raw format):

title: ${courseName}
type: [infer from context e.g. Frontend / Backend / DSA / DevOps / Design / etc]
purpose: [write a concise 1-sentence purpose based on what I described]
priority: [infer: low | medium | high based on how urgent I made it sound]

topics:
  - Topic One
    - Subtopic A
    - Subtopic B
  - Topic Two
    - Subtopic A

resources:
  - title: Resource Name
    url: https://actual-url.com

projects:
  - title: Project Name
    description: Brief description of what to build

assignments:
  - title: Assignment Name
    description: Brief description of what to do

Rules:
- Include 5-10 topics, each with 2-5 subtopics
- Include 3-5 real, accurate resources with working URLs
- Include 2-3 projects and 2-3 assignments if relevant
- Do not include any explanation or extra text — output only the format above`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return {
    step, setStep,
    courseName, setCourseName,
    userIntent, setUserIntent,
    copied,
    handleCopy,
    reset,
  };
}