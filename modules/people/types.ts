export interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;

  role: "owner" | "member";
  projects?: { projectId: string }[];
}
