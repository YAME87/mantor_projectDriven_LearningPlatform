"use client";

// Keeps track of "who is using the app right now".
// There is no real login yet: the header lets you switch between demo learners,
// which is handy for showing teamwork during the pitch.
import { createContext, useContext, useEffect, useState } from "react";
import { getUsers } from "@/lib/db";

const UserContext = createContext(null);
const STORAGE_KEY = "pdl-current-user";

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    getUsers().then((all) => {
      setUsers(all);
      let saved = null;
      try {
        saved = window.localStorage.getItem(STORAGE_KEY);
      } catch {}
      const learners = all.filter((u) => u.role === "learner");
      const valid = learners.find((u) => u.id === saved);
      setCurrentUserId(valid ? valid.id : learners[0]?.id || null);
    });
  }, []);

  function switchUser(id) {
    setCurrentUserId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  }

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const userName = (id) => users.find((u) => u.id === id)?.name || "Unknown";

  return (
    <UserContext.Provider value={{ users, currentUser, switchUser, userName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
