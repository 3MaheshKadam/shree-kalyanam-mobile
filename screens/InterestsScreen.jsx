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
// import Reanimated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
// import { useNavigation } from "@react-navigation/native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// const { width, height } = Dimensions.get("window");
// import "../global.css";

// const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";

// // Red Theme Colors matching your tab bar
// const COLORS = {
//   primary: "#FF6B6B",
//   primaryDark: "#FF5252",
//   primaryLight: "#FF8E8E",
//   secondary: "#FF4757", 
//   secondaryLight: "#FF6B7A",
//   secondaryDark: "#E84142",
//   accent: "#FF3838",
//   accentSecondary: "#FF5E57",
//   gold: "#FF9F43",
//   success: "#2ED573",
//   warning: "#FFA502",
//   error: "#FF4757",
//   inactive: "#94A3B8",
//   inactiveLight: "#CBD5E1",
//   background: "#FFFFFF",
//   surface: "#FFFFFF",
//   surfaceVariant: "#F8FAFC",
//   outline: "#E2E8F0",
//   outlineVariant: "#CBD5E1",
//   onSurface: "#1E293B",
//   onSurfaceVariant: "#475569",
//   onSurfaceMuted: "#64748B",
//   surfaceContainer: "#F1F5F9",
//   surfaceContainerLow: "#F8FAFC",
//   surfaceContainerHigh: "#FFFFFF",
//   surfaceContainerHighest: "#E2E8F0",
  
//   // Gradients
//   gradientPrimary: ["#FF6B6B", "#FF5252"],
//   gradientSecondary: ["#FF4757", "#FF6B6B"],
//   gradientSurface: ["#FFFFFF", "#F8FAFC"],
//   gradientCard: ["#FFFFFF", "#F8FAFC"],
//   gradientGold: ["#FF9F43", "#FF7F37"],
//   gradientError: ["#FF4757", "#FF3838"],
//   gradientSuccess: ["#2ED573", "#25C064"],
// };

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// const InterestsScreen = () => {
//   const { user } = useSession();
//   const navigation = useNavigation();
//   const [activeTab, setActiveTab] = useState("received");
//   const [sentInterests, setSentInterests] = useState([]);
//   const [receivedInterests, setReceivedInterests] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [hasSubscription, setHasSubscription] = useState(false);
//   const [checkingSubscription, setCheckingSubscription] = useState(true);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [showSearchBar, setShowSearchBar] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedSections, setExpandedSections] = useState({
//     basic: false,
//     professional: false,
//     family: false,
//     astrological: false,
//     preferences: false,
//   });
  
//   const searchAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;
//   const scrollY = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const initialize = async () => {
//       Animated.parallel([
//         Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
//         Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 10, useNativeDriver: true }),
//       ]).start();
//       setIsLoaded(true);
//       await checkSubscription();
//       await loadAllData();
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
//         console.error("InterestsScreen: Subscription check failed with status:", res.status);
//         throw new Error("Failed to check subscription");
//       }
//       const data = await res.json();
//       setHasSubscription(data?.subscription?.isSubscribed || false);
//     } catch (err) {
//       console.error("InterestsScreen: Error checking subscription:", err);
//       setHasSubscription(false);
//     } finally {
//       setCheckingSubscription(false);
//     }
//   };

//   const maskFirstName = (fullName) => {
//     if (!fullName) return "****";
//     const names = fullName.split(" ");
//     return names.length > 1 ? `${"*".repeat(names[0].length)} ${names.slice(1).join(" ")}` : "****";
//   };

//   const calculateAge = (dateString) => {
//     if (!dateString) return "N/A";
//     const birthDate = new Date(dateString);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//       age--;
//     }
//     return age;
//   };

//   const fetchInterests = async (type) => {
//     try {
//       const userId = user?.id || user?.user?.id;
//       if (!userId) {
//         console.error("InterestsScreen: Missing userId");
//         return [];
//       }
//       const endpoint = type === "send"
//         ? `${BASE_URL}api/interest/send?userId=${userId}`
//         : `${BASE_URL}api/interest/received?userId=${userId}`;
//       const response = await fetch(endpoint, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || `Failed to fetch ${type} interests`);
//       }
//       const data = await response.json();
//       return data.interests || [];
//     } catch (err) {
//       console.error(`InterestsScreen: Error fetching ${type} interests:`, err);
//       throw err;
//     }
//   };

//   const loadAllData = async () => {
//     if (!user) {
//       setError("User not authenticated");
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [sent, received] = await Promise.all([
//         fetchInterests("send"),
//         fetchInterests("received"),
//       ]);
//       const validSent = sent.filter((item) => item?.receiver && item.receiver.name).map(item => ({
//         ...item,
//         compatibility: Math.round(Math.random() * 100),
//         isVerified: Math.random() > 0.6,
//         isNew: Math.random() > 0.7,
//         lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
//       }));
//       const validReceived = received.filter((item) => item?.sender && item.sender.name).map(item => ({
//         ...item,
//         compatibility: Math.round(Math.random() * 100),
//         isVerified: Math.random() > 0.6,
//         isNew: Math.random() > 0.7,
//         lastActive: ["Recently", "Today", "1 day ago"][Math.floor(Math.random() * 3)],
//       }));
//       setSentInterests(validSent);
//       setReceivedInterests(validReceived);
//     } catch (err) {
//       setError(err.message || "Failed to load interests");
//       Toast.show({ type: "error", text1: "Failed to load interests", text2: err.message });
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   const onRefresh = () => {
//     setIsRefreshing(true);
//     loadAllData();
//   };

//   const handleRetry = () => {
//     loadAllData();
//   };

//   const handleInterestAction = async (action, interestId) => {
//     try {
//       const response = await fetch(`${BASE_URL}api/interest/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
//         body: JSON.stringify({ status: action, interestId }),
//       });
//       if (!response.ok) throw new Error("Action failed");
//       loadAllData();
//       Toast.show({ type: "success", text1: `Interest ${action}` });
//     } catch (err) {
//       setError(err.message);
//       Toast.show({ type: "error", text1: "Action failed", text2: err.message });
//     }
//   };

//   const handleViewProfile = (person, type) => {
//     if (!hasSubscription) {
//       navigation.navigate("Subscription");
//       return;
//     }
//     const profileData = type === "sent" ? person?.receiver : person?.sender;
//     if (!profileData) {
//       Toast.show({ type: "error", text1: "Profile data not available" });
//       return;
//     }
//     setSelectedProfile({
//       ...profileData,
//       profilePhoto:
//         profileData.profilePhoto ||
//         `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || "User")}&size=400&background=f3f4f6&color=374151`,
//       age: calculateAge(profileData.dob),
//       bio: profileData.bio || "Looking for a meaningful connection and lifelong partnership.",
//       isVerified: person.isVerified,
//       compatibility: person.compatibility,
//       lastActive: person.lastActive,
//       isNew: person.isNew,
//     });
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const getStatusBadgeColor = (status) => {
//     if (status === "accepted") return COLORS.success;
//     if (status === "declined") return COLORS.error;
//     return COLORS.warning;
//   };

//   const getCompatibilityGradient = (percentage) => {
//     if (percentage >= 85) return [COLORS.success, "#22d3ee"];
//     if (percentage >= 70) return [COLORS.warning, "#FFA502"];
//     return [COLORS.primary, COLORS.primaryLight];
//   };

//   const toggleSearchBar = () => {
//     setShowSearchBar(!showSearchBar);
//     Animated.timing(searchAnim, {
//       toValue: showSearchBar ? 0 : 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const searchBarStyle = {
//     opacity: searchAnim,
//     transform: [
//       {
//         translateY: searchAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [-20, 0],
//         }),
//       },
//       {
//         scale: searchAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0.9, 1],
//         }),
//       },
//     ],
//   };

//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [1, 0.9],
//     extrapolate: "clamp",
//   });

//   const renderHeader = () => (
//     <Animated.View
//       style={{
//         opacity: headerOpacity,
//       }}
//     >
//       <LinearGradient
//         colors={COLORS.gradientSurface}
//         style={{
//           paddingTop: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
//           paddingBottom: 16,
//           paddingHorizontal: 20,
//         }}
//       >
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//           <View>
//             <Text style={{
//               fontSize: 28,
//               fontWeight: "700",
//               color: COLORS.onSurface,
//               letterSpacing: -0.5,
//             }}>
//               Interests
//             </Text>
//             <Text style={{
//               fontSize: 14,
//               color: COLORS.onSurfaceMuted,
//               fontWeight: "500",
//               marginTop: 4,
//             }}>
//               Connect with your matches
//             </Text>
//           </View>
//           <TouchableOpacity
//             onPress={toggleSearchBar}
//             style={{
//               backgroundColor: COLORS.surfaceContainerLow,
//               borderRadius: 12,
//               padding: 10,
//             }}
//           >
//             <Ionicons name="search" size={20} color={COLORS.primary} />
//           </TouchableOpacity>
//         </View>
//         {showSearchBar && (
//           <Animated.View style={[searchBarStyle, { marginTop: 12 }]}>
//             <View style={{
//               backgroundColor: COLORS.surfaceContainerLow,
//               borderRadius: 12,
//               padding: 12,
//               flexDirection: "row",
//               alignItems: "center",
//             }}>
//               <Ionicons name="search-outline" size={20} color={COLORS.onSurfaceMuted} />
//               <TextInput
//                 style={{
//                   flex: 1,
//                   marginLeft: 8,
//                   fontSize: 16,
//                   color: COLORS.onSurface,
//                 }}
//                 placeholder="Search interests..."
//                 placeholderTextColor={COLORS.onSurfaceMuted}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//             </View>
//           </Animated.View>
//         )}
//       </LinearGradient>
//     </Animated.View>
//   );

//   const tabs = [
//     {
//       id: "received",
//       label: "Received",
//       count: receivedInterests.length,
//       icon: "mail",
//       color: COLORS.primary,
//       gradient: COLORS.gradientPrimary,
//     },
//     {
//       id: "sent",
//       label: "Sent",
//       count: sentInterests.length,
//       icon: "send",
//       color: COLORS.secondary,
//       gradient: COLORS.gradientSecondary,
//     },
//   ];

//   const renderTabBar = () => (
//     <View style={{ backgroundColor: COLORS.background, paddingVertical: 12 }}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingHorizontal: 16,
//           gap: 12,
//         }}
//       >
//         {tabs.map((tab, index) => {
//           const isActive = activeTab === tab.id;
//           return (
//             <Reanimated.View key={tab.id} entering={FadeIn.delay(index * 100).duration(300)}>
//               <TouchableOpacity
//                 onPress={() => setActiveTab(tab.id)}
//                 activeOpacity={0.8}
//                 style={{
//                   borderRadius: 16,
//                   overflow: "hidden",
//                 }}
//               >
//                 <LinearGradient
//                   colors={isActive ? tab.gradient : [COLORS.surfaceContainerLow, COLORS.surfaceContainerLow]}
//                   style={{
//                     paddingHorizontal: 16,
//                     paddingVertical: 10,
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 8,
//                   }}
//                 >
//                   <Ionicons
//                     name={isActive ? tab.icon : `${tab.icon}-outline`}
//                     size={18}
//                     color={isActive ? COLORS.background : COLORS.primary}
//                   />
//                   <Text style={{
//                     color: isActive ? COLORS.background : COLORS.primary,
//                     fontSize: 14,
//                     fontWeight: isActive ? "700" : "500",
//                   }}>
//                     {tab.label}
//                   </Text>
//                   <View style={{
//                     backgroundColor: isActive ? "rgba(255,255,255,0.3)" : COLORS.outline,
//                     borderRadius: 10,
//                     paddingHorizontal: 8,
//                     paddingVertical: 3,
//                     minWidth: 20,
//                     alignItems: "center",
//                   }}>
//                     <Text style={{
//                       color: isActive ? COLORS.background : COLORS.primary,
//                       fontSize: 11,
//                       fontWeight: "700",
//                     }}>
//                       {tab.count}
//                     </Text>
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </Reanimated.View>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );

//   const renderInterestCard = ({ item: person, index }) => {
//     const type = activeTab;
//     if (!person) return null;
//     const profile = type === "sent" ? person?.receiver : person?.sender;
//     if (!profile || !profile.name) return null;
//     const profileImage = profile?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || "User")}&size=400&background=f3f4f6&color=374151`;
//     const displayName = hasSubscription ? profile?.name : maskFirstName(profile?.name);
//     return (
//       <Reanimated.View
//         entering={FadeInDown.delay(index * 100).duration(500)}
//         style={{
//           marginBottom: 16,
//           marginHorizontal: 16,
//         }}
//       >
//         <TouchableOpacity
//           onPress={() => handleViewProfile(person, type)}
//           activeOpacity={0.9}
//           style={{
//             backgroundColor: COLORS.surface,
//             borderRadius: 16,
//             padding: 16,
//             elevation: 2,
//             shadowColor: COLORS.onSurface,
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 8,
//             borderLeftWidth: 4,
//             borderLeftColor: COLORS.primary,
//           }}
//         >
//           <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
//             <View style={{ position: "relative" }}>
//               <Image
//                 source={{ uri: profileImage }}
//                 style={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: 16,
//                   backgroundColor: COLORS.surfaceContainerLow,
//                 }}
//               />
//               {!hasSubscription && (
//                 <BlurView
//                   intensity={80}
//                   tint="light"
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     borderRadius: 16,
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
//                 </BlurView>
//               )}
//               <View style={{
//                 position: "absolute",
//                 bottom: 4,
//                 right: 4,
//                 backgroundColor: person.lastActive === "Recently" ? COLORS.success : COLORS.inactive,
//                 borderRadius: 8,
//                 width: 14,
//                 height: 14,
//                 borderWidth: 2,
//                 borderColor: COLORS.background,
//               }} />
//             </View>
//             <View style={{ flex: 1, justifyContent: "center" }}>
//               <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                 <Text style={{
//                   fontSize: 18,
//                   fontWeight: "700",
//                   color: COLORS.onSurface,
//                 }}>
//                   {displayName}
//                 </Text>
//                 {person.isVerified && (
//                   <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
//                 )}
//               </View>
//               <Text style={{
//                 fontSize: 13,
//                 color: COLORS.onSurfaceMuted,
//                 fontWeight: "500",
//                 marginBottom: 4,
//               }}>
//                 {calculateAge(profile?.dob)} years • {profile?.currentCity}
//               </Text>
//               <Text style={{
//                 fontSize: 12,
//                 color: COLORS.onSurfaceVariant,
//                 fontWeight: "400",
//               }}>
//                 {profile?.education || "N/A"} • {person.lastActive}
//               </Text>
//             </View>
//           </View>
//           <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
//             {person.isNew && (
//               <View style={{
//                 backgroundColor: COLORS.success,
//                 borderRadius: 8,
//                 paddingHorizontal: 8,
//                 paddingVertical: 3,
//               }}>
//                 <Text style={{
//                   color: COLORS.background,
//                   fontSize: 10,
//                   fontWeight: "700",
//                   textTransform: "uppercase",
//                 }}>
//                   NEW
//                 </Text>
//               </View>
//             )}
//             <View style={{
//               backgroundColor: getStatusBadgeColor(person.status),
//               borderRadius: 8,
//               paddingHorizontal: 8,
//               paddingVertical: 3,
//             }}>
//               <Text style={{
//                 color: COLORS.background,
//                 fontSize: 10,
//                 fontWeight: "700",
//                 textTransform: "uppercase",
//               }}>
//                 {person.status.toUpperCase()}
//               </Text>
//             </View>
//           </View>
//           <Text style={{
//             fontSize: 13,
//             color: COLORS.onSurfaceVariant,
//             lineHeight: 18,
//             marginBottom: 12,
//             fontWeight: "400",
//           }}>
//             {profile.bio || "Looking for a meaningful connection and lifelong partnership."}
//           </Text>
//           <View style={{
//             flexDirection: "row",
//             gap: 12,
//             justifyContent: type === "received" && person.status === "pending" ? "space-between" : "center",
//           }}>
//             {type === "received" && person.status === "pending" && (
//               <>
//                 <TouchableOpacity
//                   onPress={() => handleInterestAction("declined", person._id)}
//                   activeOpacity={0.8}
//                   style={{
//                     flex: 1,
//                     borderRadius: 12,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <LinearGradient
//                     colors={COLORS.gradientError}
//                     style={{
//                       paddingVertical: 10,
//                       alignItems: "center",
//                       flexDirection: "row",
//                       justifyContent: "center",
//                       gap: 6,
//                     }}
//                   >
//                     <Ionicons name="close" size={14} color={COLORS.background} />
//                     <Text style={{
//                       color: COLORS.background,
//                       fontSize: 13,
//                       fontWeight: "600",
//                     }}>
//                       Decline
//                     </Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => handleInterestAction("accepted", person._id)}
//                   activeOpacity={0.8}
//                   style={{
//                     flex: 1,
//                     borderRadius: 12,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <LinearGradient
//                     colors={COLORS.gradientSuccess}
//                     style={{
//                       paddingVertical: 10,
//                       alignItems: "center",
//                       flexDirection: "row",
//                       justifyContent: "center",
//                       gap: 6,
//                     }}
//                   >
//                     <Ionicons name="checkmark" size={14} color={COLORS.background} />
//                     <Text style={{
//                       color: COLORS.background,
//                       fontSize: 13,
//                       fontWeight: "600",
//                     }}>
//                       Accept
//                     </Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </>
//             )}
//             {(person.status !== "pending" || type === "sent") && (
//               <TouchableOpacity
//                 onPress={() => handleViewProfile(person, type)}
//                 activeOpacity={0.8}
//                 style={{
//                   flex: 1,
//                   borderRadius: 12,
//                   overflow: "hidden",
//                 }}
//               >
//                 <LinearGradient
//                   colors={COLORS.gradientPrimary}
//                   style={{
//                     paddingVertical: 10,
//                     alignItems: "center",
//                     flexDirection: "row",
//                     justifyContent: "center",
//                     gap: 6,
//                   }}
//                 >
//                   <Ionicons name="eye" size={14} color={COLORS.background} />
//                   <Text style={{
//                     color: COLORS.background,
//                     fontSize: 13,
//                     fontWeight: "600",
//                   }}>
//                     View Profile
//                   </Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             )}
//           </View>
//         </TouchableOpacity>
//       </Reanimated.View>
//     );
//   };

//   const EnhancedInfoRow = ({ label, value, icon }) => (
//     <View style={{
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       paddingVertical: 8,
//     }}>
//       <View style={{
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 10,
//         flex: 1,
//       }}>
//         <View style={{
//           backgroundColor: COLORS.primary + "10",
//           borderRadius: 10,
//           padding: 8,
//         }}>
//           <Ionicons name={`${icon}-outline`} size={16} color={COLORS.primary} />
//         </View>
//         <Text style={{
//           fontSize: 14,
//           color: COLORS.onSurfaceVariant,
//           fontWeight: "500",
//         }}>
//           {label}
//         </Text>
//       </View>
//       <Text style={{
//         fontSize: 14,
//         color: COLORS.onSurface,
//         fontWeight: "500",
//         textAlign: "right",
//         flex: 1,
//       }}>
//         {value}
//       </Text>
//     </View>
//   );

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
//           <View style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//             padding: 16,
//             backgroundColor: COLORS.surface,
//           }}>
//             <Text style={{
//               fontSize: 20,
//               fontWeight: "700",
//               color: COLORS.onSurface,
//             }}>
//               Profile Details
//             </Text>
//             <TouchableOpacity
//               onPress={() => setSelectedProfile(null)}
//               activeOpacity={0.7}
//               style={{
//                 backgroundColor: COLORS.surfaceContainerLow,
//                 borderRadius: 12,
//                 padding: 8,
//               }}
//             >
//               <Ionicons name="close" size={20} color={COLORS.primary} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView
//             style={{ flex: 1 }}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 32 }}
//           >
//             <View style={{
//               position: "relative",
//               width: "100%",
//               height: 300,
//               marginBottom: 16,
//             }}>
//               <Image
//                 source={{ uri: selectedProfile.profilePhoto }}
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   resizeMode: "cover",
//                 }}
//               />
//               {!hasSubscription && (
//                 <BlurView
//                   intensity={80}
//                   tint="light"
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <View style={{
//                     backgroundColor: COLORS.surfaceContainer,
//                     borderRadius: 16,
//                     padding: 12,
//                   }}>
//                     <Ionicons name="lock-closed" size={32} color={COLORS.primary} />
//                   </View>
//                 </BlurView>
//               )}
//               <View style={{
//                 position: "absolute",
//                 bottom: 16,
//                 left: 16,
//                 right: 16,
//                 backgroundColor: "rgba(0, 0, 0, 0.6)",
//                 borderRadius: 12,
//                 padding: 12,
//               }}>
//                 <Text style={{
//                   fontSize: 18,
//                   fontWeight: "700",
//                   color: COLORS.background,
//                   marginBottom: 4,
//                 }}>
//                   {hasSubscription ? selectedProfile.name : maskFirstName(selectedProfile.name)}
//                 </Text>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                   <Ionicons name="calendar-outline" size={14} color={COLORS.background} />
//                   <Text style={{
//                     fontSize: 12,
//                     color: COLORS.background,
//                     fontWeight: "500",
//                   }}>
//                     {selectedProfile.age} years
//                   </Text>
//                   <Ionicons name="location-outline" size={14} color={COLORS.background} />
//                   <Text style={{
//                     fontSize: 12,
//                     color: COLORS.background,
//                     fontWeight: "500",
//                   }}>
//                     {selectedProfile.currentCity}
//                   </Text>
//                 </View>
//               </View>
//               {selectedProfile.isVerified && (
//                 <View style={{
//                   position: "absolute",
//                   top: 16,
//                   right: 16,
//                   backgroundColor: COLORS.success,
//                   borderRadius: 12,
//                   padding: 8,
//                 }}>
//                   <Ionicons name="checkmark-circle" size={20} color={COLORS.background} />
//                 </View>
//               )}
//             </View>
//             <View style={{ paddingHorizontal: 16 }}>
//               {["basic", "professional", "family", "astrological", "preferences"].map((section) => (
//                 <View
//                   key={section}
//                   style={{
//                     backgroundColor: COLORS.surface,
//                     borderRadius: 12,
//                     marginBottom: 12,
//                     overflow: "hidden",
//                     elevation: 1,
//                     shadowColor: COLORS.onSurface,
//                     shadowOffset: { width: 0, height: 1 },
//                     shadowOpacity: 0.05,
//                     shadowRadius: 4,
//                     borderLeftWidth: 3,
//                     borderLeftColor: COLORS.primary,
//                   }}
//                 >
//                   <TouchableOpacity
//                     onPress={() => toggleSection(section)}
//                     activeOpacity={0.7}
//                     style={{
//                       padding: 16,
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
//                       <View style={{
//                         backgroundColor: COLORS.primary + "10",
//                         borderRadius: 10,
//                         padding: 8,
//                       }}>
//                         <Ionicons
//                           name={section === "basic" ? "person" : section === "professional" ? "briefcase" : section === "family" ? "home" : section === "astrological" ? "star" : "options"}
//                           size={18}
//                           color={COLORS.primary}
//                         />
//                       </View>
//                       <View>
//                         <Text style={{
//                           fontSize: 16,
//                           fontWeight: "600",
//                           color: COLORS.onSurface,
//                         }}>
//                           {section.charAt(0).toUpperCase() + section.slice(1)} Information
//                         </Text>
//                         <Text style={{
//                           fontSize: 12,
//                           color: COLORS.onSurfaceMuted,
//                           fontWeight: "400",
//                         }}>
//                           {section === "basic" ? "Personal details" : section === "professional" ? "Career info" : section === "family" ? "Family background" : section === "astrological" ? "Horoscope details" : "Partner preferences"}
//                         </Text>
//                       </View>
//                     </View>
//                     <Ionicons
//                       name={expandedSections[section] ? "chevron-up" : "chevron-down"}
//                       size={18}
//                       color={COLORS.primary}
//                     />
//                   </TouchableOpacity>
//                   {expandedSections[section] && (
//                     <View style={{
//                       padding: 16,
//                       borderTopWidth: 1,
//                       borderTopColor: COLORS.outline + "30",
//                     }}>
//                       {section === "basic" && (
//                         <>
//                           <EnhancedInfoRow label="Age" value={`${selectedProfile.age} years`} icon="calendar" />
//                           <EnhancedInfoRow label="Location" value={selectedProfile.currentCity || "Not specified"} icon="location" />
//                           <EnhancedInfoRow label="Education" value={selectedProfile.education || "Not specified"} icon="school" />
//                           <EnhancedInfoRow label="Caste" value={selectedProfile.caste || "Not specified"} icon="people" />
//                           <EnhancedInfoRow label="Last Active" value={selectedProfile.lastActive} icon="time" />
//                         </>
//                       )}
//                       {section === "professional" && (
//                         <>
//                           <EnhancedInfoRow label="Occupation" value={selectedProfile.occupation || "Not specified"} icon="briefcase" />
//                           <EnhancedInfoRow label="Company" value={selectedProfile.company || "Not specified"} icon="business" />
//                           <EnhancedInfoRow label="Annual Income" value={selectedProfile.annualIncome || "Not specified"} icon="cash" />
//                         </>
//                       )}
//                       {section === "family" && (
//                         <>
//                           <EnhancedInfoRow label="Family Type" value={selectedProfile.familyType || "Not specified"} icon="people" />
//                           <EnhancedInfoRow label="Father's Occupation" value={selectedProfile.fatherOccupation || "Not specified"} icon="person" />
//                           <EnhancedInfoRow label="Mother's Occupation" value={selectedProfile.motherOccupation || "Not specified"} icon="person" />
//                         </>
//                       )}
//                       {section === "astrological" && (
//                         <>
//                           <EnhancedInfoRow label="Star Sign" value={selectedProfile.starSign || "Not specified"} icon="star" />
//                           <EnhancedInfoRow label="Moon Sign" value={selectedProfile.moonSign || "Not specified"} icon="moon" />
//                           <EnhancedInfoRow label="Birth Time" value={selectedProfile.birthTime || "Not specified"} icon="time" />
//                           <EnhancedInfoRow label="Birth Place" value={selectedProfile.birthPlace || "Not specified"} icon="location" />
//                         </>
//                       )}
//                       {section === "preferences" && (
//                         <>
//                           <EnhancedInfoRow label="Partner Age Range" value={selectedProfile.partnerAgeRange || "Not specified"} icon="people" />
//                           <EnhancedInfoRow label="Partner Height" value={selectedProfile.partnerHeight || "Not specified"} icon="resize" />
//                           <EnhancedInfoRow label="Partner Education" value={selectedProfile.partnerEducation || "Not specified"} icon="school" />
//                           <EnhancedInfoRow label="Partner Profession" value={selectedProfile.partnerProfession || "Not specified"} icon="briefcase" />
//                           <EnhancedInfoRow label="Expectations" value={selectedProfile.expectations || "Not specified"} icon="heart" />
//                         </>
//                       )}
//                     </View>
//                   )}
//                 </View>
//               ))}
//               <View style={{
//                 flexDirection: "row",
//                 gap: 12,
//                 paddingHorizontal: 16,
//                 paddingBottom: 24,
//               }}>
//                 <TouchableOpacity
//                   onPress={() => setSelectedProfile(null)}
//                   activeOpacity={0.8}
//                   style={{
//                     flex: 1,
//                     borderRadius: 12,
//                     backgroundColor: COLORS.surfaceContainerLow,
//                     paddingVertical: 12,
//                     alignItems: "center",
//                   }}
//                 >
//                   <Text style={{
//                     color: COLORS.primary,
//                     fontSize: 14,
//                     fontWeight: "600",
//                   }}>
//                     Close
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => {
//                     Toast.show({
//                       type: "success",
//                       text1: "Connection Request Sent",
//                       text2: "Your interest has been sent successfully!",
//                     });
//                     setSelectedProfile(null);
//                   }}
//                   activeOpacity={0.8}
//                   style={{
//                     flex: 2,
//                     borderRadius: 12,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <LinearGradient
//                     colors={COLORS.gradientPrimary}
//                     style={{
//                       paddingVertical: 12,
//                       alignItems: "center",
//                       flexDirection: "row",
//                       justifyContent: "center",
//                       gap: 8,
//                     }}
//                   >
//                     <Ionicons name="heart" size={16} color={COLORS.background} />
//                     <Text style={{
//                       color: COLORS.background,
//                       fontSize: 14,
//                       fontWeight: "600",
//                     }}>
//                       Send Interest
//                     </Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </SafeAreaView>
//       )}
//     </Modal>
//   );

//   if (checkingSubscription || !isLoaded) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <View style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           padding: 20,
//         }}>
//           <Reanimated.View entering={ZoomIn.duration(500)}>
//             <LinearGradient
//               colors={COLORS.gradientPrimary}
//               style={{
//                 borderRadius: 16,
//                 padding: 16,
//                 marginBottom: 16,
//               }}
//             >
//               <MaterialCommunityIcons name="heart-pulse" size={40} color={COLORS.background} />
//             </LinearGradient>
//             <Text style={{
//               fontSize: 16,
//               fontWeight: "600",
//               color: COLORS.onSurface,
//               marginBottom: 8,
//             }}>
//               Loading Your Interests
//             </Text>
//             <Text style={{
//               fontSize: 14,
//               color: COLORS.onSurfaceMuted,
//               textAlign: "center",
//             }}>
//               Fetching your connections...
//             </Text>
//           </Reanimated.View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
//         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
//         <View style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           padding: 20,
//         }}>
//           <Reanimated.View entering={FadeIn.duration(500)}>
//             <Ionicons name="alert-circle" size={40} color={COLORS.error} />
//             <Text style={{
//               fontSize: 16,
//               fontWeight: "600",
//               color: COLORS.onSurface,
//               marginBottom: 8,
//             }}>
//               Something Went Wrong
//             </Text>
//             <Text style={{
//               fontSize: 14,
//               color: COLORS.onSurfaceMuted,
//               textAlign: "center",
//             }}>
//               {error}
//             </Text>
//             <TouchableOpacity
//               onPress={handleRetry}
//               style={{
//                 marginTop: 16,
//                 borderRadius: 12,
//                 overflow: "hidden",
//               }}
//             >
//               <LinearGradient
//                 colors={COLORS.gradientPrimary}
//                 style={{
//                   paddingHorizontal: 20,
//                   paddingVertical: 10,
//                   alignItems: "center",
//                 }}
//               >
//                 <Text style={{
//                   color: COLORS.background,
//                   fontWeight: "600",
//                   fontSize: 14,
//                 }}>
//                   Try Again
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Reanimated.View>
//         </View>
//       </SafeAreaView>
//     );
//   }

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
//         <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
//           {renderHeader()}
//           {renderTabBar()}
//           <AnimatedFlatList
//             data={activeTab === "sent" ? sentInterests : receivedInterests}
//             renderItem={renderInterestCard}
//             keyExtractor={(item, index) => item?._id || `interest-${index}`}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{
//               paddingTop: 8,
//               paddingBottom: 50,
//             }}
//             refreshControl={
//               <RefreshControl
//                 refreshing={isRefreshing}
//                 onRefresh={onRefresh}
//                 tintColor={COLORS.primary}
//                 colors={[COLORS.primary]}
//               />
//             }
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//               { useNativeDriver: true }
//             )}
//             scrollEventThrottle={16}
//             ListEmptyComponent={() => (
//               <View style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 paddingTop: 100,
//                 paddingHorizontal: 20,
//               }}>
//                 <Reanimated.View entering={FadeIn.duration(500)}>
//                   <LinearGradient
//                     colors={COLORS.gradientError}
//                     style={{
//                       borderRadius: 16,
//                       padding: 16,
//                       marginBottom: 16,
//                     }}
//                   >
//                     <Ionicons name="heart-dislike" size={40} color={COLORS.background} />
//                   </LinearGradient>
//                   <Text style={{
//                     fontSize: 16,
//                     fontWeight: "600",
//                     color: COLORS.onSurface,
//                     marginBottom: 8,
//                   }}>
//                     No Interests Found
//                   </Text>
//                   <Text style={{
//                     fontSize: 14,
//                     color: COLORS.onSurfaceMuted,
//                     textAlign: "center",
//                   }}>
//                     {activeTab === "sent"
//                       ? "You haven't sent any interests yet."
//                       : "You haven't received any interests yet."}
//                   </Text>
//                 </Reanimated.View>
//               </View>
//             )}
//           />
//           {renderProfileDetailModal()}
//           <Toast />
//         </SafeAreaView>
//       </Animated.View>
//     </GestureHandlerRootView>
//   );
// };

// export default InterestsScreen;
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

const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";

const COLORS = {
  primary: "#f87171",
  primaryDark: "#dc2626",
  primaryLight: "#fca5a5",
  inactive: "#94A3B8",
  background: "#ffffff",
  surface: "#fafafa",
  border: "#e5e7eb",
  text: "#111827",
  textSecondary: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
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
  const [searchQuery, setSearchQuery] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initialize = async () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
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
      if (!res.ok) throw new Error("Failed to check subscription");
      const data = await res.json();
      setHasSubscription(data?.subscription?.isSubscribed || false);
    } catch (err) {
      setHasSubscription(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const maskFirstName = (fullName) => {
    if (!fullName) return "****";
    const names = fullName.split(" ");
    return names.length > 1
      ? `${"*".repeat(names[0].length)} ${names.slice(1).join(" ")}`
      : "****";
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
      if (!userId) return [];
      const endpoint =
        type === "send"
          ? `${BASE_URL}api/interest/send?userId=${userId}`
          : `${BASE_URL}api/interest/received?userId=${userId}`;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch ${type} interests`);
      const data = await response.json();
      return data.interests || [];
    } catch (err) {
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
      setSentInterests(
        sent.filter((item) => item?.receiver && item.receiver.name)
      );
      setReceivedInterests(
        received.filter((item) => item?.sender && item.sender.name)
      );
    } catch (err) {
      setError(err.message || "Failed to load interests");
      Toast.show({
        type: "error",
        text1: "Failed to load interests",
        text2: err.message,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadAllData();
  };

  const handleInterestAction = async (action, interestId) => {
    try {
      const response = await fetch(`${BASE_URL}api/interest/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: action, interestId }),
      });
      if (!response.ok) throw new Error("Action failed");
      loadAllData();
      Toast.show({ type: "success", text1: `Interest ${action}` });
    } catch (err) {
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
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          profileData.name || "User"
        )}&size=400`,
      age: calculateAge(profileData.dob),
    });
  };

  const renderHeader = () => (
    <View
      style={{
        paddingTop: Platform.OS === "ios" ? 50 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.background,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.primary + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="heart" size={20} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.text }}>
            Interests
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
            {activeTab === "received" ? "People interested in you" : "Your sent interests"}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 8,
            fontSize: 15,
            color: COLORS.text,
          }}
          placeholder="Search by name or location..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );

  const renderTabBar = () => (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingBottom: 16,
        gap: 12,
        backgroundColor: COLORS.background,
      }}
    >
      <TouchableOpacity
        onPress={() => setActiveTab("received")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 10,
          backgroundColor:
            activeTab === "received" ? COLORS.primary : COLORS.surface,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "received" ? COLORS.background : COLORS.text,
          }}
        >
          Received ({receivedInterests.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab("sent")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 10,
          backgroundColor: activeTab === "sent" ? COLORS.primary : COLORS.surface,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: activeTab === "sent" ? COLORS.background : COLORS.text,
          }}
        >
          Sent ({sentInterests.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInterestCard = ({ item: person, index }) => {
    const type = activeTab;
    if (!person) return null;
    const profile = type === "sent" ? person?.receiver : person?.sender;
    if (!profile || !profile.name) return null;

    const profileImage =
      profile?.profilePhoto ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.name || "User"
      )}&size=400`;
    const displayName = hasSubscription ? profile?.name : maskFirstName(profile?.name);

    return (
      <Reanimated.View
        entering={FadeInDown.delay(index * 50).duration(400)}
        style={{ marginBottom: 16, marginHorizontal: 20 }}
      >
        <TouchableOpacity
          onPress={() => handleViewProfile(person, type)}
          activeOpacity={0.95}
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View style={{ flexDirection: "row", padding: 16, gap: 14 }}>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: profileImage }}
                style={{
                  width: 90,
                  height: 110,
                  borderRadius: 12,
                  backgroundColor: COLORS.surface,
                }}
              />
              {!hasSubscription && (
                <BlurView
                  intensity={60}
                  tint="light"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
                </BlurView>
              )}
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor:
                    person.status === "accepted"
                      ? COLORS.success
                      : person.status === "declined"
                      ? COLORS.error
                      : COLORS.warning,
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    color: COLORS.background,
                    fontSize: 9,
                    fontWeight: "700",
                  }}
                >
                  {person.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    color: COLORS.text,
                    marginBottom: 4,
                  }}
                  numberOfLines={1}
                >
                  {displayName}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={13}
                    color={COLORS.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textSecondary,
                      fontWeight: "500",
                    }}
                  >
                    {calculateAge(profile?.dob)} years
                  </Text>
                  <Text style={{ color: COLORS.border }}>•</Text>
                  <Ionicons
                    name="location-outline"
                    size={13}
                    color={COLORS.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.textSecondary,
                      fontWeight: "500",
                    }}
                    numberOfLines={1}
                  >
                    {profile?.currentCity}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textSecondary,
                    lineHeight: 16,
                  }}
                  numberOfLines={2}
                >
                  {profile?.education || "Not specified"}
                </Text>
              </View>

              {type === "received" && person.status === "pending" && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleInterestAction("declined", person._id)}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.surface,
                      borderRadius: 8,
                      paddingVertical: 8,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: COLORS.error,
                    }}
                  >
                    <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: "600" }}>
                      Decline
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleInterestAction("accepted", person._id)}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.success,
                      borderRadius: 8,
                      paddingVertical: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.background,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  const renderProfileModal = () => (
    <Modal
      visible={!!selectedProfile}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedProfile(null)}
    >
      {selectedProfile && (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.text }}>
              Profile Details
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedProfile(null)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Image
              source={{ uri: selectedProfile.profilePhoto }}
              style={{ width: "100%", height: 300 }}
            />
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.text }}>
                {hasSubscription ? selectedProfile.name : maskFirstName(selectedProfile.name)}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.textSecondary,
                  marginTop: 4,
                }}
              >
                {selectedProfile.age} years • {selectedProfile.currentCity}
              </Text>
              <View style={{ marginTop: 20, gap: 12 }}>
                <InfoRow label="Education" value={selectedProfile.education} />
                <InfoRow label="Caste" value={selectedProfile.caste} />
                <InfoRow label="Occupation" value={selectedProfile.occupation} />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Modal>
  );

  const InfoRow = ({ label, value }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{label}</Text>
      <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: "600" }}>
        {value || "Not specified"}
      </Text>
    </View>
  );

  if (checkingSubscription || isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: COLORS.text }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color={COLORS.error} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: COLORS.text,
              marginTop: 12,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadAllData}
            style={{
              marginTop: 20,
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: COLORS.background, fontWeight: "600" }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View
        style={{ flex: 1, backgroundColor: COLORS.background, opacity: fadeAnim }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {renderHeader()}
          {renderTabBar()}
          <AnimatedFlatList
            data={activeTab === "sent" ? sentInterests : receivedInterests}
            renderItem={renderInterestCard}
            keyExtractor={(item, index) => item?._id || `interest-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 80,
                }}
              >
                <Ionicons name="heart-dislike-outline" size={64} color={COLORS.inactive} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: COLORS.text,
                    marginTop: 16,
                  }}
                >
                  No Interests
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    marginTop: 4,
                  }}
                >
                  {activeTab === "sent"
                    ? "You haven't sent any interests yet"
                    : "No interests received yet"}
                </Text>
              </View>
            )}
          />
          {renderProfileModal()}
          <Toast />
        </SafeAreaView>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default InterestsScreen;