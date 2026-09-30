"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/config";
import { isFirebaseEnabled } from "@/lib/db";
import { useUser } from "./UserProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
];

export default function Header() {
  const pathname = usePathname();
  const { users, currentUser, switchUser } = useUser();
  const learners = users.filter((u) => u.role === "learner");

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          {APP_NAME}
        </Link>
        <nav className="nav">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="header-right">
          <span className={isFirebaseEnabled ? "badge badge-green" : "badge badge-amber"}>
            {isFirebaseEnabled ? "Firebase" : "Demo data"}
          </span>
          <label className="user-switch">
            <span className="muted small">Viewing as</span>
            <select
              value={currentUser?.id || ""}
              onChange={(e) => switchUser(e.target.value)}
              aria-label="Switch demo learner"
            >
              {learners.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
