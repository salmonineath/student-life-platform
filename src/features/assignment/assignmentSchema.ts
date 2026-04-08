// src/features/assignment/assignmentSchema.ts
import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  subject: z.string().min(2, "Subject must be at least 2 characters"), // changed from major
  dueDate: z.string().nonempty("Due date is required"),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;