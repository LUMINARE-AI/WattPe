import { redirect } from "next/navigation";

export default function AdminProjectsRedirect() {
  redirect("/dashboard/user/projects");
}
