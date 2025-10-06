// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   TextInput,
//   Dimensions,
//   ScrollView,
//   RefreshControl,
//   Platform,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import { useSession } from "context/SessionContext";
// import Toast from "react-native-toast-message";
// import Reanimated, { FadeIn, SlideInUp, SlideInDown, FadeInDown, ZoomIn } from "react-native-reanimated";
// import { useNavigation } from "@react-navigation/native";
// import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
// import { Easing } from "react-native";
// const { width, height } = Dimensions.get("window");
// import "../global.css";

// // Wrap FlatList with Animated.createAnimatedComponent
// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";

// // Enhanced Color Palette with Modern Design System - Same as InterestsScreen
// const COLORS = {
//   primary: "#f87171", // red-400
//   primaryLight: "#fca5a5", // red-300
//   primaryDark: "#dc2626", // red-600
//   secondary: "#ef4444", // red-500
//   secondaryLight: "#fca5a5", // red-300
//   secondaryDark: "#b91c1c", // red-700
//   accent: "#dc2626", // red-600
//   accentSecondary: "#f87171", // red-400
//   gold: "#FFB300",
//   success: "#10b981", // Keep green for success states
//   warning: "#f59e0b",
//   error: "#dc2626", // red-600
//   inactive: "#BDBDBD",
//   background: "#FFFFFF",
//   surface: "#FFFFFF",
//   surfaceVariant: "#FFFFFF",
//   outline: "#fecaca", // red-200
//   outlineVariant: "#fca5a5", // red-300
//   onSurface: "#3D3D3D",
//   onSurfaceVariant: "#6D4C41",
//   onSurfaceMuted: "#A1887F",
//   surfaceContainer: "#fef2f2", // red-50
//   surfaceContainerLow: "#fff5f5",
//   surfaceContainerHigh: "#FFFFFF",
//   surfaceContainerHighest: "#fee2e2", // red-100
//   gradientPrimary: ["#f87171", "#dc2626"], // red-400 to red-600
//   gradientSecondary: ["#ef4444", "#dc2626"], // red-500 to red-600
//   gradientSurface: ["#FFFFFF", "#FFFFFF"],
//   gradientCard: ["#FFFFFF", "#fef2f2"], // white to red-50
//   gradientGold: ["#FFD740", "#FFB300"],
//   gradientError: ["#ef4444", "#dc2626"], // red gradient
//   gradientSuccess: ["#4CAF50", "#45a049"],
// };

// const MatchesScreen = () => {
//   const { user } = useSession();
//   const navigation = useNavigation();
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [showQuickFilters, setShowQuickFilters] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [hasSubscription, setHasSubscription] = useState(true);
//   const [checkingSubscription, setCheckingSubscription] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearchBar, setShowSearchBar] = useState(false);
//   const searchAnim = useRef(new Animated.Value(0)).current;
//   const buttonScale = useRef(new Animated.Value(1)).current;
//   const [quickFilters, setQuickFilters] = useState({
//     withPhoto: null,
//     verified: null,
//     activeRecently: null,
//     sameCity: null,
//     ageRange: [null, null],
//     education: null,
//   });
//   const [expandedSections, setExpandedSections] = useState({
//     basic: true,
//     professional: true,
//     family: true,
//     astrological: false,
//     preferences: false,
//   });
//   const [refreshing, setRefreshing] = useState(false);
//   const [page, setPage] = useState(1);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;
//   const headerAnim = useRef(new Animated.Value(-50)).current;
//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const initialize = async () => {
//       Animated.parallel([
//         Animated.timing(fadeAnim, { 
//           toValue: 1, 
//           duration: 800, 
//           useNativeDriver: true 
//         }),
//         Animated.spring(scaleAnim, { 
//           toValue: 1, 
//           tension: 40, 
//           friction: 8, 
//           useNativeDriver: true 
//         }),
//         Animated.spring(headerAnim, {
//           toValue: 0,
//           tension: 50,
//           friction: 8,
//           useNativeDriver: true,
//         }),
//       ]).start();
//       setIsLoaded(true);
//       await checkSubscription();
//       await fetchUsers(1);
//     };
//     initialize();
//   }, [user]);

//   const checkSubscription = async () => {
//     setCheckingSubscription(true);
//     try {
//       const res = await fetch(`${BASE_URL}api/users/me`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (!res.ok) {
//         console.error("MatchesScreen: Subscription check failed with status:", res.status);
//         throw new Error("Failed to fetch subscription");
//       }
//       const data = await res.json();
//       setHasSubscription(data?.subscription?.isSubscribed || false);
//     } catch (err) {
//       console.error("MatchesScreen: Error checking subscription:", err);
//       setHasSubscription(false);
//     } finally {
//       setCheckingSubscription(false);
//     }
//   };

//   const calculateAge = (dob) => {
//     if (!dob) return null;
//     const birthDate = new Date(dob);
//     const ageDiff = Date.now() - birthDate.getTime();
//     return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
//   };

//   const calculateCompatibility = (userProfile, matchProfile) => {
//     const expectationFields = [
//       { expectation: "expectedCaste", matchField: "caste" },
//       { expectation: "preferredCity", matchField: "currentCity" },
//       { expectation: "expectedEducation", matchField: "education" },
//       { expectation: "expectedAgeDifference", matchField: "age" },
//     ];
//     const totalFields = expectationFields.length;
//     const percentagePerField = 100 / totalFields;
//     let matchedPercentage = 0;

//     expectationFields.forEach(({ expectation, matchField }) => {
//       const expectedValue = userProfile[expectation];
//       const matchValue = matchProfile[matchField];
//       if (!expectedValue || !matchValue) return;

//       if (expectation === "expectedEducation") {
//         const educationHierarchy = ["Doctorate", "Master's Degree", "Bachelor's Degree", "High School"];
//         const expectedIndex = educationHierarchy.indexOf(expectedValue);
//         const matchIndex = educationHierarchy.indexOf(matchValue);
//         if (expectedIndex !== -1 && matchIndex !== -1) {
//           matchedPercentage += matchIndex <= expectedIndex ? percentagePerField : percentagePerField / 2;
//         }
//       } else if (expectation === "expectedAgeDifference") {
//         const userAge = calculateAge(userProfile.dob);
//         const matchAge = matchProfile.age;
//         const ageDiff = Math.abs(userAge - matchAge);
//         if (
//           (expectedValue === "1" && ageDiff <= 1) ||
//           (expectedValue === "2" && ageDiff <= 2) ||
//           (expectedValue === "3" && ageDiff <= 3) ||
//           (expectedValue === "5" && ageDiff <= 5) ||
//           (expectedValue === "6+" && ageDiff >= 6)
//         ) {
//           matchedPercentage += percentagePerField;
//         }
//       } else if (expectedValue === matchValue) {
//         matchedPercentage += percentagePerField;
//       }
//     });

//     return Math.min(100, Math.round(matchedPercentage));
//   };

//   const isSameCity = (city1, city2) => {
//     if (!city1 || !city2) return false;
//     return city1.toLowerCase() === city2.toLowerCase();
//   };

//   const maskFirstName = (fullName) => {
//     if (!fullName) return "****";
//     const names = fullName.split(" ");
//     return names.length > 1 ? `${"*".repeat(names[0].length)} ${names.slice(1).join(" ")}` : "****";
//   };

//   const fetchSentInterests = async (senderId) => {
//     try {
//       const res = await fetch(`${BASE_URL}api/interest?userId=${senderId}`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (!res.ok) {
//         console.error(`MatchesScreen: Fetch sent interests failed with status ${res.status}`);
//         return [];
//       }
//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         console.error("MatchesScreen: Invalid content-type:", contentType);
//         return [];
//       }
//       const data = await res.json();
//       if (data.success) {
//         return data.interests.map((i) => i.receiver.id);
//       }
//       return [];
//     } catch (err) {
//       console.error("MatchesScreen: Error fetching sent interests:", err.message);
//       return [];
//     }
//   };

//   const fetchUsers = async (pageNum = 1, isRefresh = false) => {
//     setIsLoading(pageNum === 1);
//     try {
//       const currentUserRes = await fetch(`${BASE_URL}api/users/me`);
//       if (!currentUserRes.ok) {
//         console.error("MatchesScreen: Fetch current user failed with status:", currentUserRes.status);
//         throw new Error("Failed to fetch current user");
//       }
//       const currentUserData = await currentUserRes.json();
//       const sentReceiverIds = await fetchSentInterests(currentUserData._id);

//       const res = await fetch(`${BASE_URL}api/users/fetchAllUsers?limit=20&page=${pageNum}`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (!res.ok) {
//         console.error("MatchesScreen: Fetch users failed with status:", res.status);
//         throw new Error("Failed to fetch users");
//       }
//       const data = await res.json();

//       if (data.success) {
//         const enriched = data.data
//           .filter(
//             (matchUser) =>
//               matchUser._id !== currentUserData.id &&
//               matchUser.gender !== currentUserData.gender &&
//               matchUser.dob &&
//               matchUser.currentCity &&
//               matchUser.education
//           )
//           .map((matchUser) => {
//             const compatibility = calculateCompatibility(currentUserData, {
//               ...matchUser,
//               age: calculateAge(matchUser.dob),
//             });
//             return {
//               ...matchUser,
//               age: calculateAge(matchUser.dob),
//               profilePhoto:
//                 matchUser.profilePhoto ||
//                 `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                   matchUser.name || "User"
//                 )}&size=400&background=f3f4f6&color=374151`,
//               hasPhoto: !!matchUser.profilePhoto,
//               isBlurred: !hasSubscription,
//               matchType: "all",
//               interestSent: sentReceiverIds.includes(matchUser._id),
//               compatibility,
//               bio: matchUser.bio || "Looking for a meaningful connection and lifelong partnership.",
//               isNew: Math.random() > 0.7,
//               lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
//               shortlisted: false,
//               isVerified: Math.random() > 0.6,
//             };
//           });
//         setMatches((prev) => (isRefresh || pageNum === 1 ? enriched : [...prev, ...enriched]));
//         if (enriched.length > 0) setPage(pageNum);
//       }
//     } catch (err) {
//       console.error("MatchesScreen: Failed to fetch matches:", err.message);
//       Toast.show({ type: "error", text1: "Failed to load matches" });
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUsers(1, true);
//   };

//   const loadMore = () => {
//     if (!isLoading) fetchUsers(page + 1);
//   };

//   const tabs = [
//     { 
//       id: "all", 
//       label: "All", 
//       count: matches.filter((m) => m.compatibility > 0).length, 
//       icon: "grid", 
//       color: COLORS.primary,
//       gradient: COLORS.gradientPrimary
//     },
//     { 
//       id: "preferred", 
//       label: "Premium", 
//       count: matches.filter((m) => m.compatibility >= 70).length, 
//       icon: "diamond", 
//       color: COLORS.secondary,
//       gradient: COLORS.gradientSecondary
//     },
//     { 
//       id: "new", 
//       label: "New", 
//       count: matches.filter((m) => m.isNew).length, 
//       icon: "star", 
//       color: COLORS.success,
//       gradient: [COLORS.success, "#22d3ee"]
//     },
//     {
//       id: "nearby",
//       label: "Nearby",
//       count: matches.filter((m) => isSameCity(m.currentCity, user?.currentCity)).length,
//       icon: "location",
//       color: COLORS.accent,
//       gradient: [COLORS.accent, "#f472b6"]
//     },
//   ];

//   const filteredMatches = matches
//     .filter((match) => {
//       if (match.compatibility <= 0) return false;
//       let shouldShow = true;
//       if (searchQuery) {
//         shouldShow = shouldShow && match.currentCity?.toLowerCase().includes(searchQuery.toLowerCase());
//       }
//       if (activeTab !== "all") {
//         if (activeTab === "preferred" && match.compatibility < 70) return false;
//         if (activeTab === "new" && !match.isNew) return false;
//         if (activeTab === "nearby" && !isSameCity(match.currentCity, user?.currentCity)) return false;
//       }
//       if (quickFilters.withPhoto !== null) shouldShow = shouldShow && quickFilters.withPhoto === !!match.hasPhoto;
//       if (quickFilters.verified !== null) shouldShow = shouldShow && quickFilters.verified === !!match.isVerified;
//       if (quickFilters.activeRecently !== null)
//         shouldShow = shouldShow && quickFilters.activeRecently !== match.lastActive.includes("day");
//       if (quickFilters.sameCity !== null)
//         shouldShow = shouldShow && quickFilters.sameCity === isSameCity(match.currentCity, user?.currentCity);
//       if (quickFilters.ageRange[0] !== null && quickFilters.ageRange[1] !== null) {
//         shouldShow = shouldShow && match.age >= quickFilters.ageRange[0] && match.age <= quickFilters.ageRange[1];
//       }
//       if (quickFilters.education) shouldShow = shouldShow && match.education === quickFilters.education;
//       return shouldShow;
//     })
//     .sort((a, b) => b.compatibility - a.compatibility);

//   const handleSendInterest = async (receiverId) => {
//     const senderId = user?.id || user?.user?.id;
//     if (senderId === receiverId) {
//       Toast.show({ type: "error", text1: "Can't send interest to yourself" });
//       return;
//     }
//     if (!hasSubscription) {
//       navigation.navigate("Subscription");
//       return;
//     }
//     try {
//       const res = await fetch(`${BASE_URL}api/interest/send`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
//         body: JSON.stringify({ senderId, receiverId }),
//       });
//       if (!res.ok) {
//         console.error("MatchesScreen: Send interest failed with status:", res.status);
//         throw new Error("Failed to send interest");
//       }
//       const data = await res.json();
//       if (res.ok) {
//         setMatches(matches.map((m) => (m._id === receiverId ? { ...m, interestSent: true } : m)));
//         Toast.show({ type: "success", text1: "Interest sent successfully!" });
//       } else {
//         Toast.show({ type: "error", text1: data.message || "Failed to send interest" });
//       }
//     } catch (error) {
//       console.error("MatchesScreen: Error sending interest:", error.message);
//       Toast.show({ type: "error", text1: "Interest Already Sent" });
//     }
//   };

//   const toggleShortlist = (matchId) => {
//     setMatches(matches.map((m) => (m._id === matchId ? { ...m, shortlisted: !m.shortlisted } : m)));
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const getCompatibilityColor = (percentage) => {
//     if (percentage >= 85) return [COLORS.success, "#22d3ee"];
//     if (percentage >= 70) return [COLORS.secondary, "#fbbf24"];
//     return [COLORS.primary, COLORS.primaryLight];
//   };

//   // Scroll-based animations for header and tabs
//   const headerScale = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.95],
//     extrapolate: 'clamp',
//   });

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.9],
//     extrapolate: 'clamp',
//   });

//   const tabBarScale = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.95],
//     extrapolate: 'clamp',
//   });

//   // Enhanced Modern Header Component
//   const renderHeader = () => {
//     const toggleSearchBar = () => {
//       setShowSearchBar(!showSearchBar);
//       Animated.timing(searchAnim, {
//         toValue: showSearchBar ? 0 : 1,
//         duration: 400,
//         useNativeDriver: true,
//         easing: Easing.bezier(0.25, 0.1, 0.25, 1),
//       }).start();
//     };

//     const searchBarStyle = {
//       opacity: searchAnim,
//       transform: [
//         {
//           translateY: searchAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [-30, 0],
//           }),
//         },
//         {
//           scale: searchAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [0.95, 1],
//           }),
//         },
//       ],
//     };

//     const handleButtonPress = (callback) => {
//       Animated.sequence([
//         Animated.timing(buttonScale, {
//           toValue: 0.95,
//           duration: 100,
//           useNativeDriver: true,
//         }),
//         Animated.timing(buttonScale, {
//           toValue: 1,
//           duration: 100,
//           useNativeDriver: true,
//         }),
//       ]).start();
//       callback();
//     };

//     return (
//       <Animated.View
//         style={{
//           opacity: headerOpacity,
//         }}
//       >
//         {/* Enhanced gradient with blur effect backdrop */}
//         <LinearGradient
//           colors={COLORS.gradientSurface}
//           style={{
//             paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 10,
//             paddingBottom: 20,
//             borderBottomWidth: 1,
//             borderBottomColor: COLORS.outline,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 8,
//             elevation: 4,
//           }}
//         >
//           <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          
//           {/* Main header content */}
//           <View style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'flex-start',
//             marginBottom: showSearchBar ? 20 : 12,
//             paddingHorizontal: 24,
//             paddingVertical: 8,
//           }}>
            
//             {/* Title section with enhanced typography */}
//             <View style={{ flex: 1, paddingRight: 16 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
//                 <Text style={{
//                   fontSize: 32,
//                   fontWeight: '800',
//                   color: COLORS.onSurface,
//                   letterSpacing: -1.2,
//                   lineHeight: 38,
//                 }}>
//                   Discover
//                 </Text>
//                 <View style={{
//                   width: 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: COLORS.accent,
//                   marginLeft: 8,
//                   marginTop: 4,
//                 }} />
//               </View>
              
//               <Text style={{
//                 fontSize: 14,
//                 color: COLORS.onSurfaceVariant,
//                 fontWeight: '500',
//                 letterSpacing: 0.2,
//                 lineHeight: 20,
//               }}>
//                 Find your perfect match
//               </Text>
              
//               {/* Subtle progress indicator */}
//               <View style={{
//                 height: 2,
//                 backgroundColor: 'rgba(233, 30, 99, 0.1)',
//                 borderRadius: 1,
//                 marginTop: 8,
//                 width: '60%',
//               }}>
//                 <View style={{
//                   height: 2,
//                   backgroundColor: COLORS.primary,
//                   borderRadius: 1,
//                   width: '40%',
//                 }} />
//               </View>
//             </View>
            
//             {/* Action buttons with enhanced design */}
//             <View style={{ 
//               flexDirection: 'row', 
//               gap: 12,
//               alignItems: 'center',
//             }}>
              
//               {/* Filter button */}
//               <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//                 <LinearGradient 
//                   colors={COLORS.gradientPrimary}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={{
//                     borderRadius: 16,
//                     padding: 14,
//                     shadowColor: COLORS.primary,
//                     shadowOffset: { width: 0, height: 4 },
//                     shadowOpacity: 0.3,
//                     shadowRadius: 8,
//                     elevation: 6,
//                   }}
//                 >
//                   <TouchableOpacity
//                     onPress={() => handleButtonPress(() => setShowQuickFilters(true))}
//                     activeOpacity={0.8}
//                     style={{
//                       flexDirection: 'row',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <Ionicons name="options-outline" size={20} color="#ffffff" />
//                     <View style={{
//                       position: 'absolute',
//                       top: -2,
//                       right: -2,
//                       width: 8,
//                       height: 8,
//                       borderRadius: 4,
//                       backgroundColor: COLORS.accent,
//                       borderWidth: 2,
//                       borderColor: '#ffffff',
//                     }} />
//                   </TouchableOpacity>
//                 </LinearGradient>
//               </Animated.View>

//               {/* Search toggle button */}
//               <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
//                 <View style={{
//                   backgroundColor: showSearchBar ? COLORS.onSurface : COLORS.surface,
//                   borderRadius: 16,
//                   padding: 14,
//                   borderWidth: 1,
//                   borderColor: showSearchBar ? COLORS.onSurface : COLORS.outline,
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: showSearchBar ? 0.2 : 0.05,
//                   shadowRadius: 6,
//                   elevation: 3,
//                 }}>
//                   <TouchableOpacity
//                     onPress={() => handleButtonPress(toggleSearchBar)}
//                     activeOpacity={0.8}
//                   >
//                     <Ionicons 
//                       name={showSearchBar ? "close" : "search"} 
//                       size={20} 
//                       color={showSearchBar ? COLORS.surface : COLORS.onSurfaceVariant} 
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </Animated.View>
//             </View>
//           </View>

//           {/* Enhanced search bar */}
//           {showSearchBar && (
//             <Animated.View style={[{
//               backgroundColor: COLORS.surface,
//               borderRadius: 24,
//               paddingHorizontal: 20,
//               paddingVertical: 8,
//               marginHorizontal: 24,
//               marginBottom: 8,
//               flexDirection: 'row',
//               alignItems: 'center',
//               gap: 12,
//               borderWidth: 1,
//               borderColor: COLORS.outline,
//               shadowColor: COLORS.primary,
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.08,
//               shadowRadius: 12,
//               elevation: 6,
//             }, searchBarStyle]}>
              
//               <View style={{
//                 backgroundColor: COLORS.surfaceContainerLow,
//                 borderRadius: 10,
//                 padding: 8,
//               }}>
//                 <Ionicons name="search" size={18} color={COLORS.primary} />
//               </View>
              
//               <TextInput
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 placeholder="Search by city, profession, interests..."
//                 placeholderTextColor={COLORS.onSurfaceMuted}
//                 style={{
//                   flex: 1,
//                   fontSize: 16,
//                   color: COLORS.onSurface,
//                   fontWeight: '500',
//                   lineHeight: 20,
//                 }}
//                 autoFocus={showSearchBar}
//                 returnKeyType="search"
//               />
              
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity 
//                   onPress={() => setSearchQuery('')}
//                   activeOpacity={0.7}
//                   style={{
//                     backgroundColor: COLORS.surfaceContainer,
//                     borderRadius: 10,
//                     padding: 6,
//                   }}
//                 >
//                   <Ionicons name="close" size={16} color={COLORS.onSurfaceVariant} />
//                 </TouchableOpacity>
//               )}
//             </Animated.View>
//           )}
//         </LinearGradient>
//       </Animated.View>
//     );
//   };

//   // Modern Tab Bar Component
//   const renderTabBar = () => (
//     <Animated.View>
//       <View style={{
//         backgroundColor: COLORS.background,
//       }}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={{ 
//             paddingHorizontal: 12,
//             paddingBottom: 12,
//             paddingTop: 12,
//             gap: 10,
//           }}
//         >
//           {tabs.map((tab, index) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <Reanimated.View key={tab.id} entering={FadeIn.delay(index * 100).duration(400)}>
//                 <TouchableOpacity
//                   onPress={() => setActiveTab(tab.id)}
//                   activeOpacity={0.8}
//                   style={{
//                     borderRadius: 16,
//                     overflow: 'hidden',
//                   }}
//                 >
//                   {isActive ? (
//                     <LinearGradient
//                       colors={tab.gradient}
//                       style={{
//                         borderRadius: 16,
//                         paddingHorizontal: 10,
//                         paddingVertical: 8,
//                         elevation: 8,
//                         shadowColor: tab.color,
//                         shadowOffset: { width: 0, height: 4 },
//                         shadowOpacity: 0.3,
//                         shadowRadius: 12,
//                       }}
//                     >
//                       <View style={{ 
//                         flexDirection: 'row', 
//                         alignItems: 'center', 
//                         gap: 8 
//                       }}>
//                         <Ionicons 
//                           name={tab.icon} 
//                           size={18} 
//                           color={COLORS.background} 
//                         />
//                         <Text style={{ 
//                           color: COLORS.background,
//                           fontSize: 14,
//                           fontWeight: '700',
//                           letterSpacing: 0.2,
//                         }}>
//                           {tab.label}
//                         </Text>
//                         <View style={{
//                           backgroundColor: 'rgba(255,255,255,0.3)',
//                           borderRadius: 10,
//                           paddingHorizontal: 8,
//                           paddingVertical: 2,
//                           minWidth: 20,
//                           alignItems: 'center',
//                         }}>
//                           <Text style={{ 
//                             color: COLORS.background,
//                             fontSize: 11,
//                             fontWeight: '800',
//                           }}>
//                             {tab.count}
//                           </Text>
//                         </View>
//                       </View>
//                     </LinearGradient>
//                   ) : (
//                     <View style={{
//                       backgroundColor: COLORS.surfaceContainer,
//                       borderRadius: 16,
//                       paddingHorizontal: 10,
//                       paddingVertical: 8,
//                     }}>
//                       <View style={{ 
//                         flexDirection: 'row', 
//                         alignItems: 'center', 
//                         gap: 8 
//                       }}>
//                         <Ionicons 
//                           name={tab.icon + "-outline"} 
//                           size={18} 
//                           color={COLORS.onSurfaceVariant} 
//                         />
//                         <Text style={{ 
//                           color: COLORS.onSurfaceVariant,
//                           fontSize: 14,
//                           fontWeight: '600',
//                         }}>
//                           {tab.label}
//                         </Text>
//                         <View style={{
//                           backgroundColor: COLORS.outline,
//                           borderRadius: 10,
//                           paddingHorizontal: 8,
//                           paddingVertical: 2,
//                           minWidth: 20,
//                           alignItems: 'center',
//                         }}>
//                           <Text style={{ 
//                             color: COLORS.onSurfaceVariant,
//                             fontSize: 11,
//                             fontWeight: '700',
//                           }}>
//                             {tab.count}
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </Reanimated.View>
//             );
//           })}
//         </ScrollView>
//       </View>
//     </Animated.View>
//   );

//   // Enhanced Profile Card with Modern Design
//   const renderProfileCard = ({ item, index }) => (
//     <Reanimated.View 
//       entering={FadeInDown.delay(index * 100).duration(600)}
//       style={{
//         marginBottom: 20,
//         marginHorizontal: 24,
//       }}
//     >
//       <TouchableOpacity
//         onPress={() => setSelectedProfile(item)}
//         activeOpacity={0.97}
//         style={{
//           backgroundColor: COLORS.background,
//           borderRadius: 24,
//           padding: 20,
//           elevation: 8,
//           shadowColor: COLORS.onSurface,
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.08,
//           shadowRadius: 16,
//         }}
//       >
//         <View style={{ 
//           flexDirection: 'row', 
//           justifyContent: 'space-between', 
//           alignItems: 'flex-start',
//           marginBottom: 20,
//         }}>
//           <LinearGradient
//             colors={getCompatibilityColor(item.compatibility)}
//             style={{
//               borderRadius: 12,
//               paddingHorizontal: 12,
//               paddingVertical: 6,
//             }}
//           >
//             <Text style={{ 
//               color: COLORS.background,
//               fontSize: 12,
//               fontWeight: '700',
//               letterSpacing: 0.5,
//             }}>
//               {item.compatibility}% MATCH
//             </Text>
//           </LinearGradient>

//           <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
//             {item.isNew && (
//               <View style={{
//                 backgroundColor: COLORS.success,
//                 borderRadius: 8,
//                 paddingHorizontal: 8,
//                 paddingVertical: 4,
//               }}>
//                 <Text style={{ 
//                   color: COLORS.background,
//                   fontSize: 10,
//                   fontWeight: '700',
//                   textTransform: 'uppercase',
//                   letterSpacing: 0.5,
//                 }}>
//                   NEW
//                 </Text>
//               </View>
//             )}
//             {item.isVerified && (
//               <View style={{
//                 backgroundColor: COLORS.primary,
//                 borderRadius: 12,
//                 padding: 4,
//               }}>
//                 <Ionicons name="checkmark" size={12} color={COLORS.background} />
//               </View>
//             )}
//           </View>
//         </View>

//         <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
//           <View style={{ position: 'relative' }}>
//             <Image
//               source={{ uri: item.profilePhoto }}
//               style={{
//                 width: 88,
//                 height: 88,
//                 borderRadius: 20,
//                 backgroundColor: COLORS.surfaceContainer,
//               }}
//             />
//             {item.isBlurred && (
//               <BlurView
//                 intensity={80}
//                 tint="light"
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   borderRadius: 20,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
//               </BlurView>
//             )}
            
//             <View style={{
//               position: 'absolute',
//               bottom: 4,
//               right: 4,
//               backgroundColor: item.lastActive === 'Recently' ? COLORS.success : COLORS.inactive,
//               borderRadius: 8,
//               width: 16,
//               height: 16,
//               borderWidth: 2,
//               borderColor: COLORS.background,
//             }} />
//           </View>

//           <View style={{ flex: 1, justifyContent: 'center' }}>
//             <Text style={{
//               fontSize: 20,
//               fontWeight: '700',
//               color: COLORS.onSurface,
//               letterSpacing: -0.3,
//               marginBottom: 4,
//             }}>
//               {hasSubscription ? item.name : maskFirstName(item.name)}
//             </Text>
            
//             <Text style={{
//               fontSize: 14,
//               color: COLORS.onSurfaceVariant,
//               fontWeight: '500',
//               marginBottom: 8,
//               letterSpacing: -0.1,
//             }}>
//               {item.age} years • {item.currentCity}
//             </Text>
            
//             <Text style={{
//               fontSize: 13,
//               color: COLORS.onSurfaceMuted,
//               fontWeight: '500',
//               marginBottom: 12,
//             }}>
//               {item.education} • {item.lastActive}
//             </Text>

//             <View style={{ 
//               flexDirection: 'row', 
//               gap: 8, 
//               flexWrap: 'wrap' 
//             }}>
//               <View style={{
//                 backgroundColor: COLORS.surfaceContainerHigh,
//                 borderRadius: 8,
//                 paddingHorizontal: 8,
//                 paddingVertical: 4,
//               }}>
//                 <Text style={{ 
//                   fontSize: 11,
//                   color: COLORS.onSurfaceVariant,
//                   fontWeight: '600',
//                 }}>
//                   {item.caste}
//                 </Text>
//               </View>
              
//               {isSameCity(item.currentCity, user?.currentCity) && (
//                 <View style={{
//                   backgroundColor: COLORS.accent + '20',
//                   borderRadius: 8,
//                   paddingHorizontal: 8,
//                   paddingVertical: 4,
//                 }}>
//                   <Text style={{ 
//                     fontSize: 11,
//                     color: COLORS.accent,
//                     fontWeight: '600',
//                   }}>
//                     Nearby
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         </View>

//         <Text style={{
//           fontSize: 14,
//           color: COLORS.onSurfaceVariant,
//           lineHeight: 20,
//           marginBottom: 20,
//           fontWeight: '400',
//         }}>
//           {item.bio}
//         </Text>

//         <View style={{ 
//           flexDirection: 'row', 
//           gap: 12,
//           justifyContent: 'space-between',
//         }}>
//           <TouchableOpacity
//             onPress={() => handleSendInterest(item._id)}
//             disabled={item.interestSent}
//             activeOpacity={0.8}
//             style={{
//               flex: 2,
//               borderRadius: 16,
//               overflow: 'hidden',
//             }}
//           >
//             {item.interestSent ? (
//               <View style={{
//                 backgroundColor: COLORS.success,
//                 paddingVertical: 12,
//                 alignItems: 'center',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 gap: 8,
//               }}>
//                 <Ionicons name="checkmark-circle" size={16} color={COLORS.background} />
//                 <Text style={{ 
//                   color: COLORS.background,
//                   fontSize: 14,
//                   fontWeight: '700',
//                   letterSpacing: 0.2,
//                 }}>
//                   Interest Sent
//                 </Text>
//               </View>
//             ) : (
//               <LinearGradient
//                 colors={COLORS.gradientPrimary}
//                 style={{
//                   paddingVertical: 12,
//                   alignItems: 'center',
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                   gap: 8,
//                 }}
//               >
//                 <Ionicons name="heart" size={16} color={COLORS.background} />
//                 <Text style={{ 
//                   color: COLORS.background,
//                   fontSize: 14,
//                   fontWeight: '700',
//                   letterSpacing: 0.2,
//                 }}>
//                   Send Interest
//                 </Text>
//               </LinearGradient>
//             )}
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </Reanimated.View>
//   );

//   // Enhanced Profile Detail Modal
//   const renderProfileDetailModal = () => (
//     <Modal
//       visible={!!selectedProfile}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={() => setSelectedProfile(null)}
//     >
//       {selectedProfile && (
//         <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//           <StatusBar barStyle="dark-content" />
          
//           {/* Modern Header with Subtle Glass Effect */}
//           <View style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 10,
//             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//             borderBottomLeftRadius: 20,
//             borderBottomRightRadius: 20,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 10,
//             elevation: 4,
//           }}>
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               paddingHorizontal: 24,
//               paddingVertical: 16,
//             }}>
//               <Text style={{
//                 fontSize: 20,
//                 fontWeight: '700',
//                 color: COLORS.onSurface,
//                 letterSpacing: -0.3,
//               }}>
//                 Profile Details
//               </Text>
              
//               <TouchableOpacity
//                 onPress={() => setSelectedProfile(null)}
//                 activeOpacity={0.7}
//                 style={{
//                   backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                   borderRadius: 12,
//                   padding: 8,
//                 }}
//               >
//                 <Ionicons name="close" size={20} color={COLORS.onSurfaceVariant} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <ScrollView 
//             style={{ flex: 1 }}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingTop: 80 }}
//           >
//             {/* Elegant Hero Section */}
//             <View style={{
//               position: 'relative',
//               width: '100%',
//               height: 360,
//               marginBottom: 16,
//             }}>
//               {/* Profile Image Container with Subtle Shadow */}
//               <View style={{
//                 margin: 20,
//                 borderRadius: 24,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 12 },
//                 shadowOpacity: 0.15,
//                 shadowRadius: 20,
//                 elevation: 10,
//                 height: '100%',
//               }}>
//                 <Image
//                   source={{ uri: selectedProfile.profilePhoto }}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     resizeMode: 'cover',
//                   }}
//                 />
                
//                 {selectedProfile.isBlurred && (
//                   <View style={{
//                     position: 'absolute',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//                   }}>
//                     <View style={{
//                       backgroundColor: 'rgba(0, 0, 0, 0.1)',
//                       borderRadius: 20,
//                       padding: 16,
//                     }}>
//                       <Ionicons name="lock-closed" size={40} color={COLORS.onSurface} />
//                     </View>
//                   </View>
//                 )}
//               </View>
              
//               {/* Compatibility Badge */}
//               <View style={{
//                 position: 'absolute',
//                 top: 36,
//                 right: 36,
//                 backgroundColor: '#FFF',
//                 borderRadius: 16,
//                 padding: 2,
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 8,
//                 elevation: 3,
//               }}>
//                 <LinearGradient
//                   colors={getCompatibilityColor(selectedProfile.compatibility)}
//                   style={{
//                     borderRadius: 14,
//                     paddingHorizontal: 14,
//                     paddingVertical: 8,
//                     minWidth: 90,
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Text style={{
//                     fontSize: 12,
//                     fontWeight: '800',
//                     color: '#FFF',
//                     letterSpacing: 0.5,
//                   }}>
//                     {selectedProfile.compatibility}% Match
//                   </Text>
//                 </LinearGradient>
//               </View>

//               {/* Verification Badge */}
//               {selectedProfile.isVerified && (
//                 <View style={{
//                   position: 'absolute',
//                   bottom: 36,
//                   right: 36,
//                   backgroundColor: '#FFF',
//                   borderRadius: 16,
//                   padding: 8,
//                   shadowColor: COLORS.success,
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.2,
//                   shadowRadius: 4,
//                   elevation: 3,
//                 }}>
//                   <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
//                 </View>
//               )}

//               {/* Name and Details Card */}
//               <View style={{
//                 position: 'absolute',
//                 bottom: 36,
//                 left: 36,
//                 right: 100,
//                 backgroundColor: 'rgba(0, 0, 0, 0.7)',
//                 borderRadius: 16,
//                 padding: 12,
//               }}>
//                 <Text style={{
//                   fontSize: 18,
//                   fontWeight: '700',
//                   color: '#FFF',
//                   marginBottom: 6,
//                 }}>
//                   {hasSubscription ? selectedProfile.name : maskFirstName(selectedProfile.name)}
//                 </Text>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
//                   <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
//                     <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
//                     <Text style={{
//                       fontSize: 12,
//                       color: 'rgba(255,255,255,0.9)',
//                       fontWeight: '500',
//                       marginLeft: 4,
//                     }}>
//                       {selectedProfile.age} years
//                     </Text>
//                   </View>
//                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
//                     <Text style={{
//                       fontSize: 12,
//                       color: 'rgba(255,255,255,0.9)',
//                       fontWeight: '500',
//                       marginLeft: 4,
//                     }}>
//                       {selectedProfile.currentCity}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* Content Sections */}
//             <View style={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 }}>
//               {/* Basic Information */}
//               <View style={{
//                 backgroundColor: '#FFF',
//                 borderRadius: 16,
//                 marginBottom: 16,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 5,
//                 elevation: 2,
//               }}>
//                 <TouchableOpacity
//                   onPress={() => toggleSection('basic')}
//                   activeOpacity={0.8}
//                   style={{
//                     padding: 20,
//                   }}
//                 >
//                   <View style={{ 
//                     flexDirection: 'row', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                   }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <View style={{
//                         backgroundColor: `${COLORS.primary}15`,
//                         borderRadius: 12,
//                         padding: 10,
//                         marginRight: 12,
//                       }}>
//                         <Ionicons name="person-outline" size={20} color={COLORS.primary} />
//                       </View>
//                       <Text style={{
//                         fontSize: 17,
//                         fontWeight: '600',
//                         color: COLORS.onSurface,
//                       }}>
//                         Basic Information
//                       </Text>
//                     </View>
//                     <Ionicons 
//                       name={expandedSections.basic ? "chevron-up" : "chevron-down"} 
//                       size={20} 
//                       color={COLORS.onSurfaceVariant} 
//                     />
//                   </View>

//                   {expandedSections.basic && (
//                     <View style={{ 
//                       gap: 12,
//                       marginTop: 16,
//                       paddingTop: 16,
//                       borderTopWidth: 1,
//                       borderTopColor: 'rgba(0, 0, 0, 0.06)',
//                     }}>
//                       <InfoRow label="Age" value={`${selectedProfile.age} years`} />
//                       <InfoRow label="Location" value={selectedProfile.currentCity} />
//                       <InfoRow label="Education" value={selectedProfile.education} />
//                       <InfoRow label="Caste" value={selectedProfile.caste} />
//                       <InfoRow label="Last Active" value={selectedProfile.lastActive} />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Professional Section */}
//               <View style={{
//                 backgroundColor: '#FFF',
//                 borderRadius: 16,
//                 marginBottom: 16,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 5,
//                 elevation: 2,
//               }}>
//                 <TouchableOpacity
//                   onPress={() => toggleSection('professional')}
//                   activeOpacity={0.8}
//                   style={{
//                     padding: 20,
//                   }}
//                 >
//                   <View style={{ 
//                     flexDirection: 'row', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                   }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <View style={{
//                         backgroundColor: `${COLORS.secondary}15`,
//                         borderRadius: 12,
//                         padding: 10,
//                         marginRight: 12,
//                       }}>
//                         <Ionicons name="briefcase-outline" size={20} color={COLORS.secondary} />
//                       </View>
//                       <Text style={{
//                         fontSize: 17,
//                         fontWeight: '600',
//                         color: COLORS.onSurface,
//                       }}>
//                         Professional
//                       </Text>
//                     </View>
//                     <Ionicons 
//                       name={expandedSections.professional ? "chevron-up" : "chevron-down"} 
//                       size={20} 
//                       color={COLORS.onSurfaceVariant} 
//                     />
//                   </View>

//                   {expandedSections.professional && (
//                     <View style={{ 
//                       gap: 12,
//                       marginTop: 16,
//                       paddingTop: 16,
//                       borderTopWidth: 1,
//                       borderTopColor: 'rgba(0, 0, 0, 0.06)',
//                     }}>
//                       <InfoRow label="Occupation" value={selectedProfile.occupation || "Not specified"} />
//                       <InfoRow label="Company" value={selectedProfile.company || "Not specified"} />
//                       <InfoRow label="Annual Income" value={selectedProfile.annualIncome || "Not specified"} />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Family Section */}
//               <View style={{
//                 backgroundColor: '#FFF',
//                 borderRadius: 16,
//                 marginBottom: 16,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 5,
//                 elevation: 2,
//               }}>
//                 <TouchableOpacity
//                   onPress={() => toggleSection('family')}
//                   activeOpacity={0.8}
//                   style={{
//                     padding: 20,
//                   }}
//                 >
//                   <View style={{ 
//                     flexDirection: 'row', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                   }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <View style={{
//                         backgroundColor: `${COLORS.accent}15`,
//                         borderRadius: 12,
//                         padding: 10,
//                         marginRight: 12,
//                       }}>
//                         <Ionicons name="people-outline" size={20} color={COLORS.accent} />
//                       </View>
//                       <Text style={{
//                         fontSize: 17,
//                         fontWeight: '600',
//                         color: COLORS.onSurface,
//                       }}>
//                         Family
//                       </Text>
//                     </View>
//                     <Ionicons 
//                       name={expandedSections.family ? "chevron-up" : "chevron-down"} 
//                       size={20} 
//                       color={COLORS.onSurfaceVariant} 
//                     />
//                   </View>

//                   {expandedSections.family && (
//                     <View style={{ 
//                       gap: 12,
//                       marginTop: 16,
//                       paddingTop: 16,
//                       borderTopWidth: 1,
//                       borderTopColor: 'rgba(0, 0, 0, 0.06)',
//                     }}>
//                       <InfoRow label="Father Name" value={selectedProfile.fatherName || "Not specified"} />
//                       <InfoRow label="Mother Name" value={selectedProfile.mother || "Not specified"} />
//                       <InfoRow label="Siblings" value={selectedProfile.motherOccupation || "Not specified"} />
//                       <InfoRow label="Brother" value={selectedProfile.brothers || "Not specified"} />
//                       <InfoRow label="Sisters" value={selectedProfile.sisters || "Not specified"} />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Horoscope Section */}
//               <View style={{
//                 backgroundColor: '#FFF',
//                 borderRadius: 16,
//                 marginBottom: 16,
//                 overflow: 'hidden',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 5,
//                 elevation: 2,
//               }}>
//                 <TouchableOpacity
//                   onPress={() => toggleSection('astrological')}
//                   activeOpacity={0.8}
//                   style={{
//                     padding: 20,
//                   }}
//                 >
//                   <View style={{ 
//                     flexDirection: 'row', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                   }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                       <View style={{
//                         backgroundColor: `${COLORS.gold}15`,
//                         borderRadius: 12,
//                         padding: 10,
//                         marginRight: 12,
//                       }}>
//                         <Ionicons name="star-outline" size={20} color={COLORS.gold} />
//                       </View>
//                       <Text style={{
//                         fontSize: 17,
//                         fontWeight: '600',
//                         color: COLORS.onSurface,
//                       }}>
//                         Horoscope
//                       </Text>
//                     </View>
//                     <Ionicons 
//                       name={expandedSections.astrological ? "chevron-up" : "chevron-down"} 
//                       size={20} 
//                       color={COLORS.onSurfaceVariant} 
//                     />
//                   </View>

//                   {expandedSections.astrological && (
//                     <View style={{ 
//                       gap: 12,
//                       marginTop: 16,
//                       paddingTop: 16,
//                       borderTopWidth: 1,
//                       borderTopColor: 'rgba(0, 0, 0, 0.06)',
//                     }}>
//                       <InfoRow label="Rashi" value={selectedProfile.rashi || "Not specified"} />
//                       <InfoRow label="Nakshira" value={selectedProfile.nakshira || "Not specified"} />
//                       <InfoRow label="Gotra/Devak" value={selectedProfile.gotraDevak || "Not specified"} />
//                       <InfoRow label="Mangal" value={selectedProfile.mangal || "Not specified"} />
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               </View>

//               {/* Action Buttons */}
//               <View style={{ 
//                 flexDirection: 'row', 
//                 gap: 12,
//                 marginTop: 8,
//               }}>
//                 {/* Send Interest Button */}
//                 <TouchableOpacity
//                   onPress={() => {
//                     handleSendInterest(selectedProfile._id);
//                     setSelectedProfile(null);
//                   }}
//                   disabled={selectedProfile.interestSent}
//                   activeOpacity={0.8}
//                   style={{
//                     flex: 1,
//                     borderRadius: 14,
//                     overflow: 'hidden',
//                     shadowColor: selectedProfile.interestSent ? COLORS.success : COLORS.primary,
//                     shadowOffset: { width: 0, height: 4 },
//                     shadowOpacity: 0.2,
//                     shadowRadius: 6,
//                     elevation: 3,
//                   }}
//                 >
//                   {selectedProfile.interestSent ? (
//                     <View style={{
//                       backgroundColor: COLORS.success,
//                       paddingVertical: 16,
//                       alignItems: 'center',
//                       flexDirection: 'row',
//                       justifyContent: 'center',
//                       gap: 8,
//                     }}>
//                       <Ionicons name="checkmark-circle" size={18} color="#FFF" />
//                       <Text style={{ 
//                         color: '#FFF',
//                         fontSize: 15,
//                         fontWeight: '600',
//                       }}>
//                         Interest Sent
//                       </Text>
//                     </View>
//                   ) : (
//                     <LinearGradient
//                       colors={COLORS.gradientPrimary}
//                       style={{
//                         paddingVertical: 16,
//                         alignItems: 'center',
//                         flexDirection: 'row',
//                         justifyContent: 'center',
//                         gap: 8,
//                       }}
//                     >
//                       <Ionicons name="heart" size={18} color="#FFF" />
//                       <Text style={{ 
//                         color: '#FFF',
//                         fontSize: 15,
//                         fontWeight: '600',
//                       }}>
//                         Send Interest
//                       </Text>
//                     </LinearGradient>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       )}
//     </Modal>
//   );

//   // Helper component for info rows
//   const InfoRow = ({ label, value }) => (
//     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//       <Text style={{ fontSize: 15, color: COLORS.onSurfaceVariant, fontWeight: '500' }}>
//         {label}
//       </Text>
//       <Text style={{ fontSize: 15, color: COLORS.onSurface, fontWeight: '500' }}>
//         {value}
//       </Text>
//     </View>
//   );

//   // Quick Filters Modal
//   const renderQuickFiltersModal = () => (
//     <Modal
//       visible={showQuickFilters}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={() => setShowQuickFilters(false)}
//     >
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <StatusBar barStyle="dark-content" />
        
//         {/* Enhanced Header with Gradient Backdrop */}
//         <View style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingHorizontal: 24,
//           paddingVertical: 20,
//           backgroundColor: COLORS.background,
//           borderBottomWidth: 1,
//           borderBottomColor: COLORS.outline + '15',
//           shadowColor: COLORS.onSurface,
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.08,
//           shadowRadius: 8,
//           elevation: 4,
//         }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
//             <View style={{
//               backgroundColor: COLORS.primary + '15',
//               borderRadius: 12,
//               padding: 8,
//             }}>
//               <Ionicons name="filter" size={20} color={COLORS.primary} />
//             </View>
//             <Text style={{
//               fontSize: 28,
//               fontWeight: '800',
//               color: COLORS.onSurface,
//               letterSpacing: -0.8,
//             }}>
//               Quick Filters
//             </Text>
//           </View>
          
//           <TouchableOpacity
//             onPress={() => setShowQuickFilters(false)}
//             activeOpacity={0.7}
//             style={{
//               backgroundColor: COLORS.surfaceContainer + '60',
//               borderRadius: 20,
//               padding: 12,
//               shadowColor: COLORS.onSurface,
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.12,
//               shadowRadius: 6,
//               elevation: 3,
//               borderWidth: 1,
//               borderColor: COLORS.outline + '20',
//             }}
//           >
//             <Ionicons name="close" size={20} color={COLORS.onSurfaceVariant} />
//           </TouchableOpacity>
//         </View>

//         <ScrollView 
//           style={{ flex: 1 }} 
//           contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Filter Cards Container */}
//           <View style={{ paddingTop: 16 }}>
            
//             {/* Toggle Filters Row */}
//             <View style={{ 
//               flexDirection: 'row', 
//               gap: 12, 
//               marginBottom: 20,
//               flexWrap: 'wrap'
//             }}>
//               {[
//                 { key: 'withPhoto', icon: 'image-outline', label: 'Photo', delay: 50 },
//                 { key: 'verified', icon: 'shield-checkmark-outline', label: 'Verified', delay: 100 },
//                 { key: 'activeRecently', icon: 'flash-outline', label: 'Active', delay: 150 },
//                 { key: 'sameCity', icon: 'location-outline', label: 'Same City', delay: 200 },
//               ].map((filter) => (
//                 <Reanimated.View
//                   key={filter.key}
//                   entering={FadeIn.delay(filter.delay).duration(400)}
//                   style={{ flex: 1, minWidth: '40%' }}
//                 >
//                   <TouchableOpacity
//                     onPress={() =>
//                       setQuickFilters((prev) => ({
//                         ...prev,
//                         [filter.key]: prev[filter.key] === null ? true : null,
//                       }))
//                     }
//                     activeOpacity={0.8}
//                     style={{
//                       backgroundColor: quickFilters[filter.key] 
//                         ? COLORS.primary + '20' 
//                         : COLORS.surfaceContainer,
//                       borderRadius: 16,
//                       padding: 16,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       minHeight: 80,
//                       borderWidth: 2,
//                       borderColor: quickFilters[filter.key] 
//                         ? COLORS.primary + '40' 
//                         : COLORS.outline + '15',
//                       shadowColor: COLORS.onSurface,
//                       shadowOffset: { width: 0, height: 3 },
//                       shadowOpacity: quickFilters[filter.key] ? 0.2 : 0.08,
//                       shadowRadius: 8,
//                       elevation: quickFilters[filter.key] ? 4 : 2,
//                       transform: [{ scale: quickFilters[filter.key] ? 1.02 : 1 }],
//                     }}
//                   >
//                     <Ionicons 
//                       name={filter.icon} 
//                       size={24} 
//                       color={quickFilters[filter.key] ? COLORS.primary : COLORS.onSurfaceVariant}
//                       style={{ marginBottom: 6 }}
//                     />
//                     <Text style={{
//                       fontSize: 13,
//                       fontWeight: '600',
//                       color: quickFilters[filter.key] ? COLORS.primary : COLORS.onSurfaceVariant,
//                       textAlign: 'center',
//                     }}>
//                       {filter.label}
//                     </Text>
                    
//                     {/* Active Indicator */}
//                     {quickFilters[filter.key] && (
//                       <View style={{
//                         position: 'absolute',
//                         top: 8,
//                         right: 8,
//                         backgroundColor: COLORS.primary,
//                         borderRadius: 8,
//                         width: 16,
//                         height: 16,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                       }}>
//                         <Ionicons name="checkmark" size={10} color={COLORS.background} />
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 </Reanimated.View>
//               ))}
//             </View>

//             {/* Age Range Section */}
//             <Reanimated.View
//               entering={FadeIn.delay(250).duration(400)}
//               style={{
//                 backgroundColor: COLORS.surfaceContainer,
//                 borderRadius: 20,
//                 padding: 24,
//                 marginBottom: 20,
//                 shadowColor: COLORS.onSurface,
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 12,
//                 elevation: 3,
//                 borderWidth: 1,
//                 borderColor: COLORS.outline + '15',
//               }}
//             >
//               <View style={{ 
//                 flexDirection: 'row', 
//                 alignItems: 'center', 
//                 marginBottom: 20,
//                 paddingBottom: 16,
//                 borderBottomWidth: 1,
//                 borderBottomColor: COLORS.outline + '20',
//               }}>
//                 <View style={{
//                   backgroundColor: COLORS.primary + '15',
//                   borderRadius: 12,
//                   padding: 10,
//                   marginRight: 16,
//                 }}>
//                   <Ionicons name="calendar-outline" size={22} color={COLORS.primary} />
//                 </View>
//                 <Text style={{
//                   fontSize: 20,
//                   fontWeight: '700',
//                   color: COLORS.onSurface,
//                   letterSpacing: -0.3,
//                 }}>
//                   Age Range
//                 </Text>
//               </View>
              
//               <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={{
//                     fontSize: 14,
//                     fontWeight: '600',
//                     color: COLORS.onSurfaceVariant,
//                     marginBottom: 8,
//                   }}>
//                     Min Age
//                   </Text>
//                   <TextInput
//                     value={quickFilters.ageRange[0]?.toString() || ""}
//                     onChangeText={(text) => {
//                       const value = text ? parseInt(text) : null;
//                       setQuickFilters((prev) => ({
//                         ...prev,
//                         ageRange: [value, prev.ageRange[1]],
//                       }));
//                     }}
//                     placeholder="18"
//                     placeholderTextColor={COLORS.onSurfaceVariant + '80'}
//                     keyboardType="numeric"
//                     style={{
//                       backgroundColor: COLORS.surfaceContainerHigh,
//                       borderRadius: 16,
//                       paddingVertical: 16,
//                       paddingHorizontal: 20,
//                       fontSize: 16,
//                       color: COLORS.onSurface,
//                       borderWidth: 2,
//                       borderColor: COLORS.outline + '30',
//                       fontWeight: '600',
//                       textAlign: 'center',
//                     }}
//                   />
//                 </View>
                
//                 <View style={{
//                   backgroundColor: COLORS.primary + '20',
//                   borderRadius: 12,
//                   padding: 8,
//                   marginTop: 22,
//                 }}>
//                   <Text style={{ 
//                     fontSize: 18, 
//                     color: COLORS.primary, 
//                     fontWeight: '700',
//                   }}>
//                     to
//                   </Text>
//                 </View>
                
//                 <View style={{ flex: 1 }}>
//                   <Text style={{
//                     fontSize: 14,
//                     fontWeight: '600',
//                     color: COLORS.onSurfaceVariant,
//                     marginBottom: 8,
//                   }}>
//                     Max Age
//                   </Text>
//                   <TextInput
//                     value={quickFilters.ageRange[1]?.toString() || ""}
//                     onChangeText={(text) => {
//                       const value = text ? parseInt(text) : null;
//                       setQuickFilters(prev => ({
//                         ...prev,
//                         ageRange: [prev.ageRange[0], value],
//                       }));
//                     }}
//                     placeholder="65"
//                     placeholderTextColor={COLORS.onSurfaceVariant + '80'}
//                     keyboardType="numeric"
//                     style={{
//                       backgroundColor: COLORS.surfaceContainerHigh,
//                       borderRadius: 16,
//                       paddingVertical: 16,
//                       paddingHorizontal: 20,
//                       fontSize: 16,
//                       color: COLORS.onSurface,
//                       borderWidth: 2,
//                       borderColor: COLORS.outline + '30',
//                       fontWeight: '600',
//                       textAlign: 'center',
//                     }}
//                   />
//                 </View>
//               </View>
//             </Reanimated.View>

//             {/* Education Section */}
//             <Reanimated.View
//               entering={FadeIn.delay(300).duration(400)}
//               style={{
//                 backgroundColor: COLORS.surfaceContainer,
//                 borderRadius: 20,
//                 padding: 24,
//                 marginBottom: 30,
//                 shadowColor: COLORS.onSurface,
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 12,
//                 elevation: 3,
//                 borderWidth: 1,
//                 borderColor: COLORS.outline + '15',
//               }}
//             >
//               <View style={{ 
//                 flexDirection: 'row', 
//                 alignItems: 'center', 
//                 marginBottom: 20,
//                 paddingBottom: 16,
//                 borderBottomWidth: 1,
//                 borderBottomColor: COLORS.outline + '20',
//               }}>
//                 <View style={{
//                   backgroundColor: COLORS.primary + '15',
//                   borderRadius: 12,
//                   padding: 10,
//                   marginRight: 16,
//                 }}>
//                   <Ionicons name="school-outline" size={22} color={COLORS.primary} />
//                 </View>
//                 <Text style={{
//                   fontSize: 20,
//                   fontWeight: '700',
//                   color: COLORS.onSurface,
//                   letterSpacing: -0.3,
//                 }}>
//                   Education Level
//                 </Text>
//               </View>
              
//               <View style={{ gap: 12 }}>
//                 {[
//                   { value: "High School", icon: "library-outline" },
//                   { value: "Bachelor's Degree", icon: "ribbon-outline" },
//                   { value: "Master's Degree", icon: "trophy-outline" },
//                   { value: "Doctorate", icon: "medal-outline" }
//                 ].map((edu, index) => (
//                   <TouchableOpacity
//                     key={edu.value}
//                     onPress={() =>
//                       setQuickFilters((prev) => ({
//                         ...prev,
//                         education: prev.education === edu.value ? null : edu.value,
//                       }))
//                     }
//                     activeOpacity={0.8}
//                     style={{
//                       backgroundColor: quickFilters.education === edu.value 
//                         ? COLORS.primary + '20' 
//                         : COLORS.surfaceContainerHigh,
//                       borderRadius: 16,
//                       paddingHorizontal: 20,
//                       paddingVertical: 16,
//                       borderWidth: 2,
//                       borderColor: quickFilters.education === edu.value 
//                         ? COLORS.primary + '40' 
//                         : COLORS.outline + '20',
//                       flexDirection: 'row',
//                       alignItems: 'center',
//                       justifyContent: 'space-between',
//                       shadowColor: COLORS.onSurface,
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: quickFilters.education === edu.value ? 0.15 : 0.05,
//                       shadowRadius: 6,
//                       elevation: quickFilters.education === edu.value ? 3 : 1,
//                       transform: [{ scale: quickFilters.education === edu.value ? 1.02 : 1 }],
//                     }}
//                   >
//                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
//                       <Ionicons 
//                         name={edu.icon} 
//                         size={20} 
//                         color={quickFilters.education === edu.value ? COLORS.primary : COLORS.onSurfaceVariant} 
//                       />
//                       <Text style={{
//                         fontSize: 16,
//                         color: quickFilters.education === edu.value ? COLORS.primary : COLORS.onSurface,
//                         fontWeight: '600',
//                       }}>
//                         {edu.value}
//                       </Text>
//                     </View>
                    
//                     {quickFilters.education === edu.value && (
//                       <View style={{
//                         backgroundColor: COLORS.primary,
//                         borderRadius: 10,
//                         padding: 4,
//                       }}>
//                         <Ionicons name="checkmark" size={14} color={COLORS.background} />
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </Reanimated.View>

//             {/* Action Buttons */}
//             <Reanimated.View
//               entering={FadeIn.delay(350)}
//               style={{ 
//                 flexDirection: 'row', 
//                 gap: 16, 
//                 alignItems: 'center',
//                 paddingBottom: 20,
//               }}
//             >
//               {/* Reset Button */}
//               <TouchableOpacity
//                 onPress={() =>
//                   setQuickFilters({
//                     withPhoto: null,
//                     verified: null,
//                     activeRecently: null,
//                     sameCity: null,
//                     ageRange: [null, null],
//                     education: null,
//                   })
//                 }
//                 activeOpacity={0.8}
//                 style={{
//                   flex: 1,
//                   backgroundColor: COLORS.surfaceContainerHigh,
//                   borderRadius: 20,
//                   paddingVertical: 18,
//                   paddingHorizontal: 24,
//                   borderWidth: 2,
//                   borderColor: COLORS.outline + '30',
//                   shadowColor: COLORS.onSurface,
//                   shadowOffset: { width: 0, height: 3 },
//                   shadowOpacity: 0.1,
//                   shadowRadius: 8,
//                   elevation: 2,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: '700',
//                   color: COLORS.onSurfaceVariant,
//                   letterSpacing: 0.3,
//                 }}>
//                   Reset All
//                 </Text>
//               </TouchableOpacity>
              
//               {/* Apply Button */}
//               <TouchableOpacity
//                 onPress={() => setShowQuickFilters(false)}
//                 activeOpacity={0.8}
//                 style={{
//                   flex: 2,
//                   backgroundColor: COLORS.primary,
//                   borderRadius: 20,
//                   paddingVertical: 18,
//                   paddingHorizontal: 32,
//                   shadowColor: COLORS.primary,
//                   shadowOffset: { width: 0, height: 4 },
//                   shadowOpacity: 0.3,
//                   shadowRadius: 12,
//                   elevation: 6,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexDirection: 'row',
//                   gap: 8,
//                 }}
//               >
//                 <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: '700',
//                   color: COLORS.background,
//                   letterSpacing: 0.3,
//                 }}>
//                   Apply Filters
//                 </Text>
//               </TouchableOpacity>
//             </Reanimated.View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </Modal>
//   );

//   // Loading State
//   if (checkingSubscription || !isLoaded) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <View style={{ 
//           flex: 1, 
//           justifyContent: 'center', 
//           alignItems: 'center',
//           padding: 24,
//         }}>
//           <Reanimated.View entering={ZoomIn.duration(600)}>
//             <LinearGradient
//               colors={COLORS.gradientPrimary}
//               style={{
//                 borderRadius: 24,
//                 padding: 24,
//                 marginBottom: 24,
//               }}
//             >
//               <MaterialCommunityIcons name="heart-pulse" size={48} color={COLORS.background} />
//             </LinearGradient>
//           </Reanimated.View>
          
//           <Text style={{
//             fontSize: 18,
//             fontWeight: '600',
//             color: COLORS.onSurface,
//             marginBottom: 8,
//             textAlign: 'center',
//           }}>
//             Finding Your Perfect Matches
//           </Text>
          
//           <Text style={{
//             fontSize: 14,
//             color: COLORS.onSurfaceVariant,
//             textAlign: 'center',
//             lineHeight: 20,
//           }}>
//             We&apos;re curating personalized matches{'\n'}just for you...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Main Component Return
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Animated.View 
//         style={{ 
//           flex: 1, 
//           backgroundColor: COLORS.background,
//           opacity: fadeAnim,
//           transform: [{ scale: scaleAnim }],
//         }}
//       >
//         <SafeAreaView style={{ flex: 1 }}>
//           {renderHeader()}
//           {renderTabBar()}
          
//           <AnimatedFlatList
//             data={filteredMatches}
//             renderItem={renderProfileCard}
//             keyExtractor={(item) => item._id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ 
//               paddingTop: 8,
//               paddingBottom: 50,
//             }}
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 onRefresh={onRefresh}
//                 tintColor={COLORS.primary}
//                 colors={[COLORS.primary]}
//               />
//             }
//             onEndReached={loadMore}
//             onEndReachedThreshold={0.5}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//               { useNativeDriver: true }
//             )}
//             scrollEventThrottle={16}
//             ListEmptyComponent={() => (
//               <View style={{ 
//                 flex: 1, 
//                 justifyContent: 'center', 
//                 alignItems: 'center',
//                 paddingTop: 100,
//                 paddingHorizontal: 24,
//               }}>
//                 <Reanimated.View entering={FadeIn.duration(600)}>
//                   <LinearGradient
//                     colors={COLORS.gradientError}
//                     style={{
//                       borderRadius: 24,
//                       padding: 24,
//                       marginBottom: 24,
//                       alignItems: 'center',
//                     }}
//                   >
//                     <Ionicons name="search" size={48} color={COLORS.background} />
//                   </LinearGradient>
                  
//                   <Text style={{
//                     fontSize: 18,
//                     fontWeight: '600',
//                     color: COLORS.onSurface,
//                     marginBottom: 8,
//                     textAlign: 'center',
//                   }}>
//                     No Matches Found
//                   </Text>
                  
//                   <Text style={{
//                     fontSize: 14,
//                     color: COLORS.onSurfaceVariant,
//                     textAlign: 'center',
//                     lineHeight: 20,
//                   }}>
//                     Try adjusting your filters or{'\n'}check back later for new profiles
//                   </Text>
//                 </Reanimated.View>
//               </View>
//             )}
//           />
          
//           {renderProfileDetailModal()}
//           {renderQuickFiltersModal()}
//         </SafeAreaView>
        
//         <Toast />
//       </Animated.View>
//     </GestureHandlerRootView>
//   );
// };

// export default MatchesScreen;
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
import Reanimated, { FadeIn, SlideInUp, SlideInDown, FadeInDown, ZoomIn } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Easing } from "react-native";
const { width, height } = Dimensions.get("window");
import "../global.css";
// Wrap FlatList with Animated.createAnimatedComponent
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";
// Enhanced Color Palette with Modern Design System - Same as InterestsScreen
const COLORS = {
  primary: "#f87171", // red-400
  primaryLight: "#fca5a5", // red-300
  primaryDark: "#dc2626", // red-600
  secondary: "#ef4444", // red-500
  secondaryLight: "#fca5a5", // red-300
  secondaryDark: "#b91c1c", // red-700
  accent: "#dc2626", // red-600
  accentSecondary: "#f87171", // red-400
  gold: "#FFB300",
  success: "#10b981", // Keep green for success states
  warning: "#f59e0b",
  error: "#dc2626", // red-600
  inactive: "#BDBDBD",
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceVariant: "#FFFFFF",
  outline: "#fecaca", // red-200
  outlineVariant: "#fca5a5", // red-300
  onSurface: "#3D3D3D",
  onSurfaceVariant: "#6D4C41",
  onSurfaceMuted: "#A1887F",
  surfaceContainer: "#fef2f2", // red-50
  surfaceContainerLow: "#fff5f5",
  surfaceContainerHigh: "#FFFFFF",
  surfaceContainerHighest: "#fee2e2", // red-100
  gradientPrimary: ["#f87171", "#dc2626"], // red-400 to red-600
  gradientSecondary: ["#ef4444", "#dc2626"], // red-500 to red-600
  gradientSurface: ["#FFFFFF", "#FFFFFF"],
  gradientCard: ["#FFFFFF", "#fef2f2"], // white to red-50
  gradientGold: ["#FFD740", "#FFB300"],
  gradientError: ["#ef4444", "#dc2626"], // red gradient
  gradientSuccess: ["#4CAF50", "#45a049"],
};
const MatchesScreen = () => {
  const { user } = useSession();
  const navigation = useNavigation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(true);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [quickFilters, setQuickFilters] = useState({
    withPhoto: null,
    verified: null,
    activeRecently: null,
    sameCity: null,
    ageRange: [null, null],
    education: null,
  });
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    professional: true,
    family: true,
    astrological: false,
    preferences: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerAnim = useRef(new Animated.Value(-50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const initialize = async () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.spring(headerAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      setIsLoaded(true);
      await checkSubscription();
      await fetchUsers(1);
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
        console.error("MatchesScreen: Subscription check failed with status:", res.status);
        throw new Error("Failed to fetch subscription");
      }
      const data = await res.json();
      setHasSubscription(data?.subscription?.isSubscribed || false);
    } catch (err) {
      console.error("MatchesScreen: Error checking subscription:", err);
      setHasSubscription(false);
    } finally {
      setCheckingSubscription(false);
    }
  };
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };
  const calculateCompatibility = (userProfile, matchProfile) => {
    const expectationFields = [
      { expectation: "expectedCaste", matchField: "caste" },
      { expectation: "preferredCity", matchField: "currentCity" },
      { expectation: "expectedEducation", matchField: "education" },
      { expectation: "expectedAgeDifference", matchField: "age" },
    ];
    const totalFields = expectationFields.length;
    const percentagePerField = 100 / totalFields;
    let matchedPercentage = 0;
    expectationFields.forEach(({ expectation, matchField }) => {
      const expectedValue = userProfile[expectation];
      const matchValue = matchProfile[matchField];
      if (!expectedValue || !matchValue) return;
      if (expectation === "expectedEducation") {
        const educationHierarchy = ["Doctorate", "Master's Degree", "Bachelor's Degree", "High School"];
        const expectedIndex = educationHierarchy.indexOf(expectedValue);
        const matchIndex = educationHierarchy.indexOf(matchValue);
        if (expectedIndex !== -1 && matchIndex !== -1) {
          matchedPercentage += matchIndex <= expectedIndex ? percentagePerField : percentagePerField / 2;
        }
      } else if (expectation === "expectedAgeDifference") {
        const userAge = calculateAge(userProfile.dob);
        const matchAge = matchProfile.age;
        const ageDiff = Math.abs(userAge - matchAge);
        if (
          (expectedValue === "1" && ageDiff <= 1) ||
          (expectedValue === "2" && ageDiff <= 2) ||
          (expectedValue === "3" && ageDiff <= 3) ||
          (expectedValue === "5" && ageDiff <= 5) ||
          (expectedValue === "6+" && ageDiff >= 6)
        ) {
          matchedPercentage += percentagePerField;
        }
      } else if (expectedValue === matchValue) {
        matchedPercentage += percentagePerField;
      }
    });
    return Math.min(100, Math.round(matchedPercentage));
  };
  const isSameCity = (city1, city2) => {
    if (!city1 || !city2) return false;
    return city1.toLowerCase() === city2.toLowerCase();
  };
  const maskFirstName = (fullName) => {
    if (!fullName) return "****";
    const names = fullName.split(" ");
    return names.length > 1 ? `${"*".repeat(names[0].length)} ${names.slice(1).join(" ")}` : "****";
  };
  const fetchSentInterests = async (senderId) => {
    try {
      const res = await fetch(`${BASE_URL}api/interest?userId=${senderId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) {
        console.error(`MatchesScreen: Fetch sent interests failed with status ${res.status}`);
        return [];
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("MatchesScreen: Invalid content-type:", contentType);
        return [];
      }
      const data = await res.json();
      if (data.success) {
        return data.interests.map((i) => i.receiver.id);
      }
      return [];
    } catch (err) {
      console.error("MatchesScreen: Error fetching sent interests:", err.message);
      return [];
    }
  };
  const fetchUsers = async (pageNum = 1, isRefresh = false) => {
    setIsLoading(pageNum === 1);
    try {
      const currentUserRes = await fetch(`${BASE_URL}api/users/me`);
      if (!currentUserRes.ok) {
        console.error("MatchesScreen: Fetch current user failed with status:", currentUserRes.status);
        throw new Error("Failed to fetch current user");
      }
      const currentUserData = await currentUserRes.json();
      const sentReceiverIds = await fetchSentInterests(currentUserData._id);
      const res = await fetch(`${BASE_URL}api/users/fetchAllUsers?limit=20&page=${pageNum}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) {
        console.error("MatchesScreen: Fetch users failed with status:", res.status);
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      if (data.success) {
        const enriched = data.data
          .filter(
            (matchUser) =>
              matchUser._id !== currentUserData.id &&
              matchUser.gender !== currentUserData.gender &&
              matchUser.dob &&
              matchUser.currentCity &&
              matchUser.education
          )
          .map((matchUser) => {
            const compatibility = calculateCompatibility(currentUserData, {
              ...matchUser,
              age: calculateAge(matchUser.dob),
            });
            return {
              ...matchUser,
              age: calculateAge(matchUser.dob),
              profilePhoto:
                matchUser.profilePhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  matchUser.name || "User"
                )}&size=400&background=f3f4f6&color=374151`,
              hasPhoto: !!matchUser.profilePhoto,
              isBlurred: !hasSubscription,
              matchType: "all",
              interestSent: sentReceiverIds.includes(matchUser._id),
              compatibility,
              bio: matchUser.bio || "Looking for a meaningful connection and lifelong partnership.",
              isNew: Math.random() > 0.7,
              lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
              shortlisted: false,
              isVerified: Math.random() > 0.6,
            };
          });
        setMatches((prev) => (isRefresh || pageNum === 1 ? enriched : [...prev, ...enriched]));
        if (enriched.length > 0) setPage(pageNum);
      }
    } catch (err) {
      console.error("MatchesScreen: Failed to fetch matches:", err.message);
      Toast.show({ type: "error", text1: "Failed to load matches" });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(1, true);
  };
  const loadMore = () => {
    if (!isLoading) fetchUsers(page + 1);
  };
  const tabs = [
    {
      id: "all",
      label: "All Matches",
      count: matches.filter((m) => m.compatibility > 0).length,
      icon: "view-grid-outline",
      color: COLORS.primary,
      gradient: COLORS.gradientPrimary
    },
    {
      id: "preferred",
      label: "High Compatibility",
      count: matches.filter((m) => m.compatibility >= 70).length,
      icon: "star-outline",
      color: COLORS.secondary,
      gradient: COLORS.gradientSecondary
    },
    {
      id: "new",
      label: "New Profiles",
      count: matches.filter((m) => m.isNew).length,
      icon: "plus-circle-outline",
      color: COLORS.success,
      gradient: [COLORS.success, "#22d3ee"]
    },
    {
      id: "nearby",
      label: "Local Matches",
      count: matches.filter((m) => isSameCity(m.currentCity, user?.currentCity)).length,
      icon: "map-marker-outline",
      color: COLORS.accent,
      gradient: [COLORS.accent, "#f472b6"]
    },
  ];
  const filteredMatches = matches
    .filter((match) => {
      if (match.compatibility <= 0) return false;
      let shouldShow = true;
      if (searchQuery) {
        shouldShow = shouldShow && match.currentCity?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (activeTab !== "all") {
        if (activeTab === "preferred" && match.compatibility < 70) return false;
        if (activeTab === "new" && !match.isNew) return false;
        if (activeTab === "nearby" && !isSameCity(match.currentCity, user?.currentCity)) return false;
      }
      if (quickFilters.withPhoto !== null) shouldShow = shouldShow && quickFilters.withPhoto === !!match.hasPhoto;
      if (quickFilters.verified !== null) shouldShow = shouldShow && quickFilters.verified === !!match.isVerified;
      if (quickFilters.activeRecently !== null)
        shouldShow = shouldShow && quickFilters.activeRecently !== match.lastActive.includes("day");
      if (quickFilters.sameCity !== null)
        shouldShow = shouldShow && quickFilters.sameCity === isSameCity(match.currentCity, user?.currentCity);
      if (quickFilters.ageRange[0] !== null && quickFilters.ageRange[1] !== null) {
        shouldShow = shouldShow && match.age >= quickFilters.ageRange[0] && match.age <= quickFilters.ageRange[1];
      }
      if (quickFilters.education) shouldShow = shouldShow && match.education === quickFilters.education;
      return shouldShow;
    })
    .sort((a, b) => b.compatibility - a.compatibility);
  const handleSendInterest = async (receiverId) => {
    const senderId = user?.id || user?.user?.id;
    if (senderId === receiverId) {
      Toast.show({ type: "error", text1: "Can't send interest to yourself" });
      return;
    }
    if (!hasSubscription) {
      navigation.navigate("Subscription");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}api/interest/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ senderId, receiverId }),
      });
      if (!res.ok) {
        console.error("MatchesScreen: Send interest failed with status:", res.status);
        throw new Error("Failed to send interest");
      }
      const data = await res.json();
      if (res.ok) {
        setMatches(matches.map((m) => (m._id === receiverId ? { ...m, interestSent: true } : m)));
        Toast.show({ type: "success", text1: "Interest sent successfully!" });
      } else {
        Toast.show({ type: "error", text1: data.message || "Failed to send interest" });
      }
    } catch (error) {
      console.error("MatchesScreen: Error sending interest:", error.message);
      Toast.show({ type: "error", text1: "Interest Already Sent" });
    }
  };
  const toggleShortlist = (matchId) => {
    setMatches(matches.map((m) => (m._id === matchId ? { ...m, shortlisted: !m.shortlisted } : m)));
  };
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const getCompatibilityColor = (percentage) => {
    if (percentage >= 85) return [COLORS.success, "#22d3ee"];
    if (percentage >= 70) return [COLORS.secondary, "#fbbf24"];
    return [COLORS.primary, COLORS.primaryLight];
  };
  // Scroll-based animations for header and tabs
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
  // Professional App Bar Header
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
         
          {/* Professional app bar layout: Left title, right actions */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            marginBottom: showSearchBar ? 16 : 8,
          }}>
           
            {/* Left: Title with subtle icon */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="heart-box-outline" size={24} color={COLORS.primary} />
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: COLORS.onSurface,
                letterSpacing: -0.5,
              }}>
                Matches
              </Text>
            </View>
           
            {/* Right: Actions with consistent spacing */}
            <View style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
            }}>
             
              {/* Search action */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <View style={{
                  backgroundColor: showSearchBar ? COLORS.primary : COLORS.surfaceContainer,
                  borderRadius: 12,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: showSearchBar ? COLORS.primary : COLORS.outline,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                  <TouchableOpacity
                    onPress={() => handleButtonPress(toggleSearchBar)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={showSearchBar ? "close" : "magnify"}
                      size={20}
                      color={showSearchBar ? COLORS.background : COLORS.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
              {/* Filter action with notification dot */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <LinearGradient
                  colors={COLORS.gradientPrimary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 12,
                    padding: 12,
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleButtonPress(() => setShowQuickFilters(true))}
                    activeOpacity={0.8}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="filter-menu-outline" size={20} color="#ffffff" />
                    <View style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: COLORS.accent,
                      borderWidth: 2,
                      borderColor: '#ffffff',
                    }} />
                  </TouchableOpacity>
                </LinearGradient>
              </Animated.View>
            </View>
          </View>
          {/* Professional search bar with leading icon */}
          {showSearchBar && (
            <Animated.View style={[{
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginHorizontal: 20,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              borderWidth: 1,
              borderColor: COLORS.outline,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }, searchBarStyle]}>
             
              <MaterialCommunityIcons name="magnify" size={20} color={COLORS.primary} />
             
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by location or profession"
                placeholderTextColor={COLORS.onSurfaceMuted}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: COLORS.onSurface,
                  fontWeight: '500',
                  lineHeight: 20,
                }}
                autoFocus={showSearchBar}
                returnKeyType="search"
              />
             
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: COLORS.surfaceContainer,
                    borderRadius: 10,
                    padding: 6,
                  }}
                >
                  <MaterialCommunityIcons name="close" size={16} color={COLORS.onSurfaceVariant} />
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };
  // Professional Fixed Tab Bar
  const renderTabBar = () => (
    <Animated.View style={{ transform: [{ scale: tabBarScale }] }}>
      <View style={{
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outline,
      }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 12,
            alignItems: 'center',
          }}
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <Reanimated.View key={tab.id} entering={FadeIn.delay(index * 100).duration(300)}>
                <TouchableOpacity
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: isActive ? 'transparent' : COLORS.surfaceContainer,
                    borderWidth: isActive ? 1 : 0,
                    borderColor: isActive ? COLORS.primary : 'transparent',
                  }}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={tab.gradient}
                      style={{
                        borderRadius: 18,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                      }}
                    />
                  ) : null}
                  <MaterialCommunityIcons
                    name={isActive ? tab.icon.replace('-outline', '') : tab.icon}
                    size={18}
                    color={isActive ? COLORS.background : COLORS.onSurfaceVariant}
                  />
                  <Text style={{
                    color: isActive ? COLORS.background : COLORS.onSurfaceVariant,
                    fontSize: 14,
                    fontWeight: isActive ? '600' : '500',
                    letterSpacing: 0.2,
                  }}>
                    {tab.label}
                  </Text>
                  <View style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : COLORS.outline,
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    minWidth: 20,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color: isActive ? COLORS.background : COLORS.onSurfaceVariant,
                      fontSize: 11,
                      fontWeight: '600',
                    }}>
                      {tab.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Reanimated.View>
            );
          })}
        </ScrollView>
      </View>
    </Animated.View>
  );
  // Professional Two-Column Profile Card
  const renderProfileCard = ({ item, index }) => (
    <Reanimated.View
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={{
        marginBottom: 20,
        marginHorizontal: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => setSelectedProfile(item)}
        activeOpacity={0.95}
        style={{
          backgroundColor: COLORS.background,
          borderRadius: 16,
          padding: 20,
          flexDirection: 'row',
          gap: 16,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        }}
      >
        {/* Left: Photo and Status */}
        <View style={{ position: 'relative', width: 80 }}>
          <Image
            source={{ uri: item.profilePhoto }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              backgroundColor: COLORS.surfaceContainer,
            }}
          />
          {item.isBlurred && (
            <BlurView
              intensity={60}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.primary} />
            </BlurView>
          )}
          <View style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: item.lastActive === 'Recently' ? COLORS.success : COLORS.inactive,
            borderRadius: 8,
            width: 12,
            height: 12,
            borderWidth: 2,
            borderColor: COLORS.background,
          }} />
        </View>
        
        {/* Right: Details */}
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          {/* Top: Name, Age, Compatibility */}
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: COLORS.onSurface,
                letterSpacing: -0.2,
              }}>
                {hasSubscription ? item.name : maskFirstName(item.name)}
              </Text>
              <LinearGradient
                colors={getCompatibilityColor(item.compatibility)}
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{
                  color: COLORS.background,
                  fontSize: 11,
                  fontWeight: '600',
                  letterSpacing: 0.2,
                }}>
                  {item.compatibility}% Match
                </Text>
              </LinearGradient>
            </View>
            <Text style={{
              fontSize: 14,
              color: COLORS.onSurfaceVariant,
              fontWeight: '500',
            }}>
              {item.age} years • {item.currentCity}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.onSurfaceMuted,
                fontWeight: '500',
              }}>
                {item.education} • {item.lastActive}
              </Text>
              <View style={{
                flexDirection: 'row',
                gap: 4,
              }}>
                {item.isNew && (
                  <View style={{
                    backgroundColor: COLORS.success + '20',
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}>
                    <Text style={{
                      color: COLORS.success,
                      fontSize: 10,
                      fontWeight: '600',
                    }}>
                      New
                    </Text>
                  </View>
                )}
                {item.isVerified && (
                  <View style={{
                    backgroundColor: COLORS.primary + '20',
                    borderRadius: 6,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}>
                    <MaterialCommunityIcons name="shield-check-outline" size={12} color={COLORS.primary} />
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* Bottom: Bio and Action */}
          <View style={{ gap: 12, marginTop: 8 }}>
            <Text style={{
              fontSize: 13,
              color: COLORS.onSurfaceVariant,
              lineHeight: 18,
              fontWeight: '400',
            }}>
              {item.bio}
            </Text>
            <TouchableOpacity
              onPress={() => handleSendInterest(item._id)}
              disabled={item.interestSent}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: item.interestSent ? COLORS.success : COLORS.primary,
                borderWidth: 1,
                borderColor: item.interestSent ? COLORS.success : COLORS.primary,
              }}
            >
              <MaterialCommunityIcons 
                name={item.interestSent ? "check-circle" : "heart-outline"} 
                size={16} 
                color={COLORS.background} 
              />
              <Text style={{
                color: COLORS.background,
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.2,
              }}>
                {item.interestSent ? "Interest Sent" : "Send Interest"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Reanimated.View>
  );
  // Professional Profile Detail Modal
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
         
          {/* Professional modal header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: COLORS.background,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.outline,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <TouchableOpacity
              onPress={() => setSelectedProfile(null)}
              activeOpacity={0.7}
              style={{
                padding: 8,
              }}
            >
              <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: COLORS.onSurface,
              letterSpacing: -0.2,
            }}>
              Profile Overview
            </Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Hero Section */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              <View style={{ position: 'relative', marginBottom: 20 }}>
                <Image
                  source={{ uri: selectedProfile.profilePhoto }}
                  style={{
                    width: '100%',
                    height: 240,
                    borderRadius: 16,
                    backgroundColor: COLORS.surfaceContainer,
                  }}
                />
                {selectedProfile.isBlurred && (
                  <BlurView
                    intensity={60}
                    tint="light"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="lock-outline" size={32} color={COLORS.primary} />
                  </BlurView>
                )}
                <View style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: COLORS.background,
                  borderRadius: 20,
                  padding: 4,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}>
                  <LinearGradient
                    colors={getCompatibilityColor(selectedProfile.compatibility)}
                    style={{
                      borderRadius: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Text style={{
                      color: COLORS.background,
                      fontSize: 12,
                      fontWeight: '600',
                      letterSpacing: 0.2,
                    }}>
                      {selectedProfile.compatibility}% Match
                    </Text>
                  </LinearGradient>
                </View>
                {selectedProfile.isVerified && (
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: COLORS.background,
                    borderRadius: 20,
                    padding: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}>
                    <MaterialCommunityIcons name="shield-check" size={20} color={COLORS.success} />
                  </View>
                )}
              </View>
              
              {/* Name and Key Details */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: COLORS.onSurface,
                  letterSpacing: -0.3,
                  marginBottom: 8,
                }}>
                  {hasSubscription ? selectedProfile.name : maskFirstName(selectedProfile.name)}
                </Text>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="calendar" size={16} color={COLORS.primary} />
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.onSurfaceVariant,
                      fontWeight: '500',
                    }}>
                      {selectedProfile.age} years
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.primary} />
                    <Text style={{
                      fontSize: 14,
                      color: COLORS.onSurfaceVariant,
                      fontWeight: '500',
                    }}>
                      {selectedProfile.currentCity}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Expandable Sections */}
            <View style={{ paddingHorizontal: 20, gap: 12 }}>
              {/* Basic Section */}
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}>
                <TouchableOpacity
                  onPress={() => toggleSection('basic')}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      backgroundColor: `${COLORS.primary}10`,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                      <MaterialCommunityIcons name="account-outline" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: COLORS.onSurface,
                    }}>
                      Basic Information
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={expandedSections.basic ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.onSurfaceVariant}
                  />
                </TouchableOpacity>
                {expandedSections.basic && (
                  <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.outline,
                    gap: 12,
                  }}>
                    <InfoRow label="Age" value={`${selectedProfile.age} years`} icon="calendar" />
                    <InfoRow label="Location" value={selectedProfile.currentCity} icon="map-marker" />
                    <InfoRow label="Education" value={selectedProfile.education} icon="school" />
                    <InfoRow label="Caste" value={selectedProfile.caste} icon="account-group" />
                    <InfoRow label="Last Active" value={selectedProfile.lastActive} icon="clock" />
                  </View>
                )}
              </View>
              
              {/* Professional Section */}
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}>
                <TouchableOpacity
                  onPress={() => toggleSection('professional')}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      backgroundColor: `${COLORS.secondary}10`,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                      <MaterialCommunityIcons name="briefcase-outline" size={20} color={COLORS.secondary} />
                    </View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: COLORS.onSurface,
                    }}>
                      Professional Details
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={expandedSections.professional ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.onSurfaceVariant}
                  />
                </TouchableOpacity>
                {expandedSections.professional && (
                  <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.outline,
                    gap: 12,
                  }}>
                    <InfoRow label="Occupation" value={selectedProfile.occupation || "Not specified"} icon="briefcase" />
                    <InfoRow label="Company" value={selectedProfile.company || "Not specified"} icon="building" />
                    <InfoRow label="Annual Income" value={selectedProfile.annualIncome || "Not specified"} icon="currency-inr" />
                  </View>
                )}
              </View>
              
              {/* Family Section */}
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}>
                <TouchableOpacity
                  onPress={() => toggleSection('family')}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      backgroundColor: `${COLORS.accent}10`,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                      <MaterialCommunityIcons name="account-group-outline" size={20} color={COLORS.accent} />
                    </View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: COLORS.onSurface,
                    }}>
                      Family Background
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={expandedSections.family ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.onSurfaceVariant}
                  />
                </TouchableOpacity>
                {expandedSections.family && (
                  <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.outline,
                    gap: 12,
                  }}>
                    <InfoRow label="Father's Name" value={selectedProfile.fatherName || "Not specified"} icon="account" />
                    <InfoRow label="Mother's Name" value={selectedProfile.mother || "Not specified"} icon="account" />
                    <InfoRow label="Siblings" value={selectedProfile.siblings || "Not specified"} icon="account-multiple" />
                    <InfoRow label="Brothers" value={selectedProfile.brothers || "Not specified"} icon="account-male" />
                    <InfoRow label="Sisters" value={selectedProfile.sisters || "Not specified"} icon="account-female" />
                  </View>
                )}
              </View>
              
              {/* Astrological Section */}
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}>
                <TouchableOpacity
                  onPress={() => toggleSection('astrological')}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      backgroundColor: `${COLORS.gold}10`,
                      borderRadius: 10,
                      padding: 10,
                    }}>
                      <MaterialCommunityIcons name="zodiac-aries" size={20} color={COLORS.gold} />
                    </View>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: COLORS.onSurface,
                    }}>
                      Astrological Details
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={expandedSections.astrological ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.onSurfaceVariant}
                  />
                </TouchableOpacity>
                {expandedSections.astrological && (
                  <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.outline,
                    gap: 12,
                  }}>
                    <InfoRow label="Rashi" value={selectedProfile.rashi || "Not specified"} icon="zodiac-aries" />
                    <InfoRow label="Nakshatra" value={selectedProfile.nakshira || "Not specified"} icon="star" />
                    <InfoRow label="Gotra/Devak" value={selectedProfile.gotraDevak || "Not specified"} icon="tree" />
                    <InfoRow label="Manglik" value={selectedProfile.mangal || "Not specified"} icon="fire" />
                  </View>
                )}
              </View>
            </View>
            
            {/* Action Button */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  handleSendInterest(selectedProfile._id);
                  setSelectedProfile(null);
                }}
                disabled={selectedProfile.interestSent}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: selectedProfile.interestSent ? COLORS.success : COLORS.primary,
                  shadowColor: selectedProfile.interestSent ? COLORS.success : COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <MaterialCommunityIcons 
                  name={selectedProfile.interestSent ? "check-circle" : "heart-outline"} 
                  size={18} 
                  color={COLORS.background} 
                />
                <Text style={{
                  color: COLORS.background,
                  fontSize: 16,
                  fontWeight: '600',
                  letterSpacing: 0.2,
                }}>
                  {selectedProfile.interestSent ? "Interest Sent" : "Send Interest"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Modal>
  );
  // Professional Info Row with Icon
  const InfoRow = ({ label, value, icon }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <MaterialCommunityIcons name={icon} size={16} color={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, color: COLORS.onSurfaceVariant, fontWeight: '500', marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.onSurface, fontWeight: '500' }}>
          {value}
        </Text>
      </View>
    </View>
  );
  // Professional Filters Modal
  const renderQuickFiltersModal = () => (
    <Modal
      visible={showQuickFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowQuickFilters(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" />
       
        {/* Professional modal header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: COLORS.background,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.outline,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <MaterialCommunityIcons name="filter-outline" size={24} color={COLORS.primary} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: COLORS.onSurface,
              letterSpacing: -0.2,
            }}>
              Refine Matches
            </Text>
          </View>
         
          <TouchableOpacity
            onPress={() => setShowQuickFilters(false)}
            activeOpacity={0.7}
            style={{
              padding: 8,
            }}
          >
            <MaterialCommunityIcons name="close" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Toggle Filters Grid */}
          <View style={{ gap: 16, paddingTop: 20 }}>
            <View style={{
              flexDirection: 'row',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {[
                { key: 'withPhoto', icon: 'image-multiple-outline', label: 'With Photos', delay: 100 },
                { key: 'verified', icon: 'shield-check-outline', label: 'Verified', delay: 200 },
                { key: 'activeRecently', icon: 'flash-outline', label: 'Recently Active', delay: 300 },
                { key: 'sameCity', icon: 'map-marker-check-outline', label: 'Same City', delay: 400 },
              ].map((filter) => (
                <Reanimated.View
                  key={filter.key}
                  entering={FadeIn.delay(filter.delay).duration(300)}
                  style={{ width: '48%', minWidth: 140 }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setQuickFilters((prev) => ({
                        ...prev,
                        [filter.key]: prev[filter.key] === null ? true : null,
                      }))
                    }
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor: quickFilters[filter.key] ? COLORS.primary + '05' : COLORS.surfaceContainer,
                      borderWidth: 1,
                      borderColor: quickFilters[filter.key] ? COLORS.primary : COLORS.outline,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.04,
                      shadowRadius: 4,
                      elevation: 1,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={filter.icon}
                      size={20}
                      color={quickFilters[filter.key] ? COLORS.primary : COLORS.onSurfaceVariant}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: quickFilters[filter.key] ? COLORS.primary : COLORS.onSurface,
                      }}>
                        {filter.label}
                      </Text>
                    </View>
                    {quickFilters[filter.key] && (
                      <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                </Reanimated.View>
              ))}
            </View>
            
            {/* Age Range */}
            <Reanimated.View entering={FadeIn.delay(500).duration(300)} style={{ gap: 16 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.onSurface,
                marginBottom: 8,
              }}>
                Age Range
              </Text>
              <View style={{
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 13,
                    color: COLORS.onSurfaceVariant,
                    fontWeight: '500',
                    marginBottom: 4,
                  }}>
                    Minimum
                  </Text>
                  <TextInput
                    value={quickFilters.ageRange[0]?.toString() || ""}
                    onChangeText={(text) => {
                      const value = text ? parseInt(text) : null;
                      setQuickFilters((prev) => ({
                        ...prev,
                        ageRange: [value, prev.ageRange[1]],
                      }));
                    }}
                    placeholder="18"
                    placeholderTextColor={COLORS.onSurfaceMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: COLORS.surfaceContainer,
                      borderRadius: 10,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      fontSize: 16,
                      color: COLORS.onSurface,
                      borderWidth: 1,
                      borderColor: COLORS.outline,
                    }}
                  />
                </View>
                <Text style={{
                  fontSize: 18,
                  color: COLORS.primary,
                  fontWeight: '700',
                }}>
                  —
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 13,
                    color: COLORS.onSurfaceVariant,
                    fontWeight: '500',
                    marginBottom: 4,
                  }}>
                    Maximum
                  </Text>
                  <TextInput
                    value={quickFilters.ageRange[1]?.toString() || ""}
                    onChangeText={(text) => {
                      const value = text ? parseInt(text) : null;
                      setQuickFilters(prev => ({
                        ...prev,
                        ageRange: [prev.ageRange[0], value],
                      }));
                    }}
                    placeholder="65"
                    placeholderTextColor={COLORS.onSurfaceMuted}
                    keyboardType="numeric"
                    style={{
                      backgroundColor: COLORS.surfaceContainer,
                      borderRadius: 10,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      fontSize: 16,
                      color: COLORS.onSurface,
                      borderWidth: 1,
                      borderColor: COLORS.outline,
                    }}
                  />
                </View>
              </View>
            </Reanimated.View>
            
            {/* Education Selection */}
            <Reanimated.View entering={FadeIn.delay(600).duration(300)} style={{ gap: 12 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: COLORS.onSurface,
                marginBottom: 12,
              }}>
                Education Level
              </Text>
              <View style={{ gap: 8 }}>
                {[
                  { value: "High School", icon: "book-open-outline" },
                  { value: "Bachelor's Degree", icon: "graduation-cap" },
                  { value: "Master's Degree", icon: "crown-outline" },
                  { value: "Doctorate", icon: "medal-outline" },
                ].map((edu) => (
                  <TouchableOpacity
                    key={edu.value}
                    onPress={() =>
                      setQuickFilters((prev) => ({
                        ...prev,
                        education: prev.education === edu.value ? null : edu.value,
                      }))
                    }
                    activeOpacity={0.8}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      padding: 14,
                      borderRadius: 10,
                      backgroundColor: quickFilters.education === edu.value ? COLORS.primary + '05' : COLORS.surfaceContainer,
                      borderWidth: 1,
                      borderColor: quickFilters.education === edu.value ? COLORS.primary : COLORS.outline,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={edu.icon}
                      size={18}
                      color={quickFilters.education === edu.value ? COLORS.primary : COLORS.onSurfaceVariant}
                    />
                    <Text style={{
                      flex: 1,
                      fontSize: 14,
                      fontWeight: '500',
                      color: quickFilters.education === edu.value ? COLORS.primary : COLORS.onSurface,
                    }}>
                      {edu.value}
                    </Text>
                    {quickFilters.education === edu.value && (
                      <MaterialCommunityIcons name="check" size={18} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Reanimated.View>
          </View>
        </ScrollView>
        
        {/* Fixed Action Bar */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          gap: 12,
          padding: 20,
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.outline,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <TouchableOpacity
            onPress={() =>
              setQuickFilters({
                withPhoto: null,
                verified: null,
                activeRecently: null,
                sameCity: null,
                ageRange: [null, null],
                education: null,
              })
            }
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: COLORS.surfaceContainer,
              borderWidth: 1,
              borderColor: COLORS.outline,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.onSurfaceVariant,
            }}>
              Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowQuickFilters(false)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: COLORS.primary,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <MaterialCommunityIcons name="filter-check" size={18} color={COLORS.background} />
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.background,
              letterSpacing: 0.2,
            }}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
  // Professional Loading State
  if (checkingSubscription || !isLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 40,
        }}>
          <Reanimated.View entering={ZoomIn.duration(600)}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={{
                borderRadius: 20,
                padding: 24,
                marginBottom: 24,
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons name="heart-handshake-outline" size={40} color={COLORS.background} />
            </LinearGradient>
          </Reanimated.View>
         
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: COLORS.onSurface,
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Discovering Matches
          </Text>
         
          <Text style={{
            fontSize: 14,
            color: COLORS.onSurfaceVariant,
            textAlign: 'center',
            lineHeight: 20,
          }}>
            Analyzing preferences to{'\n'}recommend ideal connections
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  // Main Component Return
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
        <SafeAreaView style={{ flex: 1 }}>
          {renderHeader()}
          {renderTabBar()}
         
          <AnimatedFlatList
            data={filteredMatches}
            renderItem={renderProfileCard}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
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
                paddingTop: 80,
                paddingHorizontal: 40,
              }}>
                <Reanimated.View entering={FadeIn.duration(600)}>
                  <LinearGradient
                    colors={COLORS.gradientError}
                    style={{
                      borderRadius: 20,
                      padding: 24,
                      marginBottom: 24,
                      alignItems: 'center',
                    }}
                  >
                    <MaterialCommunityIcons name="magnify-remove-outline" size={40} color={COLORS.background} />
                  </LinearGradient>
                 
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.onSurface,
                    marginBottom: 8,
                    textAlign: 'center',
                  }}>
                    No Matches Available
                  </Text>
                 
                  <Text style={{
                    fontSize: 14,
                    color: COLORS.onSurfaceVariant,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                    Try modifying your search criteria{'\n'}or check back soon for updates
                  </Text>
                </Reanimated.View>
              </View>
            )}
          />
         
          {renderProfileDetailModal()}
          {renderQuickFiltersModal()}
        </SafeAreaView>
       
        <Toast />
      </Animated.View>
    </GestureHandlerRootView>
  );
};
export default MatchesScreen;