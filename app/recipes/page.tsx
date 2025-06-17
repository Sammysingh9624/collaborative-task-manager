"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ChevronLeft, ChevronRight, Eye, Loader2, Grid, List, X } from "lucide-react"
import type { Recipe } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"

async function fetchRecipes(search?: string): Promise<Recipe[]> {
  const url = search
    ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
    : "https://www.themealdb.com/api/json/v1/1/search.php?s="

  const response = await fetch(url)
  const data = await response.json()
  return data.meals || []
}

function getIngredients(recipe: Recipe): string[] {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string

    if (ingredient && ingredient.trim()) {
      ingredients.push(measure ? `${measure.trim()} ${ingredient.trim()}` : ingredient.trim())
    }
  }
  return ingredients
}

interface RecipeDetailsProps {
  recipe: Recipe
  onClose?: () => void
}

function RecipeDetails({ recipe, onClose }: RecipeDetailsProps) {
  const ingredients = getIngredients(recipe)
  const isMobile = useMobile()

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile close button */}
      {isMobile && onClose && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Recipe image and basic info */}
      <div className="flex flex-col gap-4">
        <img
          src={recipe.strMealThumb || "/placeholder.svg?height=200&width=300"}
          alt={recipe.strMeal}
          className="w-full h-48 md:h-64 object-cover rounded-lg"
        />

        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3">Ingredients ({ingredients.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center p-2 bg-secondary/50 rounded-md">
                <span className="text-sm">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-3">Instructions</h3>
        <ScrollArea className="h-[200px] md:h-[300px] w-full rounded-md border p-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-line">{recipe.strInstructions}</p>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

interface MobileRecipeCardProps {
  recipe: Recipe
}

function MobileRecipeCard({ recipe }: MobileRecipeCardProps) {
  const ingredients = getIngredients(recipe)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={recipe.strMealThumb || "/placeholder.svg?height=80&width=80"}
              alt={recipe.strMeal}
              className="w-20 h-20 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{recipe.strMeal}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {ingredients.slice(0, 2).map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {ingredient.length > 10 ? `${ingredient.slice(0, 10)}...` : ingredient}
                  </Badge>
                ))}
                {ingredients.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{ingredients.length - 2}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{recipe.strInstructions}</p>
              <Button size="sm" onClick={() => setIsOpen(true)} className="w-full">
                <Eye className="h-3 w-3 mr-1" />
                View Recipe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-optimized modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-none h-[90vh] max-h-none m-0 p-0 rounded-lg">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-lg pr-8">{recipe.strMeal}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 px-4 pb-4">
            <RecipeDetails recipe={recipe} onClose={() => setIsOpen(false)} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function RecipesPage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [localSearch, setLocalSearch] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const isMobile = useMobile()
  const itemsPerPage = isMobile ? 5 : 10

  // Auto-switch to cards view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode("cards")
    }
  }, [isMobile])

  // Debounce API search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const {
    data: recipes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", debouncedSearch],
    queryFn: () => fetchRecipes(debouncedSearch),
    staleTime: 5 * 60 * 1000,
  })

  // Filter recipes based on local search
  const filteredRecipes = useMemo(() => {
    if (!localSearch) return recipes
    return recipes.filter((recipe) => recipe.strMeal.toLowerCase().includes(localSearch.toLowerCase()))
  }, [recipes, localSearch])

  // Paginate filtered recipes
  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredRecipes.slice(startIndex, endIndex)
  }, [filteredRecipes, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLocalSearchChange = (value: string) => {
    setLocalSearch(value)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Recipe Collection</h1>

        {/* Search Controls */}
        <div className="space-y-4">
          {/* API Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recipes from API..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table Search and View Toggle */}
          {recipes.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Filter results..."
                  value={localSearch}
                  onChange={(e) => handleLocalSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {!isMobile && (
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading recipes...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600">Error loading recipes. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {/* No Results States */}
      {!isLoading && recipes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No recipes found. Try a different search term.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && filteredRecipes.length === 0 && recipes.length > 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No recipes match your filter. Try a different search term.</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && paginatedRecipes.length > 0 && (
        <>
          {/* Mobile Cards View */}
          {(isMobile || viewMode === "cards") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{filteredRecipes.length} recipes found</span>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              {paginatedRecipes.map((recipe) => (
                <MobileRecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          )}

          {/* Desktop Table View */}
          {!isMobile && viewMode === "table" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recipes ({filteredRecipes.length} total)</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Ingredients</TableHead>
                        <TableHead className="w-[300px]">Instructions</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRecipes.map((recipe) => {
                        const ingredients = getIngredients(recipe)

                        return (
                          <TableRow key={recipe.idMeal}>
                            <TableCell>
                              <img
                                src={recipe.strMealThumb || "/placeholder.svg?height=60&width=60"}
                                alt={recipe.strMeal}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="max-w-[200px]">
                                <p className="truncate" title={recipe.strMeal}>
                                  {recipe.strMeal}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[250px]">
                                <div className="flex flex-wrap gap-1">
                                  {ingredients.slice(0, 3).map((ingredient, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {ingredient.length > 12 ? `${ingredient.slice(0, 12)}...` : ingredient}
                                    </Badge>
                                  ))}
                                  {ingredients.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{ingredients.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[300px]">
                                <p className="text-sm text-muted-foreground line-clamp-3">{recipe.strInstructions}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                                  <DialogHeader>
                                    <DialogTitle>{recipe.strMeal}</DialogTitle>
                                  </DialogHeader>
                                  <ScrollArea className="max-h-[60vh]">
                                    <RecipeDetails recipe={recipe} />
                                  </ScrollArea>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredRecipes.length)} of {filteredRecipes.length} recipes
              </div>

              <div className="flex items-center space-x-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Previous</span>}
                </Button>

                {/* Mobile: Show only current page */}
                {isMobile ? (
                  <div className="flex items-center px-3 py-1 text-sm">
                    {currentPage} / {totalPages}
                  </div>
                ) : (
                  /* Desktop: Show page numbers */
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {!isMobile && <span className="mr-1">Next</span>}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
