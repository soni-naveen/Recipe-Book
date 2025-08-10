import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCuisine]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
          import.meta.env.VITE_REACT_SPOONACULAR_API_KEY
        }&number=9&addRecipeInformation=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      setError("Failed to load recipes. Please try again later.");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine !== "all") {
      filtered = filtered.filter((recipe) =>
        recipe.cuisines.some(
          (cuisine) => cuisine.toLowerCase() === selectedCuisine.toLowerCase()
        )
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterRecipes();
  };

  const cuisines = ["all", "chinese", "cajun", "asian", "american", "indian"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-lg text-gray-600">
                Loading delicious recipes...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <Button
                onClick={fetchRecipes}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Recipe Book</h1>
          <p className="text-lg text-gray-600">
            Discover amazing recipes from around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine === "all"
                        ? "All Cuisines"
                        : cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No recipes found. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipe/${recipe.id}`}>
                <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <CardHeader className="p-0">
                    <div className="relative h-60 overflow-hidden rounded-t-lg">
                      <img
                        src={
                          recipe.image ||
                          "/placeholder.svg?height=200&width=300&query=delicious food"
                        }
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </CardTitle>
                    <p
                      className="text-sm text-gray-600 line-clamp-3 mb-3"
                      dangerouslySetInnerHTML={{
                        __html:
                          recipe.summary?.replace(/<[^>]*>/g, "") ||
                          "Delicious recipe waiting to be discovered!",
                      }}
                    />
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.cuisines?.slice(0, 2).map((cuisine) => (
                        <Badge
                          key={cuisine}
                          variant="secondary"
                          className="text-xs"
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
                    <span>🕒 {recipe.readyInMinutes} min</span>
                    <span>👥 {recipe.servings} servings</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
