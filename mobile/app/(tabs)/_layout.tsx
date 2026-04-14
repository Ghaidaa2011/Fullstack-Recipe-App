import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

const TabsLayout = () => {
  // Protected Routes
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href={"./(auth)/sign-in"} />;
  return <Stack />;
};
export default TabsLayout;
