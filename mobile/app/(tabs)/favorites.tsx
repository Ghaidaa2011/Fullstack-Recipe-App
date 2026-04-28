import { favoritesStyles } from "@/assets/styles/favorites.styles";
import LoadingSpinner from "@/components/LoadingSpinner";
import NoFavoritesFound from "@/components/NoFavoritesFound";
import RecipeCard from "@/components/RecipeCard";
import { API_URL } from "@/constants/api";
import { COLORS } from "@/constants/colors";
import { FavoriteDB, Meal } from "@/types/meal.types";
import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          setLoading(true); // مهم
          const response = await fetch(`${API_URL}/favorites/${user?.id}`);
          if (!response.ok) throw new Error("Failed to fetch favorites");

          const favorites: FavoriteDB[] = await response.json();

          const transformedFavorites = favorites.map((favorite) => ({
            ...favorite,
            id: favorite.recipeId.toString(),
            servings: Number(favorite.servings) || 0,
          }));

          setFavoriteRecipes(transformedFavorites);
        } catch (error) {
          console.error("Error fetching favorites:", error);
          Alert.alert("Error", "Failed to load your favorite recipes.");
        } finally {
          setLoading(false);
        }
      };

      if (user?.id) {
        loadFavorites();
      }
    }, [user?.id]),
  );
  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => signOut() },
    ]);
  };
  if (loading) return <LoadingSpinner message="Loading your favorites..." />;
  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity
            style={favoritesStyles.logoutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;
