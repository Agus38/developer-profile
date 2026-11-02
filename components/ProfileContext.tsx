"use client";

import { createContext, ReactNode, useContext } from "react";
import { profile as fallbackProfile, type Profile } from "@/data/profile";

const ProfileContext = createContext<Profile>(fallbackProfile);

export function ProfileProvider({ value, children }: { value: Profile; children: ReactNode }) {
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  return useContext(ProfileContext);
}
