  "use client";

  import { useState, useEffect, useRef } from "react";
  import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    SafeAreaView,
    StatusBar,
    Animated,
    TextInput,
    Dimensions,
    ScrollView,
    RefreshControl,
    Platform,
  } from "react-native";
  import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
  import { LinearGradient } from "expo-linear-gradient";
  import { BlurView } from "expo-blur";
  import { useSession } from "context/SessionContext";
  import Toast from "react-native-toast-message";
  import Reanimated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
  import { useNavigation } from "@react-navigation/native";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  const { width, height } = Dimensions.get("window");
  import { Easing } from "react-native";
  import "../global.css";

  const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";

  const COLORS = {
    primary: "#E91E63",
    primaryLight: "#F48FB1",
    primaryDark: "#C2185B",
    secondary: "#F44336",
    secondaryLight: "#FF7961",
    secondaryDark: "#D32F2F",
    accent: "#FF1744",
    accentSecondary: "#FF4081",
    gold: "#FFB300",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#D32F2F",
    inactive: "#BDBDBD",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceVariant: "#FFFFFF",
    outline: "#F8BBD0",
    outlineVariant: "#E57373",
    onSurface: "#3D3D3D",
    onSurfaceVariant: "#6D4C41",
    onSurfaceMuted: "#A1887F",
    surfaceContainer: "#FFEFF3",
    surfaceContainerLow: "#FFF7F9",
    surfaceContainerHigh: "#FFFFFF",
    surfaceContainerHighest: "#F8BBD0",
    gradientPrimary: ["#E91E63", "#F06292"],
    gradientSecondary: ["#F44336", "#E91E63"],
    gradientSurface: ["#FFFFFF", "#FFFFFF"],
    gradientCard: ["#FFFFFF", "#FFF5F7"],
    gradientGold: ["#FFD740", "#FFB300"],
  };

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const InterestsScreen = () => {
    const { user } = useSession();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState("received");
    const [sentInterests, setSentInterests] = useState([]);
    const [receivedInterests, setReceivedInterests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [checkingSubscription, setCheckingSubscription] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const headerAnim = useRef(new Animated.Value(-50)).current;
    const scrollY = useRef(new Animated.Value(0)).current;
    const [searchQuery, setSearchQuery] = useState('');
  const buttonScale = useRef(new Animated.Value(1)).current;
    const [expandedSections, setExpandedSections] = useState({
      basic: true,
      professional: true,
      family: true,
      astrological: false,
      preferences: false,
    });

    useEffect(() => {
      const initialize = async () => {
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.spring(scaleAnim, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
          Animated.spring(headerAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();
        setIsLoaded(true);
        await checkSubscription();
        await loadAllData();
      };
      initialize();
    }, [user]);

    const checkSubscription = async () => {
      setCheckingSubscription(true);
      try {
        const res = await fetch(`${BASE_URL}api/users/me`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!res.ok) {
          console.error("InterestsScreen: Subscription check failed with status:", res.status);
          throw new Error("Failed to check subscription");
        }
        const data = await res.json();
        setHasSubscription(data?.subscription?.isSubscribed || false);
      } catch (err) {
        console.error("InterestsScreen: Error checking subscription:", err);
        setHasSubscription(false);
      } finally {
        setCheckingSubscription(false);
      }
    };

    const maskFirstName = (fullName) => {
      if (!fullName) return "****";
      const names = fullName.split(" ");
      return names.length > 1 ? `${"*".repeat(names[0].length)} ${names.slice(1).join(" ")}` : "****";
    };

    const calculateAge = (dateString) => {
      if (!dateString) return "N/A";
      const birthDate = new Date(dateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const fetchInterests = async (type) => {
      try {
        const userId = user?.id || user?.user?.id;
        if (!userId) {
          console.error("InterestsScreen: Missing userId");
          return [];
        }
        const endpoint = type === "send"
          ? `${BASE_URL}api/interest/send?userId=${userId}`
          : `${BASE_URL}api/interest/received?userId=${userId}`;
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `Failed to fetch ${type} interests`);
        }
        const data = await response.json();
        return data.interests || [];
      } catch (err) {
        console.error(`InterestsScreen: Error fetching ${type} interests:`, err);
        throw err;
      }
    };

    const loadAllData = async () => {
      if (!user) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const [sent, received] = await Promise.all([
          fetchInterests("send"),
          fetchInterests("received"),
        ]);
        const validSent = sent.filter((item) => item?.receiver && item.receiver.name).map(item => ({
          ...item,
          compatibility: Math.round(Math.random() * 100),
          isVerified: Math.random() > 0.6,
          isNew: Math.random() > 0.7,
          lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
        }));
        const validReceived = received.filter((item) => item?.sender && item.sender.name).map(item => ({
          ...item,
          compatibility: Math.round(Math.random() * 100),
          isVerified: Math.random() > 0.6,
          isNew: Math.random() > 0.7,
          lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
        }));
        setSentInterests(validSent);
        setReceivedInterests(validReceived);
      } catch (err) {
        setError(err.message || "Failed to load interests");
        Toast.show({ type: "error", text1: "Failed to load interests", text2: err.message });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    const onRefresh = () => {
      setIsRefreshing(true);
      loadAllData();
    };

    const handleRetry = () => {
      loadAllData();
    };

    const handleInterestAction = async (action, interestId) => {
      try {
        const response = await fetch(`${BASE_URL}api/interest/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
          body: JSON.stringify({ status: action, interestId }),
        });
        if (!response.ok) throw new Error("Action failed");
        loadAllData();
        Toast.show({ type: "success", text1: `Interest ${action}` });
      } catch (err) {
        setError(err.message);
        Toast.show({ type: "error", text1: "Action failed", text2: err.message });
      }
    };

    const handleViewProfile = (person, type) => {
      if (!hasSubscription) {
        navigation.navigate("Subscription");
        return;
      }
      const profileData = type === "sent" ? person?.receiver : person?.sender;
      if (!profileData) {
        Toast.show({ type: "error", text1: "Profile data not available" });
        return;
      }
      setSelectedProfile({
        ...profileData,
        profilePhoto:
          profileData.profilePhoto ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&size=400&background=f3f4f6&color=374151`,
        age: calculateAge(profileData.dob),
        bio: profileData.bio || "Looking for a meaningful connection and lifelong partnership.",
        isVerified: person.isVerified,
        compatibility: person.compatibility,
        lastActive: person.lastActive,
        isNew: person.isNew,
      });
    };

    const toggleSection = (section) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };

    const getStatusBadgeColor = (status) => {
      if (status === "accepted") return COLORS.success;
      if (status === "declined") return COLORS.error;
      return COLORS.warning;
    };

    const getCompatibilityGradient = (percentage) => {
      if (percentage >= 85) return [COLORS.success, "#22d3ee"];
      if (percentage >= 70) return [COLORS.secondary, "#fbbf24"];
      return [COLORS.primary, COLORS.primaryLight];
    };

    const toggleSearchBar = () => {
      setShowSearchBar(!showSearchBar);
      Animated.timing(searchAnim, {
        toValue: showSearchBar ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const searchBarStyle = {
      opacity: searchAnim,
      transform: [
        {
          translateY: searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-20, 0],
          }),
        },
        {
          scale: searchAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        },
      ],
    };

    const headerScale = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.95],
      extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.9],
      extrapolate: 'clamp',
    });

    const tabBarScale = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0.95],
      extrapolate: 'clamp',
    });

const renderHeader = () => {
  

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    Animated.timing(searchAnim, {
      toValue: showSearchBar ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }).start();
  };

  const searchBarStyle = {
    opacity: searchAnim,
    transform: [
      {
        translateY: searchAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 0],
        }),
      },
      {
        scale: searchAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  const handleButtonPress = (callback) => {
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
    ]).start();
    callback();
  };

  return (
    <Animated.View
      style={{
        opacity: headerOpacity,
      }}
    >
      <LinearGradient
        colors={COLORS.gradientSurface}
        style={{
          paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 10,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.outline,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Main header content */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 24,
          paddingVertical: 8,
        }}>
          
          {/* Title section with enhanced typography */}
          <View style={{ flex: 1, paddingRight: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '800',
                color: COLORS.onSurface,
                letterSpacing: -1.2,
                lineHeight: 38,
                fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
              }}>
                Interests
              </Text>
              <View style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.accent,
                marginLeft: 8,
                marginTop: 4,
              }} />
            </View>
            
            <Text style={{
              fontSize: 14,
              color: COLORS.onSurfaceVariant,
              fontWeight: '500',
              letterSpacing: 0.2,
              fontFamily: Platform.OS === 'ios' ? 'San Francisco' : 'Roboto',
              lineHeight: 20,
            }}>
              Manage your connections
            </Text>
            
            {/* Subtle progress indicator */}
            <View style={{
              height: 2,
              backgroundColor: COLORS.outline,
              borderRadius: 1,
              marginTop: 8,
              width: '60%',
            }}>
              <View style={{
                height: 2,
                backgroundColor: COLORS.primary,
                borderRadius: 1,
                width: '65%',
              }} />
            </View>
          </View>
          
         
        </View>

       
      </LinearGradient>
    </Animated.View>
  );
};

    const tabs = [
      { 
        id: "received", 
        label: "Received", 
        count: receivedInterests.length, 
        icon: "mail", 
        color: COLORS.primary,
        gradient: COLORS.gradientPrimary
      },
      { 
        id: "sent", 
        label: "Sent", 
        count: sentInterests.length, 
        icon: "send", 
        color: COLORS.secondary,
        gradient: COLORS.gradientSecondary
      },
    ];

    const renderTabBar = () => (
      <Animated.View
        style={{
        }}
      >
        <View style={{
          backgroundColor: COLORS.background,
        }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ 
              paddingHorizontal: 12,
              paddingBottom: 12,
              gap: 10,
              paddingTop:12,
            }}
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <Reanimated.View key={tab.id} entering={FadeIn.delay(index * 100).duration(400)}>
                  <TouchableOpacity
                    onPress={() => setActiveTab(tab.id)}
                    activeOpacity={0.8}
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={tab.gradient}
                        style={{
                          borderRadius: 16,
                          paddingHorizontal: 10,
                          paddingVertical: 8,
                          elevation: 8,
                          shadowColor: tab.color,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 12,
                        }}
                      >
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 8 
                        }}>
                          <Ionicons 
                            name={tab.icon} 
                            size={18} 
                            color={COLORS.background} 
                          />
                          <Text style={{ 
                            color: COLORS.background,
                            fontSize: 14,
                            fontWeight: '700',
                            letterSpacing: 0.2,
                          }}>
                            {tab.label}
                          </Text>
                          <View style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            minWidth: 20,
                            alignItems: 'center',
                          }}>
                            <Text style={{ 
                              color: COLORS.background,
                              fontSize: 11,
                              fontWeight: '800',
                            }}>
                              {tab.count}
                            </Text>
                          </View>
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={{
                        backgroundColor: COLORS.surfaceContainer,
                        borderRadius: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                      }}>
                        <View style={{ 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 8 
                        }}>
                          <Ionicons 
                            name={tab.icon + "-outline"} 
                            size={18} 
                            color={COLORS.onSurfaceVariant} 
                          />
                          <Text style={{ 
                            color: COLORS.onSurfaceVariant,
                            fontSize: 14,
                            fontWeight: '600',
                          }}>
                            {tab.label}
                          </Text>
                          <View style={{
                            backgroundColor: COLORS.outline,
                            borderRadius: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            minWidth: 20,
                            alignItems: 'center',
                          }}>
                            <Text style={{ 
                              color: COLORS.onSurfaceVariant,
                              fontSize: 11,
                              fontWeight: '700',
                            }}>
                              {tab.count}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </Reanimated.View>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    );

    const renderInterestCard = ({ item: person, index }) => {
      const type = activeTab;
      if (!person) return null;
      const profile = type === "sent" ? person?.receiver : person?.sender;
      if (!profile || !profile.name) return null;
      const profileImage = profile?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "User")}&size=400&background=f3f4f6&color=374151`;
      const displayName = hasSubscription ? profile?.name : maskFirstName(profile?.name);

      return (
        <Reanimated.View 
          entering={FadeInDown.delay(index * 100).duration(600)}
          style={{
            marginBottom: 20,
            marginHorizontal: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => handleViewProfile(person, type)}
            activeOpacity={0.97}
            style={{
              backgroundColor: COLORS.background,
              borderRadius: 24,
              padding: 20,
              elevation: 8,
              shadowColor: COLORS.onSurface,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}
          >
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
            

              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {person.isNew && (
                  <View style={{
                    backgroundColor: COLORS.success,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                    <Text style={{ 
                      color: COLORS.background,
                      fontSize: 10,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}>
                      NEW
                    </Text>
                  </View>
                )}
                {person.isVerified && (
                  <View style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 12,
                    padding: 4,
                  }}>
                    <Ionicons name="checkmark" size={12} color={COLORS.background} />
                  </View>
                )}
                <View style={{
                  backgroundColor: getStatusBadgeColor(person.status),
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  minWidth: 80,
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: COLORS.background,
                    fontSize: 10,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}>
                    {person.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: profileImage }}
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 20,
                    backgroundColor: COLORS.surfaceContainer,
                  }}
                />
                {!hasSubscription && (
                  <BlurView
                    intensity={80}
                    tint="light"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
                  </BlurView>
                )}
                <View style={{
                  position: 'absolute',
                  bottom: 4,
                  right: 4,
                  backgroundColor: person.lastActive === 'Recently' ? COLORS.success : COLORS.inactive,
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  borderWidth: 2,
                  borderColor: COLORS.background,
                }} />
              </View>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: COLORS.onSurface,
                  letterSpacing: -0.3,
                  marginBottom: 4,
                }}>
                  {displayName}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: COLORS.onSurfaceVariant,
                  fontWeight: '500',
                  marginBottom: 8,
                  letterSpacing: -0.1,
                }}>
                  {calculateAge(profile?.dob)} years • {profile?.currentCity}
                </Text>
                <Text style={{
                  fontSize: 13,
                  color: COLORS.onSurfaceMuted,
                  fontWeight: '500',
                  marginBottom: 12,
                }}>
                  {profile?.education || "N/A"} • {person.lastActive}
                </Text>
                <View style={{ 
                  flexDirection: 'row', 
                  gap: 8, 
                  flexWrap: 'wrap' 
                }}>
                  <View style={{
                    backgroundColor: COLORS.surfaceContainerHigh,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}>
                    <Text style={{ 
                      fontSize: 11,
                      color: COLORS.onSurfaceVariant,
                      fontWeight: '600',
                    }}>
                      {profile?.caste || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={{
              fontSize: 14,
              color: COLORS.onSurfaceVariant,
              lineHeight: 20,
              marginBottom: 20,
              fontWeight: '400',
            }}>
              {profile.bio || "Looking for a meaningful connection and lifelong partnership."}
            </Text>

            <View style={{ 
              flexDirection: 'row', 
              gap: 12,
              justifyContent: type === "received" && person.status === "pending" ? 'space-between' : 'center',
            }}>
              {type === "received" && person.status === "pending" && (
                <>
                  <TouchableOpacity
                    onPress={() => handleInterestAction("declined", person._id)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.error, "#ef4444"]}
                      style={{
                        paddingVertical: 12,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Ionicons name="close" size={16} color={COLORS.background} />
                      <Text style={{ 
                        color: COLORS.background,
                        fontSize: 14,
                        fontWeight: '700',
                        letterSpacing: 0.2,
                      }}>
                        Decline
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleInterestAction("accepted", person._id)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={[COLORS.success, "#22c55e"]}
                      style={{
                        paddingVertical: 12,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Ionicons name="checkmark" size={16} color={COLORS.background} />
                      <Text style={{ 
                        color: COLORS.background,
                        fontSize: 14,
                        fontWeight: '700',
                        letterSpacing: 0.2,
                      }}>
                        Accept
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
              {(person.status !== "pending" || type === "sent") && (
                <TouchableOpacity
                  onPress={() => handleViewProfile(person, type)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={{
                      paddingVertical: 12,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons name="eye" size={16} color={COLORS.background} />
                    <Text style={{ 
                      color: COLORS.background,
                      fontSize: 14,
                      fontWeight: '700',
                      letterSpacing: 0.2,
                    }}>
                      View Profile
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Reanimated.View>
      );
    };

    const EnhancedInfoRow = ({ label, value, icon }) => (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flex: 1,
        }}>
          <View style={{
            backgroundColor: COLORS.primary + '15',
            borderRadius: 10,
            padding: 8,
          }}>
            <Ionicons name={`${icon}-outline`} size={16} color={COLORS.primary} />
          </View>
          <Text style={{
            fontSize: 14,
            color: COLORS.onSurfaceVariant,
            fontWeight: '600',
            flex: 1,
          }}>
            {label}
          </Text>
        </View>
        <Text style={{
          fontSize: 15,
          color: COLORS.onSurface,
          fontWeight: '600',
          textAlign: 'right',
          flex: 2,
        }}>
          {value}
        </Text>
      </View>
    );

    const renderProfileDetailModal = () => (
      <Modal
        visible={!!selectedProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedProfile(null)}
      >
        {selectedProfile && (
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <StatusBar barStyle="dark-content" />
            <BlurView
              intensity={95}
              tint="extraLight"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingVertical: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}>
                <View>
                  <Text style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: COLORS.onSurface,
                    letterSpacing: -0.5,
                  }}>
                    Profile Details
                  </Text>
                  <View style={{
                    width: 30,
                    height: 3,
                    backgroundColor: COLORS.primary,
                    borderRadius: 2,
                    marginTop: 4,
                  }} />
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedProfile(null)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 16,
                    padding: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Ionicons name="close" size={22} color={COLORS.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </BlurView>

            <ScrollView 
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 100 }}
            >
              <View style={{
                position: 'relative',
                width: '100%',
                height: 380,
                marginBottom: 24,
              }}>
                <LinearGradient
                  colors={COLORS.gradientSurface}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <View style={{
                  margin: 24,
                  borderRadius: 24,
                  overflow: 'hidden',
                  elevation: 20,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                }}>
                  <Image
                    source={{ uri: selectedProfile.profilePhoto }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'cover',
                    }}
                  />
                  {!hasSubscription && (
                    <BlurView
                      intensity={100}
                      tint="light"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <View style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 20,
                        padding: 16,
                      }}>
                        <Ionicons name="lock-closed" size={48} color={COLORS.background} />
                      </View>
                    </BlurView>
                  )}
                </View>
                <View style={{
                  position: 'absolute',
                  top: 32,
                  right: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 20,
                  padding: 4,
                  elevation: 12,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                }}>
          
                </View>
                {selectedProfile.isVerified && (
                  <View style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                    backgroundColor: COLORS.background,
                    borderRadius: 20,
                    padding: 10,
                    elevation: 8,
                    shadowColor: COLORS.success,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    borderWidth: 2,
                    borderColor: COLORS.success,
                  }}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  </View>
                )}
                <View style={{
                  position: 'absolute',
                  bottom: 32,
                  left: 32,
                  right: 120,
                }}>
                  <BlurView
                    intensity={80}
                    tint="dark"
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <View style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}>
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '800',
                        color: COLORS.background,
                        letterSpacing: -0.5,
                        marginBottom: 6,
                      }}>
                        {hasSubscription ? selectedProfile.name : maskFirstName(selectedProfile.name)}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={{
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: '600',
                        }}>
                          {selectedProfile.age} years
                        </Text>
                        <View style={{
                          width: 3,
                          height: 3,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.6)',
                        }} />
                        <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={{
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: '600',
                        }}>
                          {selectedProfile.currentCity}
                        </Text>
                      </View>
                    </View>
                  </BlurView>
                </View>
              </View>

              <View style={{ paddingHorizontal: 24 }}>
                <View style={{
                  backgroundColor: COLORS.surfaceContainer,
                  borderRadius: 20,
                  marginBottom: 20,
                  overflow: 'hidden',
                  elevation: 4,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('basic')}
                    activeOpacity={0.7}
                    style={{
                      padding: 24,
                    }}
                  >
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: expandedSections.basic ? 20 : 0,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <LinearGradient
                          colors={[COLORS.primary + '30', COLORS.primary + '10']}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                          }}
                        >
                          <Ionicons name="person" size={22} color={COLORS.primary} />
                        </LinearGradient>
                        <View>
                          <Text style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.onSurface,
                            letterSpacing: -0.3,
                            marginBottom: 2,
                          }}>
                            Basic Information
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.onSurfaceVariant,
                            fontWeight: '500',
                          }}>
                            Personal details and background
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.primary + '15',
                        borderRadius: 12,
                        padding: 8,
                      }}>
                        <Ionicons 
                          name={expandedSections.basic ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={COLORS.primary} 
                        />
                      </View>
                    </View>
                    {expandedSections.basic && (
                      <View style={{ 
                        gap: 16,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.outline + '30',
                      }}>
                        <EnhancedInfoRow 
                          label="Age" 
                          value={`${selectedProfile.age} years`} 
                          icon="calendar" 
                        />
                        <EnhancedInfoRow 
                          label="Location" 
                          value={selectedProfile.currentCity || "Not specified"} 
                          icon="location" 
                        />
                        <EnhancedInfoRow 
                          label="Education" 
                          value={selectedProfile.education || "Not specified"} 
                          icon="school" 
                        />
                        <EnhancedInfoRow 
                          label="Caste" 
                          value={selectedProfile.caste || "Not specified"} 
                          icon="people" 
                        />
                        <EnhancedInfoRow 
                          label="Last Active" 
                          value={selectedProfile.lastActive} 
                          icon="time" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{
                  backgroundColor: COLORS.surfaceContainer,
                  borderRadius: 20,
                  marginBottom: 20,
                  overflow: 'hidden',
                  elevation: 4,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('professional')}
                    activeOpacity={0.7}
                    style={{
                      padding: 24,
                    }}
                  >
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: expandedSections.professional ? 20 : 0,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <LinearGradient
                          colors={[COLORS.secondary + '30', COLORS.secondary + '10']}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                          }}
                        >
                          <Ionicons name="briefcase" size={22} color={COLORS.secondary} />
                        </LinearGradient>
                        <View>
                          <Text style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.onSurface,
                            letterSpacing: -0.3,
                            marginBottom: 2,
                          }}>
                            Professional
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.onSurfaceVariant,
                            fontWeight: '500',
                          }}>
                            Career and work information
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.secondary + '15',
                        borderRadius: 12,
                        padding: 8,
                      }}>
                        <Ionicons 
                          name={expandedSections.professional ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={COLORS.secondary} 
                        />
                      </View>
                    </View>
                    {expandedSections.professional && (
                      <View style={{ 
                        gap: 16,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.outline + '30',
                      }}>
                        <EnhancedInfoRow 
                          label="Occupation" 
                          value={selectedProfile.occupation || "Not specified"} 
                          icon="briefcase" 
                        />
                        <EnhancedInfoRow 
                          label="Company" 
                          value={selectedProfile.company || "Not specified"} 
                          icon="business" 
                        />
                        <EnhancedInfoRow 
                          label="Annual Income" 
                          value={selectedProfile.annualIncome || "Not specified"} 
                          icon="cash" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{
                  backgroundColor: COLORS.surfaceContainer,
                  borderRadius: 20,
                  marginBottom: 20,
                  overflow: 'hidden',
                  elevation: 4,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('family')}
                    activeOpacity={0.7}
                    style={{
                      padding: 24,
                    }}
                  >
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: expandedSections.family ? 20 : 0,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <LinearGradient
                          colors={[COLORS.accent + '30', COLORS.accent + '10']}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                          }}
                        >
                          <Ionicons name="home" size={22} color={COLORS.accent} />
                        </LinearGradient>
                        <View>
                          <Text style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.onSurface,
                            letterSpacing: -0.3,
                            marginBottom: 2,
                          }}>
                            Family
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.onSurfaceVariant,
                            fontWeight: '500',
                          }}>
                            Family background details
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.accent + '15',
                        borderRadius: 12,
                        padding: 8,
                      }}>
                        <Ionicons 
                          name={expandedSections.family ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={COLORS.accent} 
                        />
                      </View>
                    </View>
                    {expandedSections.family && (
                      <View style={{ 
                        gap: 16,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.outline + '30',
                      }}>
                        <EnhancedInfoRow 
                          label="Family Type" 
                          value={selectedProfile.familyType || "Not specified"} 
                          icon="people" 
                        />
                        <EnhancedInfoRow 
                          label="Father's Occupation" 
                          value={selectedProfile.fatherOccupation || "Not specified"} 
                          icon="person" 
                        />
                        <EnhancedInfoRow 
                          label="Mother's Occupation" 
                          value={selectedProfile.motherOccupation || "Not specified"} 
                          icon="person" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{
                  backgroundColor: COLORS.surfaceContainer,
                  borderRadius: 20,
                  marginBottom: 20,
                  overflow: 'hidden',
                  elevation: 4,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('astrological')}
                    activeOpacity={0.7}
                    style={{
                      padding: 24,
                    }}
                  >
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: expandedSections.astrological ? 20 : 0,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <LinearGradient
                          colors={[COLORS.gold + '30', COLORS.gold + '10']}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                          }}
                        >
                          <Ionicons name="star" size={22} color={COLORS.gold} />
                        </LinearGradient>
                        <View>
                          <Text style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.onSurface,
                            letterSpacing: -0.3,
                            marginBottom: 2,
                          }}>
                            Astrological Details
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.onSurfaceVariant,
                            fontWeight: '500',
                          }}>
                            Horoscope and birth details
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.gold + '15',
                        borderRadius: 12,
                        padding: 8,
                      }}>
                        <Ionicons 
                          name={expandedSections.astrological ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={COLORS.gold} 
                        />
                      </View>
                    </View>
                    {expandedSections.astrological && (
                      <View style={{ 
                        gap: 16,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.outline + '30',
                      }}>
                        <EnhancedInfoRow 
                          label="Star Sign" 
                          value={selectedProfile.starSign || "Not specified"} 
                          icon="star" 
                        />
                        <EnhancedInfoRow 
                          label="Moon Sign" 
                          value={selectedProfile.moonSign || "Not specified"} 
                          icon="moon" 
                        />
                        <EnhancedInfoRow 
                          label="Birth Time" 
                          value={selectedProfile.birthTime || "Not specified"} 
                          icon="time" 
                        />
                        <EnhancedInfoRow 
                          label="Birth Place" 
                          value={selectedProfile.birthPlace || "Not specified"} 
                          icon="location" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{
                  backgroundColor: COLORS.surfaceContainer,
                  borderRadius: 20,
                  marginBottom: 40,
                  overflow: 'hidden',
                  elevation: 4,
                  shadowColor: COLORS.onSurface,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }}>
                  <TouchableOpacity
                    onPress={() => toggleSection('preferences')}
                    activeOpacity={0.7}
                    style={{
                      padding: 24,
                    }}
                  >
                    <View style={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: expandedSections.preferences ? 20 : 0,
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <LinearGradient
                          colors={[COLORS.primaryLight + '30', COLORS.primaryLight + '10']}
                          style={{
                            borderRadius: 14,
                            padding: 12,
                          }}
                        >
                          <Ionicons name="options" size={22} color={COLORS.primaryLight} />
                        </LinearGradient>
                        <View>
                          <Text style={{
                            fontSize: 19,
                            fontWeight: '700',
                            color: COLORS.onSurface,
                            letterSpacing: -0.3,
                            marginBottom: 2,
                          }}>
                            Preferences
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.onSurfaceVariant,
                            fontWeight: '500',
                          }}>
                            Partner preferences and expectations
                          </Text>
                        </View>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.primaryLight + '15',
                        borderRadius: 12,
                        padding: 8,
                      }}>
                        <Ionicons 
                          name={expandedSections.preferences ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={COLORS.primaryLight} 
                        />
                      </View>
                    </View>
                    {expandedSections.preferences && (
                      <View style={{ 
                        gap: 16,
                        paddingTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: COLORS.outline + '30',
                      }}>
                        <EnhancedInfoRow 
                          label="Partner Age Range" 
                          value={selectedProfile.partnerAgeRange || "Not specified"} 
                          icon="people" 
                        />
                        <EnhancedInfoRow 
                          label="Partner Height" 
                          value={selectedProfile.partnerHeight || "Not specified"} 
                          icon="resize" 
                        />
                        <EnhancedInfoRow 
                          label="Partner Education" 
                          value={selectedProfile.partnerEducation || "Not specified"} 
                          icon="school" 
                        />
                        <EnhancedInfoRow 
                          label="Partner Profession" 
                          value={selectedProfile.partnerProfession || "Not specified"} 
                          icon="briefcase" 
                        />
                        <EnhancedInfoRow 
                          label="Expectations" 
                          value={selectedProfile.expectations || "Not specified"} 
                          icon="heart" 
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{ 
                  flexDirection: 'row', 
                  gap: 16,
                  paddingBottom: 40,
                }}>
                  <TouchableOpacity
                    onPress={() => setSelectedProfile(null)}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      borderRadius: 24,
                      borderWidth: 1,
                      borderColor: COLORS.outline,
                      paddingVertical: 18,
                      alignItems: 'center',
                      elevation: 12,
                      shadowColor: COLORS.onSurface,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.2,
                      shadowRadius: 12,
                    }}
                  >
                    <Text style={{ 
                      color: COLORS.onSurfaceVariant,
                      fontSize: 16,
                      fontWeight: '700',
                      letterSpacing: 0.5,
                    }}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Toast.show({
                        type: 'success',
                        text1: 'Connection Request Sent',
                        text2: 'Your interest has been sent successfully!'
                      });
                      setSelectedProfile(null);
                    }}
                    activeOpacity={0.8}
                    style={{
                      flex: 2,
                      borderRadius: 24,
                      overflow: 'hidden',
                      elevation: 12,
                      shadowColor: COLORS.primary,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                    }}
                  >
                    <LinearGradient
                      colors={COLORS.gradientPrimary}
                      style={{
                        paddingVertical: 18,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      <Ionicons name="heart" size={20} color={COLORS.background} />
                      <Text style={{ 
                        color: COLORS.background,
                        fontSize: 16,
                        fontWeight: '700',
                        letterSpacing: 0.5,
                      }}>
                        Send Interest
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    );

    if (checkingSubscription || !isLoaded) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: 24,
          }}>
            <Reanimated.View entering={ZoomIn.duration(600)}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                style={{
                  borderRadius: 24,
                  padding: 24,
                  marginBottom: 24,
                }}
              >
                <MaterialCommunityIcons name="heart-pulse" size={48} color={COLORS.background} />
              </LinearGradient>
            </Reanimated.View>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: COLORS.onSurface,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Loading Your Interests
            </Text>
            <Text style={{
              fontSize: 14,
              color: COLORS.onSurfaceVariant,
              textAlign: 'center',
              lineHeight: 20,
            }}>
              We&apos;re fetching your connections...
            </Text>
          </View>
        </SafeAreaView>
      );
    }

    if (error) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: 24,
          }}>
            <Reanimated.View entering={FadeIn.duration(600)}>
              <Ionicons name="alert-circle" size={48} color={COLORS.error} />
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: COLORS.onSurface,
                marginBottom: 8,
                textAlign: 'center',
              }}>
                Something went wrong
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.onSurfaceVariant,
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {error}
              </Text>
              <TouchableOpacity
                onPress={handleRetry}
                style={{
                  marginTop: 24,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <LinearGradient
                  colors={COLORS.gradientPrimary}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ 
                    color: COLORS.background,
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                    Try Again
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Reanimated.View>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View 
          style={{ 
            flex: 1, 
            backgroundColor: COLORS.background,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            {renderHeader()}
            {renderTabBar()}
            <AnimatedFlatList
              data={activeTab === "sent" ? sentInterests : receivedInterests}
              renderItem={renderInterestCard}
              keyExtractor={(item, index) => item?._id || `interest-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingTop: 8,
                paddingBottom: 50,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                  colors={[COLORS.primary]}
                />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              ListEmptyComponent={() => (
                <View style={{ 
                  flex: 1, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  paddingTop: 100,
                  paddingHorizontal: 24,
                }}>
                  <Reanimated.View entering={FadeIn.duration(600)}>
                    <View style={{
                      backgroundColor: COLORS.surfaceContainer,
                      borderRadius: 24,
                      padding: 24,
                      marginBottom: 24,
                      alignItems: 'center',
                    }}>
                      <Ionicons name="heart-dislike" size={48} color={COLORS.onSurfaceVariant} />
                    </View>
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: COLORS.onSurface,
                      marginBottom: 8,
                      textAlign: 'center',
                    }}>
                      No Interests Found
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.onSurfaceVariant,
                      textAlign: 'center',
                      lineHeight: 20,
                    }}>
                      {activeTab === "sent" 
                        ? "You haven't sent any interests yet."
                        : "You haven't received any interests yet."}
                    </Text>
                  </Reanimated.View>
                </View>
              )}
            />
            {renderProfileDetailModal()}
            <Toast />
          </SafeAreaView>
        </Animated.View>
      </GestureHandlerRootView>
    );
  };

  export default InterestsScreen;