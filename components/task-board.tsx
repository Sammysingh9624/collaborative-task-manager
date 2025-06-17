"use client";

import type React from "react";

import { useTaskStore } from "@/lib/store";
import type { Task, TaskStatus } from "@/lib/types";
import { useState } from "react";
import { TaskCard } from "./task-card";

const statusColumns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "To Do", title: "To Do", color: "bg-gray-50 dark:bg-gray-900" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "Done", title: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

export function TaskBoard() {
  const { getFilteredTasks, updateTask } = useTaskStore();
  const tasks = getFilteredTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.opacity = "1";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();

    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus });
    }

    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;
        const canDrop = draggedTask && draggedTask.status !== column.id;

        return (
          <div
            key={column.id}
            className={`rounded-lg p-4 transition-all duration-200 ${column.color} ${
              isDragOver && canDrop ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/30" : ""
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide">{column.title}</h3>
              <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">{columnTasks.length}</span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move transition-transform hover:scale-[1.02]"
                >
                  <TaskCard task={task} />
                </div>
              ))}

              {isDragOver && canDrop && (
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 text-center text-blue-600 dark:text-blue-400">
                  Drop task here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
