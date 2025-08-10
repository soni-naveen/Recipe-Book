import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Users, ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RecipeDetailPage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recipeId) {
      fetchRecipeDetail(recipeId);
    }
  }, [recipeId]);

  const fetchRecipeDetail = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${
          import.meta.env.VITE_REACT_SPOONACULAR_API_KEY
        }&includeNutrition=true`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      setError("Failed to load recipe details. Please try again later.");
      console.error("Error fetching recipe details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-lg text-gray-600">Loading recipe details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error || "Recipe not found"}
              </div>
              <Button
                onClick={() => fetchRecipeDetail(params.id)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const instructions = recipe.analyzedInstructions?.[0]?.steps || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Button>

        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={
                recipe.image ||
                "/placeholder.svg?height=400&width=800&query=delicious recipe"
              }
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {recipe.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {recipe.readyInMinutes} minutes
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center">
                    <ChefHat className="h-4 w-4 mr-1" />
                    {recipe.cuisines?.[0] || "International"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>About This Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      recipe.summary
                        ?.replace(/<a[^>]*>/g, "")
                        .replace(/<\/a>/g, "") ||
                      "A delicious recipe you'll love!",
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {recipe.cuisines?.map((cuisine) => (
                    <Badge key={cuisine} variant="secondary">
                      {cuisine}
                    </Badge>
                  ))}
                  {recipe.dishTypes?.slice(0, 3).map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                {instructions.length > 0 ? (
                  <ol className="space-y-4">
                    {instructions.map((instruction) => (
                      <li key={instruction.number} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {instruction.number}
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {instruction.step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500 italic">
                    Detailed instructions will be available soon. Check back
                    later!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                {recipe.extendedIngredients &&
                recipe.extendedIngredients.length > 0 ? (
                  <ul className="space-y-2">
                    {recipe.extendedIngredients.map((ingredient) => (
                      <li
                        key={ingredient.id}
                        className="flex justify-between items-start text-sm"
                      >
                        <span className="text-gray-700">{ingredient.name}</span>
                        <span className="text-gray-500 ml-2 text-right">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic text-sm">
                    Ingredient list will be available soon!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Nutrition (if available) */}
            {recipe.nutrition?.nutrients && (
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Facts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recipe.nutrition.nutrients.slice(0, 6).map((nutrient) => (
                      <div
                        key={nutrient.name}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">{nutrient.name}</span>
                        <span className="text-gray-500">
                          {Math.round(nutrient.amount)}
                          {nutrient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prep Time</span>
                  <span className="font-medium">
                    {Math.round(recipe.readyInMinutes * 0.3)} min
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Cook Time</span>
                  <span className="font-medium">
                    {Math.round(recipe.readyInMinutes * 0.7)} min
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-medium">
                    {recipe.readyInMinutes} min
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Servings</span>
                  <span className="font-medium">{recipe.servings}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
