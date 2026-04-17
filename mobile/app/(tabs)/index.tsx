import { homeStyles } from "@/assets/styles/home.styles";
import CategoryFilter from "@/components/CategoryFilter";
import RecipeCard from "@/components/RecipeCard";
import { COLORS } from "@/constants/colors";
import { MealAPI } from "@/services/mealAPI";
import { Meal, MealAPIResponse, UICategory } from "@/types/meal.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomeScreen = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<UICategory[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Meal | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  //Load Categories, Random Meals(Recipes), Featured Recipe(Random Meal)
  const loadData = async () => {
    try {
      setLoading(true);

      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(), //categories
        MealAPI.getRandomMeals(12), //recipes
        MealAPI.getRandomMeal(), //featuredRecipe
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));
      setCategories(transformedCategories);

      const transformedMeals = randomMeals
        .map((meal) => MealAPI.transformMealData(meal))
        .filter((meal) => meal != null);
      setRecipes(transformedMeals);

      const transformedFeatured = MealAPI.transformMealData(featuredMeal!);
      setFeaturedRecipe(transformedFeatured);
    } catch (error) {
      console.log("Error loading the data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (categoryName: string) => {
    try {
      const meals = await MealAPI.filterByCategory(categoryName);
      const transformedMeals = meals
        .map((meal: MealAPIResponse) => MealAPI.transformMealData(meal))
        .filter((meal: Meal | null) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (categoryName: string) => {
    setSelectedCategory(categoryName);
    await loadCategoryData(categoryName);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedCategory(null);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/*  ANIMAL ICONS */}
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("@/assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/cow.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>
        {/* FEATURED SECTION */}
        {featuredRecipe && (
          // Featured Recipe Section
          <View style={homeStyles.featuredSection}>
            {/* Featured Recipe Card */}
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              {/* Image Container */}
              <View style={homeStyles.featuredImageContainer}>
                {/* Image */}
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />

                {/* Image Overlay */}
                <View style={homeStyles.featuredOverlay}>
                  {/* Badge */}
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>
                  {/* Feature content */}

                  <View style={homeStyles.featuredContent}>
                    {/* Title */}
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>
                    {/* Meta Data */}
                    <View style={homeStyles.featuredMeta}>
                      {/* Cook Time */}
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredRecipe.cookTime}
                        </Text>
                      </View>
                      {/* Servings */}
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="people-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredRecipe.servings}
                        </Text>
                      </View>
                      {/* Area  */}
                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons
                            name="location-outline"
                            size={16}
                            color={COLORS.white}
                          />
                          <Text style={homeStyles.metaText}>
                            {featuredRecipe.area}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* CATEGORIES */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
        {/* RECIPES */}
        <View style={homeStyles.recipesSection}>
          {/* Category Name  */}
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory
                ? `${selectedCategory} Recipes`
                : "Discover Random Recipes"}
            </Text>
          </View>
          {/* Recipes List */}
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons
                  name="restaurant-outline"
                  size={64}
                  color={COLORS.textLight}
                />
                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                <Text style={homeStyles.emptyDescription}>
                  Try a different category
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
