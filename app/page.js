"use client";

// Home: the learner's (simulated) career assessment result and their teams.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/components/UserProvider";
import { getProject, getTeamsForUser } from "@/lib/db";
import { APP_TAGLINE } from "@/lib/config";

export default function HomePage() {
  const { currentUser } = useUser();
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    getTeamsForUser(currentUser.id).then(async (list) => {
      const withProjects = await Promise.all(
        list.map(async (team) => ({ ...team, project: await getProject(team.projectId) }))
      );
      setTeams(withProjects);
    });
  }, [currentUser]);

  if (!currentUser) return <p className="muted">Loading…</p>;

  return (
    <div className="stack">
      <div>
        <h1>Hi {currentUser.name.split(" ")[0]}</h1>
        <p className="muted">{APP_TAGLINE}</p>
      </div>

      <section className="card hero">
        <div className="spread">
          <div className="eyebrow">Your career assessment result</div>
          <span className="badge badge-amber">Simulated for MVP</span>
        </div>
        <div className="muted">You are a good fit for</div>
        <div className="career-field">{currentUser.careerField}</div>
        <p>
          <strong>Why: </strong>
          {currentUser.careerExplanation}
        </p>
        <Link href="/projects" className="btn">
          See projects that match
        </Link>
      </section>

      <section>
        <h2 className="section-title">My teams</h2>
        {teams === null && <p className="muted">Loading…</p>}
        {teams?.length === 0 && (
          <div className="card">
            <p className="muted">You have not joined a project yet.</p>
            <Link href="/projects" className="btn btn-secondary">
              Browse projects
            </Link>
          </div>
        )}
        <div className="grid">
          {teams?.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`} className="card project-card">
              <span className="badge badge-blue">{team.project?.field}</span>
              <h3>{team.project?.title}</h3>
              <span className="muted small">
                {team.memberIds.length} of {team.project?.teamSize} members · {team.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
