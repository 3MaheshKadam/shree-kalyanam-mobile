import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Animated, Platform, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRef, useEffect } from "react";

// Elegant color palette
const COLORS = {
  primary: "#FF6B6B",
  primaryDark: "#FF5252",
  inactive: "#94A3B8",
  inactiveLight: "#CBD5E1", 
  background: "#ffffff",
  shadow: "#000000",
  accent: "#F1F5F9",
};

/* ---------------- Tab Button Component ---------------- */
function TabButton({ onPress, accessibilityState, route }) {
  const focused = accessibilityState?.selected;
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 1,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
      Animated.timing(backgroundAnim, {
        toValue: focused ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
  }, [focused]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 8,
      }),
    ]).start();
    
    onPress();
  };

  const getTabConfig = () => {
    const configs = {
      Matches: {
        icon: "heart-circle",
        iconOutline: "heart-circle-outline",
        label: "Discover",
        hasNotification: true,
        notificationCount: 2,
      },
      Interests: {
        icon: "chatbubble-ellipses",
        iconOutline: "chatbubble-ellipses-outline", 
        label: "Intrested",
        hasNotification: false,
      },
      Profile: {
        icon: "person-circle",
        iconOutline: "person-circle-outline",
        label: "Profile",
        hasNotification: false,
      },
      Settings: {
        icon: "setting",
        iconOutline: "setting",
        label: "setting",
        hasNotification: false,
      },
    };
    return configs[route.name] || configs.Matches;
  };

  const config = getTabConfig();

  return (
    <Pressable onPress={handlePress} style={styles.tabButton}>
      <Animated.View 
        style={[
          styles.tabContent,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        {/* Background Circle for Active State */}
        <Animated.View 
          style={[
            styles.activeBackground,
            {
              opacity: backgroundAnim,
              transform: [{ scale: backgroundAnim }]
            }
          ]}
        />

        {/* Icon Container */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: iconScale }] }
          ]}
        >
          <Ionicons
            name={focused ? config.icon : config.iconOutline}
            size={28}
            color={focused ? COLORS.primary : COLORS.inactive}
          />
          
          {/* Notification Badge */}
          {config.hasNotification && !focused && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{config.notificationCount}</Text>
            </View>
          )}
        </Animated.View>

        {/* Label */}
        <Text 
          style={[
            styles.label,
            { 
              color: focused ? COLORS.primary : COLORS.inactive,
              fontWeight: focused ? '600' : '500',
              opacity: focused ? 1 : 0.8,
            }
          ]}
        >
          {config.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/* ---------------- Main Tab Bar ---------------- */
export default function ElegantTabBar({ state, descriptors, navigation }) {
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      {/* Main Tab Bar */}
      <View style={styles.tabBar}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={95} tint="extraLight" style={styles.blurContainer}>
            <View style={styles.tabContainer}>
              {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };

                return (
                  <TabButton
                    key={route.key}
                    onPress={onPress}
                    accessibilityState={{ selected: isFocused }}
                    route={route}
                  />
                );
              })}
            </View>
          </BlurView>
        ) : (
          <View style={styles.androidContainer}>
            <View style={styles.tabContainer}>
              {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                  }
                };

                return (
                  <TabButton
                    key={route.key}
                    onPress={onPress}
                    accessibilityState={{ selected: isFocused }}
                    route={route}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Subtle Top Separator */}
        <View style={styles.topSeparator} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
  },
  blurContainer: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  androidContainer: {
    backgroundColor: COLORS.background,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.inactiveLight,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  activeBackground: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}08`,
    top: -2,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 6,
    zIndex: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  topSeparator: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 0.5,
    backgroundColor: COLORS.inactiveLight,
    opacity: 0.6,
  },
});