"use client";

import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthProvider";
import { useSocket } from "@/features/hooks/useSocket";
import { fetchProblemById } from "@/features/problems/api";
import type { ProblemDetail } from "@/features/problems/types";
import { createSubmission } from "@/features/submissions/api";
import { Submission } from "@/features/submissions/types";
import {
    AlertCircle,
    ChevronRight,
    Info,
    Loader2,
    MessageSquare,
    Play,
    RotateCcw,
    Send,
    Settings2,
    Sparkles
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiHintPanel } from "./AiHintPanel";
import { CodeEditor } from "./CodeEditor";
import { CommentSection } from "./CommentSection";
import { SubmissionStatusDisplay } from "./SubmissionStatusDisplay";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", extension: ".js", defaultCode: "// Write your code here\nconsole.log('Hello World');" },
  { id: "python", name: "Python", extension: ".py", defaultCode: "# Write your code here\nprint('Hello World')" },
  { id: "java", name: "Java", extension: ".java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}" },
  { id: "cpp", name: "C++", extension: ".cpp", defaultCode: "#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\" << std::endl;\n    return 0;\n}" },
];

export function ProblemDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Editor State
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(LANGUAGES[0].defaultCode);
  
  // Submission State
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Hint State
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState<"description" | "discussion" | "submissions">("description");

  // Real-time updates via Socket.io
  const { on, off } = useSocket(user?.id);

  useEffect(() => {
    on("submission-update", (data: Submission) => {
      console.log("Received submission update via WebSocket:", data);
      
      // Update the current submission ONLY if it's the one we're currently tracking
      // or if it's a new one and we don't have one current.
      // Usually, we only care about the latest one the user submitted in this session.
      setCurrentSubmission(prev => {
        if (!prev || prev.id === data.id) {
          return data;
        }
        return prev;
      });

      const isFinished = data.status !== "PENDING" && 
                        data.status !== "QUEUED" && 
                        data.status !== "PROCESSING";

      if (isFinished && data.id === currentSubmission?.id) {
        setIsSubmitting(false);
        if (data.status === "ACCEPTED") {
          toast.success("Success! All test cases passed.");
        } else {
          toast.error(`Submission failed: ${data.status.replace("_", " ")}`);
        }
      }
    });

    return () => {
      off("submission-update");
    };
  }, [on, off, currentSubmission?.id]);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      console.log("Loading problem with ID:", params.id);
      setIsLoading(true);
      setNotFound(false);
      try {
        const idNum = Number(params.id);
        console.log("Converted ID to number:", idNum);
        const data = await fetchProblemById(idNum);
        console.log("Fetched problem data:", data);
        if (!data) {
          console.warn("Problem data is null/undefined");
          setNotFound(true);
        } else {
          setProblem(data);
        }
      } catch (err) {
        console.error("Failed to load problem error:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params]);


  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const selected = LANGUAGES.find(l => l.id === value);
    if (selected) setCode(selected.defaultCode);
  };

  const handleSubmit = async () => {
    if (!user || !problem) return;
    
    setIsSubmitting(true);
    setCurrentSubmission(null);
    
    try {
      const sub = await createSubmission({
        userId: user.id,
        problemId: problem.id,
        language,
        sourceCode: code
      });
      
      setCurrentSubmission(sub);
      // Removed startPolling(sub.id) - WebSocket will handle it
      toast.info("Submission received, processing...");
    } catch (err) {
      console.error("Submission error", err);
      toast.error("Failed to submit code. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <FullScreenLoader />;

  if (notFound || !problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500" />
        <h1 className="text-2xl font-bold text-slate-200">Problem not found</h1>
        <p className="text-sm text-slate-400 max-w-xs text-center">
          The problem you're looking for does not exist or has been removed.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col -m-6">
      {/* Header Bar */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>Problems</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">#{problem.id}</span>
          </div>
          <h1 className="text-xl font-black text-white">{problem.title}</h1>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
            problem.difficulty === "EASY" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
            problem.difficulty === "MEDIUM" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
            "bg-rose-500/10 text-rose-500 border-rose-500/20"
          }`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] h-9 bg-slate-900 border-slate-800 font-mono text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              {LANGUAGES.map(l => (
                <SelectItem key={l.id} value={l.id} className="text-xs font-mono">
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-4 w-px bg-slate-800" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAiPanelOpen(true)}
            className={`h-9 w-9 ${isAiPanelOpen ? 'text-amber-400' : 'text-slate-400'} hover:text-white`}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white">
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Description & Discussion */}
        <div className="w-[45%] border-r border-slate-800 flex flex-col bg-slate-950/50">
          {/* Tab Headers */}
          <div className="flex items-center gap-6 px-6 border-b border-slate-900 bg-slate-950/20">
            <button 
              onClick={() => setActiveTab("description")}
              className={`py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === "description" ? "text-amber-500 border-amber-500" : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab("discussion")}
              className={`py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "discussion" ? "text-amber-500 border-amber-500" : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              Discussion
              <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-full text-slate-400 font-black">
                NEW
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("submissions")}
              className={`py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === "submissions" ? "text-amber-500 border-amber-500" : "text-slate-500 border-transparent hover:text-slate-300"
              }`}
            >
              Solutions
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === "description" && (
              <div className="space-y-8 pb-12">
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="flex items-center gap-2 text-slate-400 mb-4 font-bold text-xs uppercase tracking-wider">
                    <Info className="w-3 h-3" />
                    Problem Description
                  </div>
                  <p className="whitespace-pre-line text-slate-200 leading-relaxed text-sm">
                    {problem.description}
                  </p>
                </div>

                {(problem.exampleInput || problem.exampleOutput) && (
                  <div className="space-y-4 pt-4 border-t border-slate-900">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-500" />
                      Example Case
                    </h3>
                    <div className="grid gap-4">
                      {problem.exampleInput && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Input</div>
                          <pre className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-100 overflow-auto shadow-inner">
                            {problem.exampleInput}
                          </pre>
                        </div>
                      )}
                      {problem.exampleOutput && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight ml-1">Output</div>
                          <pre className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-auto shadow-inner transition-colors active:bg-emerald-500/5">
                            {problem.exampleOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "discussion" && (
              <div className="pb-12">
                <CommentSection problemId={problem.id} />
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                <MessageSquare className="w-12 h-12 text-slate-700" />
                <p className="text-sm text-slate-500 font-medium tracking-tight uppercase tracking-[0.2em]">Solution Browser coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Editor & Results */}
        <div className="flex-1 flex flex-col bg-slate-950">
          <div className="flex-1 p-4 overflow-hidden">
            <CodeEditor 
              value={code} 
              onChange={(val) => setCode(val || "")} 
              language={language} 
            />
          </div>

          {/* Result / Action Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-xs font-bold gap-2"
                >
                  <Play className="w-3 h-3 text-blue-400" />
                  Run Code
                </Button>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2 ml-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Execution Service Online
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 h-10 shadow-lg shadow-emerald-900/20 gap-2 transition-all active:scale-95 group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
                SUBMIT SOLUTION
              </Button>
            </div>

            {currentSubmission && (
              <SubmissionStatusDisplay 
                status={currentSubmission.status}
                testCasesPassed={currentSubmission.testCasesPassed}
                totalTestCases={currentSubmission.totalTestCases}
                executionTime={currentSubmission.executionTime}
                memoryUsed={currentSubmission.memoryUsed}
                errorMessage={currentSubmission.errorMessage}
                testResults={currentSubmission.testResults}
              />
            )}
          </div>
        </div>
      </div>

      <AiHintPanel 
        problemId={problem.id}
        code={code}
        language={language}
        isOpen={isAiPanelOpen}
        onClose={() => setIsAiPanelOpen(false)}
      />
    </div>
  );
}
