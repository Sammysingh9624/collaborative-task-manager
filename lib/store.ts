import { create } from "zustand"
import type { Task, TaskStatus, TaskPriority } from "./types"

interface TaskStore {
  tasks: Task[]
  filters: {
    status?: TaskStatus
    priority?: TaskPriority
    search?: string
  }
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setFilter: (key: keyof TaskStore["filters"], value: string | undefined) => void
  clearFilters: () => void
  getFilteredTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    {
      id: "1",
      title: "Setup project structure",
      description: "Initialize Next.js project with required dependencies",
      status: "Done",
      priority: "High",
      assignee: "John Doe",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      title: "Implement task CRUD operations",
      description: "Create, read, update, and delete tasks functionality",
      status: "In Progress",
      priority: "High",
      dueDate: new Date("2024-01-15"),
      assignee: "Jane Smith",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "3",
      title: "Add drag and drop functionality",
      description: "Implement drag and drop for task status changes",
      status: "To Do",
      priority: "Medium",
      dueDate: new Date("2024-01-20"),
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
    },
  ],
  filters: {},

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    set((state) => ({ tasks: [...state.tasks, newTask] }))
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)),
    }))
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }))
  },

  clearFilters: () => {
    set({ filters: {} })
  },

  getFilteredTasks: () => {
    const { tasks, filters } = get()
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false
      if (filters.priority && task.priority !== filters.priority) return false
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
  },
}))
