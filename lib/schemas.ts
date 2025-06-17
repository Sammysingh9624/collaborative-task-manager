import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.date().optional(),
  assignee: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskSchema>
