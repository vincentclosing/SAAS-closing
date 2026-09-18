import "server-only";
import { getSession } from "@/lib/session";

export class ForbiddenError extends Error {
  constructor(message = "Action réservée à l'administrateur.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new ForbiddenError();
  }
  return session;
}
