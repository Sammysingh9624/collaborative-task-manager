export type TaskStatus = "To Do" | "In Progress" | "Done"
export type TaskPriority = "Low" | "Medium" | "High"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  assignee?: string
  createdAt: Date
  updatedAt: Date
}

export interface Recipe {
  idMeal: string
  strMeal: string
  strInstructions: string
  strMealThumb: string
  strIngredient1?: string
  strIngredient2?: string
  strIngredient3?: string
  strIngredient4?: string
  strIngredient5?: string
  strIngredient6?: string
  strIngredient7?: string
  strIngredient8?: string
  strIngredient9?: string
  strIngredient10?: string
  strMeasure1?: string
  strMeasure2?: string
  strMeasure3?: string
  strMeasure4?: string
  strMeasure5?: string
  strMeasure6?: string
  strMeasure7?: string
  strMeasure8?: string
  strMeasure9?: string
  strMeasure10?: string
}

export interface RecipeResponse {
  meals: Recipe[]
}
