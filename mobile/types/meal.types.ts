export interface MealAPIResponse {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;

  // ingredients & measures (dynamic)
  [key: string]: any;
}
export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  servings: number;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string[];
  originalData: MealAPIResponse;
}
export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}
export interface UICategory {
  id: number;
  name: string;
  image: string;
  description: string;
};