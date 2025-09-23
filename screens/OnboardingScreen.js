import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from 'context/SessionContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced Color Palette (matching your existing theme)
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
  onboardingGradient: ["#E91E63", "#F06292", "#BA68C8"],
};

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to LoveConnect',
    subtitle: 'Find your perfect life partner',
    description: 'Join thousands of verified profiles and discover meaningful connections that lead to beautiful marriages.',
    image: require('assets/welcome.png'),
    icon: 'heart-circle',
    bgGradient: ["#E91E63", "#F06292"],
    accentColor: COLORS.primary,
  },
  {
    id: '2',
    title: 'Amazing Features',
    subtitle: 'Smart matching technology',
    description: 'Advanced compatibility algorithms, verified profiles, and privacy-first approach to help you find your soulmate.',
    image: require('assets/welcome.png'),
    icon: 'sparkles',
    bgGradient: ["#F06292", "#BA68C8"],
    accentColor: COLORS.accent,
  },
  {
    id: '3',
    title: 'Connect & Begin',
    subtitle: 'Start your journey today',
    description: 'Create your profile, set your preferences, and begin connecting with compatible matches in your area.',
    image: require('assets/welcome.png'),
    icon: 'people-circle',
    bgGradient: ["#BA68C8", "#E91E63"],
    accentColor: COLORS.secondary,
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Animations
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const floatingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation
    const floatingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingLoop.start();

    return () => floatingLoop.stop();
  }, []);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      completeOnboarding();
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderOnboardingItem = ({ item, index }) => {
    const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];
    
    return (
      <View style={{ width: screenWidth }} className="flex-1 items-center justify-center px-8 pb-12">
        <Animated.View
          style={{
            transform: [
              {
                translateY: floatingAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          }}
          className="items-center"
        >
          {/* Floating Icon Background */}
          <View className="relative mb-8">
            <View
              className="absolute w-32 h-32 rounded-full opacity-20"
              style={{
                backgroundColor: item.accentColor,
                shadowColor: item.accentColor,
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.3,
                shadowRadius: 40,
              }}
            />
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: floatingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '5deg'],
                    }),
                  },
                ],
              }}
              className="w-28 h-28 rounded-full items-center justify-center bg-white/95 shadow-xl"
            >
              <Ionicons name={item.icon} size={48} color={item.accentColor} />
            </Animated.View>
          </View>

          {/* Main Image */}
          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [
                {
                  scale: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            }}
            className="relative mb-10"
          >
            <View
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                shadowColor: COLORS.shadow,
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.15,
                shadowRadius: 30,
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: screenWidth * 0.7,
                  height: screenWidth * 0.7,
                  resizeMode: 'cover',
                }}
              />
              
              {/* Image Overlay for Better Text Contrast */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.1)']}
                className="absolute inset-0"
              />
            </View>

            {/* Decorative Elements */}
            <Animated.View
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                transform: [
                  {
                    rotate: floatingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '15deg'],
                    }),
                  },
                ],
              }}
            >
              <View
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: item.accentColor }}
              />
            </Animated.View>
            
            <Animated.View
              style={{
                position: 'absolute',
                bottom: -5,
                left: -5,
                transform: [
                  {
                    rotate: floatingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '-10deg'],
                    }),
                  },
                ],
              }}
            >
              <View
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `${item.accentColor}80` }}
              />
            </Animated.View>
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
            className="items-center"
          >
            <Text
              className="text-3xl font-bold text-center mb-3"
              style={{ color: COLORS.primary, letterSpacing: -0.5 }}
            >
              {item.title}
            </Text>
            
            <Text
              className="text-lg font-semibold text-center mb-4 opacity-80"
              style={{ color: COLORS.primaryDark }}
            >
              {item.subtitle}
            </Text>
            
            <Text className="text-gray-600 text-center leading-6 font-medium px-4">
              {item.description}
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    );
  };

  const renderPagination = () => (
    <View className="flex-row justify-center items-center space-x-3 mb-8">
      {ONBOARDING_DATA.map((_, index) => (
        <Animated.View
          key={index}
          style={{
            width: currentIndex === index ? 32 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: currentIndex === index ? COLORS.primary : COLORS.inactive,
            opacity: currentIndex === index ? 1 : 0.4,
          }}
          className="transition-all duration-300"
        />
      ))}
    </View>
  );

  const renderNavigationButtons = () => (
    <View className="px-8 pb-12">
      <View className="flex-row justify-between items-center">
        {/* Skip Button */}
        <Pressable
          onPress={handleSkip}
          className="py-4 px-6 rounded-2xl"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            backgroundColor: 'rgba(255,255,255,0.8)',
          })}
        >
          <Text className="text-gray-600 font-semibold text-base">Skip</Text>
        </Pressable>

        {/* Next/Get Started Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPress={handleNext}
            className="flex-row items-center py-4 px-8 rounded-2xl shadow-lg"
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <LinearGradient
              colors={COLORS.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0 rounded-2xl"
            />
            
            {Platform.OS === 'ios' && (
              <BlurView intensity={20} tint="light" className="absolute inset-0 rounded-2xl" />
            )}
            
            <Text className="text-white font-bold text-base mr-2">
              {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons 
              name={currentIndex === ONBOARDING_DATA.length - 1 ? 'arrow-forward-circle' : 'arrow-forward'} 
              size={20} 
              color="white" 
            />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={COLORS.onboardingGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Background Elements */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 100,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.1)',
          transform: [
            {
              rotate: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}
      />
      
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 200,
          left: -80,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: 'rgba(255,255,255,0.08)',
          transform: [
            {
              rotate: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['360deg', '0deg'],
              }),
            },
          ],
        }}
      />

      {/* Main Content */}
      <View className="flex-1" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 40 }}>
        {/* Header */}
        <View className="items-center mb-8">
          <Animated.View
            style={{
              opacity: fadeAnimation,
              transform: [
                {
                  translateY: slideAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            }}
            className="items-center"
          >
            {/* Logo/Brand */}
            <View className="w-16 h-16 rounded-full bg-white/90 items-center justify-center mb-4 shadow-lg">
              <Ionicons name="heart" size={32} color={COLORS.primary} />
            </View>
            
            <Text className="text-white text-lg font-semibold opacity-90">
              Step {currentIndex + 1} of {ONBOARDING_DATA.length}
            </Text>
          </Animated.View>
        </View>

        {/* Slides */}
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={ONBOARDING_DATA}
            renderItem={renderOnboardingItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
            bounces={false}
            decelerationRate="fast"
          />
        </View>

        {/* Bottom Section with Glass Effect */}
        <View className="relative">
          {Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" className="absolute inset-0" />
          ) : (
            <View className="absolute inset-0 bg-white/80" />
          )}
          
          {/* Pagination */}
          {renderPagination()}
          
          {/* Navigation Buttons */}
          {renderNavigationButtons()}
        </View>
      </View>

      {/* Floating Hearts Animation */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          opacity: floatingAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.7, 0.3],
          }),
          transform: [
            {
              translateY: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              }),
            },
          ],
        }}
      >
        <Ionicons name="heart" size={16} color="rgba(255,255,255,0.8)" />
      </Animated.View>
      
      <Animated.View
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          opacity: floatingAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.4, 0.8, 0.4],
          }),
          transform: [
            {
              translateY: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }),
            },
          ],
        }}
      >
        <Ionicons name="heart-outline" size={12} color="rgba(255,255,255,0.6)" />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          opacity: floatingAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.2, 0.6, 0.2],
          }),
          transform: [
            {
              translateX: floatingAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        }}
      >
        <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.7)" />
      </Animated.View>
    </LinearGradient>
  );
}