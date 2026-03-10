import { Redirect } from "expo-router";

import { useAuth } from "@/lib/auth-context";

export default function IndexScreen() {
  const { hydrated, user } = useAuth();

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href={user.role === "scout" ? "/(scout)/discovery" : "/(player)/dashboard"} />;
}
