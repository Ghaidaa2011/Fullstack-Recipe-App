import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}
const Provider = ClerkProvider as any;
export default function RootLayout() {
  return (
    <Provider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </Provider>
  );
}
