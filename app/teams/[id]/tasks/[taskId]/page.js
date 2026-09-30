"use client";

// One task: instructions, submission, contribution form, and AI feedback.
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ContributionForm from "@/components/ContributionForm";
import FeedbackPanel from "@/components/FeedbackPanel";
import { useUser } from "@/components/UserProvider";
import { getContributions, getProject, getTask, getTeam, submitTask } from "@/lib/db";

export default function TaskPage() {
  const { id: teamId, taskId } = useParams();
  const { currentUser, userName } = useUser();
  const [team, setTeam] = useState(null);
  const [project, setProject] = useState(null);
  const [task, setTask] = useState(undefined);
  const [contributions, setContributions] = useState([]);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTask = useCallback(
    () =>
      getTask(taskId).then((t) => {
        setTask(t);
        setDraft(t?.submission?.content || "");
      }),
    [taskId]
  );
  const loadContributions = useCallback(
    () => getContributions(taskId).then(setContributions),
    [taskId]
  );

  useEffect(() => {
    getTeam(teamId).then(async (t) => {
      setTeam(t);
      if (t) setProject(await getProject(t.projectId));
    });
    loadTask();
    loadContributions();
  }, [teamId, loadTask, loadContributions]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSaving(true);
    await submitTask(taskId, currentUser.id, draft.trim());
    await loadTask();
    setSaving(false);
  }

  if (task === undefined) return <p className="muted">Loading…</p>;
  if (task === null) return <p>Task not found.</p>;

  const isMember = currentUser && team?.memberIds.includes(currentUser.id);
  const criteria = (project?.criteria || []).filter((c) => task.criteriaIds.includes(c.id));

  return (
    <div>
      <Link href={`/teams/${teamId}`} className="back">
        ← Task board
      </Link>

      <div className="two-col">
        <div className="stack">
          <section className="card">
            <div className="eyebrow">{project?.title}</div>
            <h1>{task.title}</h1>
            <p>{task.description}</p>
            <div className="eyebrow" style={{ marginTop: 16 }}>
              Mentor criteria for this task
            </div>
            <ul className="criteria-list">
              {criteria.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>
                  <div className="muted small">{c.description}</div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Submission</h2>
            {task.submission && (
              <p className="muted small">
                Last submitted by {userName(task.submission.submittedBy)} on{" "}
                {new Date(task.submission.submittedAt).toLocaleString()}
              </p>
            )}
            <form onSubmit={handleSubmit} className="stack">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write your team's work here, or paste a link (Figma, Google Doc, GitHub)."
                disabled={!isMember}
                aria-label="Submission"
              />
              {isMember && (
                <div>
                  <button className="btn" disabled={saving || !draft.trim()}>
                    {saving ? "Saving…" : task.submission ? "Update submission" : "Submit work"}
                  </button>
                </div>
              )}
            </form>
          </section>

          <FeedbackPanel
            project={project}
            task={task}
            teamId={teamId}
            contributions={contributions}
            canRequest={isMember}
          />
        </div>

        <aside className="card">
          <h2>Contributions</h2>
          <p className="muted small">Record what you did, so the team and mentor can see who did what.</p>
          {contributions.length === 0 ? (
            <p className="muted small">No contributions yet.</p>
          ) : (
            <ul className="list-plain">
              {contributions.map((c) => (
                <li key={c.id}>
                  <div className="spread">
                    <strong>{userName(c.userId)}</strong>
                    <span className="badge">{c.hoursSpent}h</span>
                  </div>
                  <div className="small">{c.description}</div>
                </li>
              ))}
            </ul>
          )}
          {isMember && (
            <ContributionForm
              taskId={taskId}
              teamId={teamId}
              userId={currentUser.id}
              onAdded={loadContributions}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
