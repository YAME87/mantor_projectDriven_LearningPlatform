"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/config";
import { useUser } from "./UserProvider";

export default function Header() {
  const pathname = usePathname();
  const { users, currentUser, isMentor, switchUser } = useUser();
  const learners = users.filter((u) => u.role === "learner");
  const mentors = users.filter((u) => u.role === "mentor");

  const nav = [
    { href: "/", label: "Home" },
    ...(isMentor ? [] : [{ href: "/assessment", label: "Assessment" }]),
    { href: "/projects", label: "Projects" },
  ];

  return (
    <header className="header">
      <div className="container header-inner">
        {/* The home hero already shows the big wordmark, so the header logo steps aside there. */}
        <Link href="/" className={pathname === "/" ? "logo logo-hidden" : "logo"}>
          {APP_NAME}
        </Link>
        <nav className="nav">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="header-right">
          {isMentor && <span className="badge badge-blue">Mentor view · learner names hidden</span>}
          <label className="user-switch">
            <span className="muted small">Viewing as</span>
            <select
              value={currentUser?.id || ""}
              onChange={(e) => switchUser(e.target.value)}
              aria-label="Switch demo user"
            >
              {/* In mentor view even this demo switch shows anonymous names, so no real name is ever on screen. */}
              <optgroup label="Learners">
                {learners.map((u) => (
                  <option key={u.id} value={u.id}>
                    {isMentor ? u.anonymousName : u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Mentors">
                {mentors.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} (mentor)
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
