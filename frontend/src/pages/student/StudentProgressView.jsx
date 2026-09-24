import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function StudentProgressView() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = user?.student?.id || 1;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/students/${studentId}/progress`);
        setProgress(response.data.progress || []);
      } catch (error) {
        console.error("Failed to load progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [studentId]);

  const learningGaps = progress.filter(
    (topic) => topic.before !== null && topic.before < 50
  );

  const improvedTopics = progress.filter(
    (topic) => topic.improvement !== null && topic.improvement > 0
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Your Learning Journey
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Progress & Mastery
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track how your understanding improves from initial diagnostic tests to post-intervention follow-ups.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          Loading your learning progress...
        </div>
      ) : progress.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400 space-y-3">
          <p>No assessment results found yet.</p>
          <Link
            to="/student/assessments"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            <span>Take your first assessment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-slate-400 uppercase">Assessed Topics</p>
              <h2 className="mt-1 text-2xl font-black text-slate-900">{progress.length}</h2>
              <p className="mt-0.5 text-xs text-slate-400">Topics evaluated in tests</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-red-500 uppercase">Gaps to Practice</p>
              <h2 className="mt-1 text-2xl font-black text-red-600">{learningGaps.length}</h2>
              <p className="mt-0.5 text-xs text-slate-400">Topics &lt; 50% on diagnostics</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <p className="text-xs font-semibold text-emerald-600 uppercase">Topics Leveled Up</p>
              <h2 className="mt-1 text-2xl font-black text-emerald-600">{improvedTopics.length}</h2>
              <p className="mt-0.5 text-xs text-slate-400">Gains achieved after practice</p>
            </div>
          </div>

          {/* Topic Progress Breakdown */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-100 px-6 py-5">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Mastery by Topic
              </h3>
              <p className="text-xs text-slate-400">
                Comparison between your first diagnostic score and subsequent follow-up test
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {progress.map((topic) => {
                const isGap = topic.before !== null && topic.before < 50;
                const hasImproved = topic.improvement !== null && topic.improvement > 0;

                return (
                  <div key={topic.topic_id} className="p-6 transition hover:bg-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{topic.topic}</h4>
                          {isGap && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                              Learning Gap
                            </span>
                          )}
                          {hasImproved && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                              <TrendingUp className="h-3 w-3" />
                              <span>+{topic.improvement}% Improved</span>
                            </span>
                          )}
                        </div>

                        {/* Comparative progress bars */}
                        <div className="mt-4 space-y-2 max-w-md">
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>Initial Diagnostic Score</span>
                              <span className="font-bold">
                                {topic.before !== null ? `${topic.before}%` : "—"}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100">
                              {topic.before !== null && (
                                <div
                                  className={`h-2 rounded-full ${
                                    topic.before < 50 ? "bg-red-400" : "bg-indigo-400"
                                  }`}
                                  style={{ width: `${Math.min(topic.before, 100)}%` }}
                                />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>Follow-up Score</span>
                              <span className="font-bold">
                                {topic.after !== null ? `${topic.after}%` : "Pending post-test"}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100">
                              {topic.after !== null && (
                                <div
                                  className="h-2 rounded-full bg-emerald-500"
                                  style={{ width: `${Math.min(topic.after, 100)}%` }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end justify-center shrink-0">
                        <span className="text-[11px] font-bold uppercase text-slate-400">Total Gain</span>
                        {topic.improvement !== null ? (
                          <span
                            className={`text-2xl font-black ${
                              topic.improvement > 0
                                ? "text-emerald-600"
                                : topic.improvement < 0
                                ? "text-red-600"
                                : "text-slate-600"
                            }`}
                          >
                            {topic.improvement > 0 ? `+${topic.improvement}%` : `${topic.improvement}%`}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">Awaiting Follow-up</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
