// src/components/problemAdmin/ProblemForm.tsx
"use client";

import { useState } from "react";
import type {
  Difficulty,
  ProblemDetail,
  ProblemInput,
  TestCaseInput,
} from "@/features/problems/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const difficulties: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

interface ProblemFormProps {
  initial?: ProblemDetail | null;
  onSubmit: (payload: ProblemInput) => Promise<void>;
  submitLabel?: string;
}

export function ProblemForm({
  initial,
  onSubmit,
  submitLabel = "Save Problem",
}: ProblemFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? "EASY"
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [exampleInput, setExampleInput] = useState(initial?.exampleInput ?? "");
  const [exampleOutput, setExampleOutput] = useState(
    initial?.exampleOutput ?? ""
  );
  const [testCases, setTestCases] = useState<TestCaseInput[]>(
    initial?.testCases?.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    })) ?? [{ input: "", expectedOutput: "" }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestCaseChange =
    (index: number, field: keyof TestCaseInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setTestCases((prev) =>
        prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
      );
    };

  const handleAddTestCase = () => {
    setTestCases((prev) => [...prev, { input: "", expectedOutput: "" }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedTestCases = testCases.filter(
      (tc) => tc.input.trim() !== "" && tc.expectedOutput.trim() !== ""
    );

    if (cleanedTestCases.length === 0) {
      setError("At least one complete test case is required.");
      return;
    }

    if (description.trim().length < 20) {
      setError("Description must be at least 20 characters.");
      return;
    }

    const payload: ProblemInput = {
      title,
      difficulty,
      description,
      exampleInput: exampleInput || undefined,
      exampleOutput: exampleOutput || undefined,
      testCases: cleanedTestCases,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err: any) {
      console.error("Problem form submit error", err);
      setError("Failed to save problem.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-5 bg-slate-900 border-slate-800">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-100">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border-slate-700"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-100">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-100">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="bg-slate-950 border-slate-700 text-sm"
            required
          />
          <p className="text-xs text-slate-500">
            Minimum 20 characters. You can use Markdown-like text.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-100">
              Example Input (optional)
            </label>
            <Textarea
              value={exampleInput}
              onChange={(e) => setExampleInput(e.target.value)}
              rows={3}
              className="bg-slate-950 border-slate-700 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-100">
              Example Output (optional)
            </label>
            <Textarea
              value={exampleOutput}
              onChange={(e) => setExampleOutput(e.target.value)}
              rows={3}
              className="bg-slate-950 border-slate-700 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100">
              Test Cases
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTestCase}
            >
              Add test case
            </Button>
          </div>

          <div className="space-y-3">
            {testCases.map((tc, index) => (
              <div
                key={tc.id ?? index}
                className="rounded border border-slate-800 bg-slate-950 p-3 space-y-2"
              >
                {tc.id && (
                  <p className="text-[10px] text-slate-500">
                    Existing TestCase ID: {tc.id}
                  </p>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-100">
                    Input
                  </label>
                  <Textarea
                    value={tc.input}
                    onChange={handleTestCaseChange(index, "input")}
                    rows={2}
                    className="bg-slate-950 border-slate-700 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-100">
                    Expected Output
                  </label>
                  <Textarea
                    value={tc.expectedOutput}
                    onChange={handleTestCaseChange(
                      index,
                      "expectedOutput"
                    )}
                    rows={2}
                    className="bg-slate-950 border-slate-700 text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveTestCase(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
