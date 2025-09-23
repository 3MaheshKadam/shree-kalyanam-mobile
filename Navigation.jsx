import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Animated,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useEffect, useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "context/SessionContext";
import MatchesScreen from "./screens/MatchesScreen";
import InterestsScreen from "./screens/InterestsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import MatrimonialLoginScreen from "./screens/LoginScreen";
import PremiumTabBar from "./BottomNavBar";

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const { width: screenWidth } = Dimensions.get("window");

// Enhanced Color Palette for Matrimony Theme
const COLORS = {
  primary: "#E91E63",
  primaryLight: "#F06292",
  primaryDark: "#C2185B",
  secondary: "#f59e0b",
  accent: "#ec4899",
  inactive: "#64748b",
  background: "#ffffff",
  backgroundSecondary: "#f8fafc",
  border: "#e2e8f0",
  shadow: "#0f172a",
  success: "#10b981",
  gradientPrimary: ["#E91E63", "#F06292"],
  gradient1: ["#fdf2f8", "#fce7f3", "#fbcfe8"],
  gradient2: ["#ffffff", "#f9fafb"],
  cardGradient: ["#ffffff", "#fefbff"],
};

/* ---------------- Onboarding Screen ---------------- */
function OnboardingScreen({ setHasSeenOnboarding }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      setHasSeenOnboarding(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Onboarding
          pages={[
            {
              backgroundColor: COLORS.background,
              image: (
                <Image
                  source={require("./assets/welcome.png")}
                  style={{
                    width: screenWidth * 0.8,
                    height: screenWidth * 0.8,
                    resizeMode: "contain",
                  }}
                />
              ),
              title: (
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: COLORS.primary,
                    textAlign: "center",
                  }}
                >
                  Welcome to Our Matrimony App
                </Text>
              ),
              subtitle: (
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.inactive,
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  Discover meaningful connections and start your journey to find your perfect match.
                </Text>
              ),
            },
            {
              backgroundColor: COLORS.background,
              image: (
                <Image
                  source={require("./assets/features.png")}
                  style={{
                    width: screenWidth * 0.8,
                    height: screenWidth * 0.8,
                    resizeMode: "contain",
                  }}
                />
              ),
              title: (
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: COLORS.primary,
                    textAlign: "center",
                  }}
                >
                  Explore Amazing Features
                </Text>
              ),
              subtitle: (
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.inactive,
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  Connect with matches, share interests, and build relationships with our smart tools.
                </Text>
              ),
            },
            {
              backgroundColor: COLORS.background,
              image: (
                <Image
                  source={require("./assets/connect.png")}
                  style={{
                    width: screenWidth * 0.8,
                    height: screenWidth * 0.8,
                    resizeMode: "contain",
                  }}
                />
              ),
              title: (
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: COLORS.primary,
                    textAlign: "center",
                  }}
                >
                  Connect with Your Match
                </Text>
              ),
              subtitle: (
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.inactive,
                    textAlign: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  Join our community and start connecting with people who share your values.
                </Text>
              ),
            },
          ]}
          onDone={completeOnboarding}
          onSkip={completeOnboarding}
          bottomBarHighlight={false}
          nextLabel="Next"
          skipLabel="Skip"
          DoneButtonComponent={({ onPress }) => (
            <Pressable
              onPress={onPress}
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 25,
                marginRight: 16,
              }}
            >
              <Text style={{ color: COLORS.background, fontSize: 16, fontWeight: "bold" }}>
                Get Started
              </Text>
            </Pressable>
          )}
          NextButtonComponent={({ onPress }) => (
            <Pressable
              onPress={onPress}
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 25,
                marginRight: 16,
              }}
            >
              <Text style={{ color: COLORS.background, fontSize: 16, fontWeight: "bold" }}>
                Next
              </Text>
            </Pressable>
          )}
          SkipButtonComponent={({ onPress }) => (
            <Pressable
              onPress={onPress}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 25,
                marginLeft: 16,
              }}
            >
              <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: "bold" }}>
                Skip
              </Text>
            </Pressable>
          )}
          containerStyles={{ paddingBottom: 50 }}
          titleStyles={{ marginTop: 20 }}
          subTitleStyles={{ marginTop: 10 }}
          bottomBarColor={COLORS.background}
          dotStyle={{
            backgroundColor: COLORS.inactive,
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
          activeDotStyle={{
            backgroundColor: COLORS.primary,
            width: 12,
            height: 12,
            borderRadius: 6,
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

/* ---------------- Main Tab Navigator ---------------- */
function MainTabs() {
  return (
    <View className="flex-1">
      <LinearGradient colors={COLORS.gradient1} className="flex-1">
        <Tab.Navigator
          initialRouteName="Matches"
          tabBar={(props) => <PremiumTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tab.Screen name="Matches" component={MatchesScreen} />
          <Tab.Screen name="Interests" component={InterestsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </LinearGradient>
    </View>
  );
}

/* ---------------- Enhanced Loading Screen ---------------- */
function LoadingScreen() {
  const pulseValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  return (
    <LinearGradient
      colors={COLORS.gradient1}
      className="flex-1 justify-center items-center"
    >
      <Animated.View
        style={{
          transform: [
            { scale: pulseValue },
            {
              rotate: rotateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
        }}
        className="items-center p-12 rounded-3xl bg-white/90 shadow-2xl"
      >
        <View className="relative">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <View
            className="absolute inset-0 rounded-full border-2 border-dashed opacity-30"
            style={{ borderColor: COLORS.primaryLight }}
          />
        </View>
        <Text
          className="text-gray-700 font-bold mt-6 text-xl"
          style={{ color: COLORS.primary }}
        >
          Loading...
        </Text>
        <Text className="text-gray-500 font-medium mt-2 text-base">
          Preparing your matches
        </Text>
        <View className="flex-row mt-4 space-x-1">
          <View className="w-2 h-2 rounded-full bg-pink-300" />
          <View className="w-2 h-2 rounded-full bg-purple-300" />
          <View className="w-2 h-2 rounded-full bg-amber-300" />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

/* ---------------- Root Navigator with Auth Check and Onboarding ---------------- */
export default function Navigation() {
  const { user, loading } = useSession();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        setHasSeenOnboarding(value === "true");
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasSeenOnboarding(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  if (loading || hasSeenOnboarding === null) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasSeenOnboarding ? (
            <Stack.Screen
              name="Onboarding"
              component={(props) => (
                <OnboardingScreen {...props} setHasSeenOnboarding={setHasSeenOnboarding} />
              )}
            />
          ) : user ? (
            <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login" component={MatrimonialLoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}