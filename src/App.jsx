import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Recipe from "./pages/Recipe.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
      </Routes>
    </>
  );
}
