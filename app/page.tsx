"use client"

import { useState } from "react"
import { TaskBoard } from "@/components/task-board"
import { TaskFilters } from "@/components/task-filters"
import { TaskForm } from "@/components/task-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ListTodo } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Task Manager</h1>
              <p className="text-muted-foreground">Drag and drop tasks between columns to change their status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/recipes">
              <Button variant="outline">View Recipes</Button>
            </Link>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm onSuccess={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <TaskFilters />
        </div>

        <TaskBoard />
      </div>
    </div>
  )
}
