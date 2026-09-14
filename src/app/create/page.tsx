import { cookies } from "next/headers";
import { CreateApp } from "@/components/CreateApp";
import { UNLOCK_COOKIE, verifyUnlockToken } from "@/lib/unlock";

export const metadata = {
  title: "Create — FirstBuck",
  description: "Generate your $1–$9 micro-offer pack from a rough idea.",
};

export default async function CreatePage() {
  const jar = await cookies();
  const unlocked = await verifyUnlockToken(jar.get(UNLOCK_COOKIE)?.value);

  return <CreateApp initialUnlocked={unlocked} />;
}
