"use client";

// Shows AI feedback for a task and lets the team request new feedback.
import { useCallback, useEffect, useState } from "react";
import { addFeedback, getFeedback } from "@/lib/db";

function ScoreDots({ score }) {
  return (
    <span className="score-dots" aria-label={`${score} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= score ? "dot on" : "dot"} />
      ))}
    </span>
  );
}

export default function FeedbackPanel({ project, task, teamId, contributions, canRequest }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () => getFeedback(task.id).then((list) => setItems([...list].reverse())),
    [task.id]
  );

  useEffect(() => {
    load();
  }, [load]);

  async function requestFeedback() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, task, submission: task.submission, contributions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      await addFeedback({
        taskId: task.id,
        teamId,
        source: "ai",
        scores: data.scores,
        summary: data.summary,
        simulated: data.simulated,
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  const criteriaName = (id) => project?.criteria.find((c) => c.id === id)?.name || id;
  const latest = items[0];

  return (
    <section className="card">
      <div className="spread">
        <div>
          <h2>Feedback</h2>
          <p className="muted small">AI reviews your submission against the mentor&apos;s criteria.</p>
        </div>
        {canRequest && (
          <button className="btn" onClick={requestFeedback} disabled={loading || !task.submission || !project}>
            {loading ? "Reviewing…" : latest ? "Get new feedback" : "Get AI feedback"}
          </button>
        )}
      </div>

      {!task.submission && <p className="muted small">Submit your work first to get feedback.</p>}
      {error && <p className="error">{error}</p>}

      {latest && (
        <div style={{ marginTop: 12 }}>
          <div className="row" style={{ marginBottom: 8 }}>
            <span className="badge badge-blue">{latest.source === "ai" ? "AI feedback" : "Mentor feedback"}</span>
            {latest.simulated && <span className="badge badge-amber">Simulated</span>}
            <span className="muted small">{new Date(latest.createdAt).toLocaleString()}</span>
          </div>
          <p>{latest.summary}</p>
          {latest.scores.map((s) => (
            <div key={s.criteriaId} className="score-row">
              <strong>{criteriaName(s.criteriaId)}</strong>
              <ScoreDots score={s.score} />
              <span className="muted small" style={{ gridColumn: "1 / -1" }}>
                {s.comment}
              </span>
            </div>
          ))}
          {items.length > 1 && (
            <p className="muted small" style={{ marginTop: 8 }}>
              {items.length - 1} earlier review{items.length > 2 ? "s" : ""} saved.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
