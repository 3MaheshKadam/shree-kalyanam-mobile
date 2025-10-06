// "use client";

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
// import { useSession } from 'context/SessionContext';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
// import RazorpayCheckout from 'react-native-razorpay';
// import Toast from 'react-native-toast-message';

// // Enhanced color palette matching your login theme
// const COLORS = {
//   primary: "#FF6B6B",
//   primaryLight: "#FF8E8E", 
//   primaryDark: "#FF5252",
//   secondary: "#FF4757",
//   accent: "#FF3742",
//   inactive: "#9CA3AF",
//   background: "#ffffff",
//   backgroundSecondary: "#f8fafc",
//   border: "#e2e8f0",
//   shadow: "#0f172a",
//   success: "#10b981",
//   gradientPrimary: ["#FF6B6B", "#FF5252"],
// };

// // Reusable Header Component
// const Header = ({ children, height: headerHeight = 180 }) => {
//   return (
//     <LinearGradient
//       colors={COLORS.gradientPrimary}
//       style={{ 
//         height: headerHeight,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 24
//       }}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//     >
//       {children}
//     </LinearGradient>
//   );
// };

// // Custom hook for managing settings data and API calls
// const useSettingsData = (user) => {
//   const [plans, setPlans] = useState([]);
//   const [freePlan, setFreePlan] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentSubscription, setCurrentSubscription] = useState(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const {logout} = useSession()
//   const [accountData, setAccountData] = useState({
//     email: user?.email || '',
//     phone: user?.phone || '',
//     name: user?.name || '',
//   });

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch('https://shiv-bandhan-testing.vercel.app/api/subscription');
//       if (!response.ok) {
//         throw new Error(`Failed to fetch subscription plans: ${response.status} ${response.statusText}`);
//       }
//       const data = await response.json();

//       if (!Array.isArray(data)) {
//         throw new Error('Invalid data format: Expected an array of plans');
//       }

//       const freePlan = data.find(
//         (plan) => plan.price === 0 || plan.price === '0' || plan.name?.toLowerCase().includes('free')
//       );
//       const paidPlans = data.filter((plan) => plan !== freePlan);

//       setFreePlan(freePlan || null);
//       setPlans(paidPlans);

//       if (user?.id) {
//         const userRes = await fetch(`https://shiv-bandhan-testing.vercel.app/api/users/${user.id}`);
//         if (!userRes.ok) {
//           throw new Error(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
//         }
//         const userData = await userRes.json();

//         if (userData.subscription) {
//           setCurrentSubscription({
//             subscriptionId: userData.subscription.subscriptionId,
//             plan: userData.subscription.plan,
//           });
//         }

//         setAccountData((prev) => ({
//           ...prev,
//           email: userData.email || prev.email,
//           phone: userData.phone || prev.phone,
//           name: userData.name || prev.name,
//         }));
//       } else {
//         console.warn('User ID not available, skipping user data fetch');
//       }

//       setIsLoaded(true);
//     } catch (err) {
//       console.error('Error in fetchData:', err);
//       setError(err.message || 'Something went wrong while fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [user]);

//   return {
//     plans,
//     freePlan,
//     loading,
//     error,
//     currentSubscription,
//     setCurrentSubscription,
//     isLoaded,
//     accountData,
//     setAccountData,
//     fetchData,
//   };
// };

// // Navigation button component with elegant hover effects
// const NavigationButton = ({ item, currentView, setCurrentView }) => {
//   const opacity = useSharedValue(1);
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ scale: scale.value }],
//   }));

//   const handlePressIn = () => {
//     opacity.value = withTiming(0.7, { duration: 150 });
//     scale.value = withTiming(0.98, { duration: 150 });
//   };

//   const handlePressOut = () => {
//     opacity.value = withTiming(1, { duration: 150 });
//     scale.value = withTiming(1, { duration: 150 });
//   };

//   return (
//     <Animated.View style={[animatedStyle]} className="min-w-[130px]">
//       <TouchableOpacity
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           paddingVertical: 14,
//           paddingHorizontal: 20,
//           borderRadius: 16,
//           backgroundColor: currentView === item.id ? `${COLORS.primary}15` : '#f8fafc',
//         }}
//         onPress={() => setCurrentView(item.id)}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//       >
//         <View style={{
//           marginRight: 10,
//           width: 36,
//           height: 36,
//           borderRadius: 18,
//           backgroundColor: currentView === item.id ? `${COLORS.primary}20` : '#e2e8f0',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           <Ionicons
//             name={item.icon}
//             size={20}
//             color={currentView === item.id ? COLORS.primary : COLORS.inactive}
//           />
//         </View>
//         <Text style={{
//           fontSize: 14,
//           fontWeight: currentView === item.id ? '700' : '600',
//           color: currentView === item.id ? COLORS.primary : COLORS.inactive
//         }}>
//           {item.label}
//         </Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// // Account settings component
// const AccountSettings = ({ accountData, setAccountData }) => (
//   <Animated.View entering={FadeIn.duration(400)} style={{ paddingVertical: 20 }}>
//     <View style={{
//       backgroundColor: '#ffffff',
//       borderRadius: 24,
//       overflow: 'hidden'
//     }}>
//       <View style={{ padding: 24 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
//           <View style={{
//             width: 56,
//             height: 56,
//             backgroundColor: `${COLORS.primary}15`,
//             borderRadius: 28,
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginRight: 16
//           }}>
//             <Ionicons name="person" size={28} color={COLORS.primary} />
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={{
//               fontSize: 22,
//               fontWeight: '800',
//               color: '#111827',
//               marginBottom: 4,
//               letterSpacing: -0.5
//             }}>Personal Information</Text>
//             <Text style={{
//               fontSize: 14,
//               color: COLORS.inactive,
//               fontWeight: '500'
//             }}>Manage your basic account details</Text>
//           </View>
//         </View>

//         <View style={{ gap: 20 }}>
//           <View style={{ marginBottom: 20 }}>
//             <Text style={{
//               fontSize: 16,
//               fontWeight: '700',
//               color: '#374151',
//               marginBottom: 12
//             }}>Full Name</Text>
//             <TextInput
//               style={{
//                 width: '100%',
//                 paddingHorizontal: 20,
//                 paddingVertical: 16,
//                 backgroundColor: '#f8fafc',
//                 borderRadius: 16,
//                 fontSize: 16,
//                 fontWeight: '400',
//                 color: '#111827',
//               }}
//               value={accountData.name}
//               onChangeText={(text) => setAccountData({ ...accountData, name: text })}
//               placeholder="Enter your full name"
//               placeholderTextColor={COLORS.inactive}
//             />
//           </View>

//           <View style={{ marginBottom: 20 }}>
//             <Text style={{
//               fontSize: 16,
//               fontWeight: '700',
//               color: '#374151',
//               marginBottom: 12
//             }}>Email Address</Text>
//             <TextInput
//               style={{
//                 width: '100%',
//                 paddingHorizontal: 20,
//                 paddingVertical: 16,
//                 backgroundColor: '#f8fafc',
//                 borderRadius: 16,
//                 fontSize: 16,
//                 fontWeight: '400',
//                 color: '#111827',
//               }}
//               value={accountData.email}
//               onChangeText={(text) => setAccountData({ ...accountData, email: text })}
//               placeholder="Enter your email address"
//               placeholderTextColor={COLORS.inactive}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={{ marginBottom: 20 }}>
//             <Text style={{
//               fontSize: 16,
//               fontWeight: '700',
//               color: '#374151',
//               marginBottom: 12
//             }}>Phone Number</Text>
//             <TextInput
//               style={{
//                 width: '100%',
//                 paddingHorizontal: 20,
//                 paddingVertical: 16,
//                 backgroundColor: accountData.phone === '' ? '#fef2f2' : '#f8fafc',
//                 borderRadius: 16,
//                 fontSize: 16,
//                 fontWeight: '500',
//                 color: '#111827',
//               }}
//               value={accountData.phone}
//               onChangeText={(text) => setAccountData({ ...accountData, phone: text })}
//               placeholder="Enter your phone number"
//               placeholderTextColor={COLORS.inactive}
//               keyboardType="phone-pad"
//             />
//             {accountData.phone === '' && (
//               <Text style={{
//                 fontSize: 12,
//                 color: COLORS.primaryDark,
//                 marginTop: 6,
//                 marginLeft: 4,
//                 fontWeight: '500'
//               }}>Phone number is required</Text>
//             )}
//           </View>
//         </View>
//       </View>
//     </View>
//   </Animated.View>
// );

// // Elegant Button Component with subtle interactions
// const ElegantButton = ({ onPress, disabled, children, variant = 'primary', style }) => {
//   const opacity = useSharedValue(1);
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: disabled ? 0.5 : opacity.value,
//     transform: [{ scale: scale.value }],
//   }));

//   const handlePressIn = () => {
//     if (!disabled) {
//       opacity.value = withTiming(0.8, { duration: 100 });
//       scale.value = withTiming(0.98, { duration: 100 });
//     }
//   };

//   const handlePressOut = () => {
//     if (!disabled) {
//       opacity.value = withTiming(1, { duration: 100 });
//       scale.value = withTiming(1, { duration: 100 });
//     }
//   };

//   return (
//     <Animated.View style={[animatedStyle, style]}>
//       <TouchableOpacity
//         onPress={onPress}
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         disabled={disabled}
//         style={{ borderRadius: 50, overflow: 'hidden' }}
//       >
//         <LinearGradient
//           colors={variant === 'success' ? [COLORS.success, COLORS.success] : COLORS.gradientPrimary}
//           style={{
//             paddingVertical: 16,
//             paddingHorizontal: 24,
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}
//         >
//           {children}
//         </LinearGradient>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// // Subscription settings component with enhanced design
// const SubscriptionSettings = ({ 
//   plans, 
//   freePlan, 
//   loading, 
//   error, 
//   currentSubscription, 
//   setCurrentSubscription, 
//   handleSubscription, 
//   isSubscribing, 
//   activeButtonId, 
//   handleRetry, 
//   user, 
//   navigation 
// }) => {
//   const getPlanConfig = (planName) => {
//     const configs = {
//       Gold: {
//         icon: 'star',
//         bgColor: '#FFF8E1',
//         textColor: '#F57C00',
//         badge: 'Popular',
//         gradientColors: ['#FF8F00', '#FFB74D'],
//       },
//       Premium: {
//         icon: 'diamond',
//         bgColor: `${COLORS.primary}15`,
//         textColor: COLORS.primaryDark,
//         badge: 'Recommended',
//         gradientColors: COLORS.gradientPrimary,
//       },
//       Free: {
//         icon: 'gift',
//         bgColor: '#f8fafc',
//         textColor: COLORS.inactive,
//         badge: 'Basic',
//         gradientColors: [COLORS.inactive, '#9E9E9E'],
//       },
//     };
    
//     if (!planName) return configs['Premium'];
//     if (planName.toLowerCase().includes('gold')) return configs['Gold'];
//     if (planName.toLowerCase().includes('premium')) return configs['Premium'];
//     if (planName.toLowerCase().includes('free')) return configs['Free'];
//     return configs['Premium'];
//   };

//   const formatPrice = (price) => {
//     if (price === 0 || price === '0') return '0';
//     return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
//   };

//   const getDurationText = (duration) => {
//     if (duration === 30) return 'month';
//     if (duration === 60) return '2 months';
//     if (duration === 90) return '3 months';
//     if (duration === 180) return '6 months';
//     if (duration === 365) return 'year';
//     return `${duration} days`;
//   };

//   if (loading) {
//     return (
//       <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={{ color: COLORS.inactive, marginTop: 16, fontSize: 16 }}>Loading plans...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 }}>
//         <View style={{
//           width: 64,
//           height: 64,
//           backgroundColor: '#fef2f2',
//           borderRadius: 32,
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginBottom: 16
//         }}>
//           <Ionicons name="alert-circle-outline" size={32} color={COLORS.primaryDark} />
//         </View>
//         <Text style={{
//           fontSize: 20,
//           fontWeight: '700',
//           color: COLORS.primaryDark,
//           textAlign: 'center',
//           marginBottom: 8
//         }}>Unable to Load Plans</Text>
//         <Text style={{
//           fontSize: 14,
//           color: COLORS.inactive,
//           textAlign: 'center',
//           marginBottom: 24,
//           lineHeight: 20
//         }}>{error}</Text>
//         <ElegantButton onPress={handleRetry}>
//           <Text style={{
//             fontSize: 16,
//             fontWeight: '700',
//             color: '#ffffff'
//           }}>Try Again</Text>
//         </ElegantButton>
//       </View>
//     );
//   }

//   return (
//     <Animated.View entering={FadeIn.duration(400)} style={{ paddingVertical: 20 }}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
//         <View style={{
//           width: 56,
//           height: 56,
//           backgroundColor: `${COLORS.primary}15`,
//           borderRadius: 28,
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginRight: 16
//         }}>
//           <Ionicons name="card" size={28} color={COLORS.primary} />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={{
//             fontSize: 22,
//             fontWeight: '800',
//             color: '#111827',
//             marginBottom: 4,
//             letterSpacing: -0.5
//           }}>Subscription Plans</Text>
//           <Text style={{
//             fontSize: 14,
//             color: COLORS.inactive,
//             fontWeight: '500'
//           }}>Choose the plan that fits your needs</Text>
//         </View>
//       </View>

//       <View style={{ gap: 16 }}>
//         {/* Free Plan */}
//         {freePlan && (
//           <View style={{
//             backgroundColor: '#ffffff',
//             borderRadius: 20,
//             overflow: 'hidden',
//             opacity: 0.8
//           }}>
//             <View style={{ padding: 20 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
//                 <View style={{
//                   width: 48,
//                   height: 48,
//                   backgroundColor: getPlanConfig(freePlan.name).bgColor,
//                   borderRadius: 24,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   marginRight: 16
//                 }}>
//                   <Ionicons name={getPlanConfig(freePlan.name).icon} size={24} color={getPlanConfig(freePlan.name).textColor} />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={{
//                     fontSize: 18,
//                     fontWeight: '700',
//                     color: '#111827',
//                     marginBottom: 4
//                   }}>{freePlan.name}</Text>
//                   <Text style={{
//                     fontSize: 24,
//                     fontWeight: '900',
//                     color: COLORS.primary
//                   }}>₹{formatPrice(freePlan.price)}</Text>
//                 </View>
//                 <View style={{
//                   paddingHorizontal: 12,
//                   paddingVertical: 6,
//                   backgroundColor: getPlanConfig(freePlan.name).bgColor,
//                   borderRadius: 16
//                 }}>
//                   <Text style={{
//                     fontSize: 12,
//                     fontWeight: '600',
//                     color: getPlanConfig(freePlan.name).textColor
//                   }}>{getPlanConfig(freePlan.name).badge}</Text>
//                 </View>
//               </View>

//               <View style={{ marginBottom: 16 }}>
//                 {freePlan.features?.slice(0, 3).map((feature, idx) => (
//                   <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//                     <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
//                     <Text style={{ fontSize: 14, color: COLORS.inactive, marginLeft: 8, flex: 1 }}>{feature}</Text>
//                   </View>
//                 ))}
//               </View>

//               <View style={{
//                 paddingVertical: 16,
//                 paddingHorizontal: 24,
//                 backgroundColor: '#f8fafc',
//                 borderRadius: 50,
//                 alignItems: 'center'
//               }}>
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: '700',
//                   color: COLORS.inactive
//                 }}>
//                   {currentSubscription?.subscriptionId === freePlan._id ? 'Current Plan' : 'Free Plan'}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Paid Plans */}
//         {plans.map((plan) => {
//           const config = getPlanConfig(plan.name);
//           const isCurrentPlan = currentSubscription?.subscriptionId === plan._id;
//           const isButtonLoading = isSubscribing && activeButtonId === plan._id;

//           return (
//             <View key={plan._id} style={{
//               backgroundColor: '#ffffff',
//               borderRadius: 20,
//               overflow: 'hidden'
//             }}>
//               <View style={{ padding: 20 }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{
//                     width: 48,
//                     height: 48,
//                     backgroundColor: config.bgColor,
//                     borderRadius: 24,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     marginRight: 16
//                   }}>
//                     <Ionicons name={config.icon} size={24} color={config.textColor} />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={{
//                       fontSize: 18,
//                       fontWeight: '700',
//                       color: '#111827',
//                       marginBottom: 4
//                     }}>{plan.name}</Text>
//                     <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
//                       <Text style={{
//                         fontSize: 24,
//                         fontWeight: '900',
//                         color: COLORS.primary
//                       }}>₹{formatPrice(plan.price)}</Text>
//                       <Text style={{
//                         fontSize: 14,
//                         color: COLORS.inactive,
//                         marginLeft: 4
//                       }}>/{getDurationText(plan.durationInDays)}</Text>
//                     </View>
//                   </View>
//                   <View style={{
//                     paddingHorizontal: 12,
//                     paddingVertical: 6,
//                     backgroundColor: config.bgColor,
//                     borderRadius: 16
//                   }}>
//                     <Text style={{
//                       fontSize: 12,
//                       fontWeight: '600',
//                       color: config.textColor
//                     }}>{config.badge}</Text>
//                   </View>
//                 </View>

//                 <View style={{ marginBottom: 16 }}>
//                   {plan.features?.slice(0, 4).map((feature, idx) => (
//                     <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
//                       <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
//                       <Text style={{ fontSize: 14, color: COLORS.inactive, marginLeft: 8, flex: 1 }}>{feature}</Text>
//                     </View>
//                   ))}
//                 </View>

//                 <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
//                   <View style={{
//                     width: 8,
//                     height: 8,
//                     borderRadius: 4,
//                     backgroundColor: plan.isActive ? COLORS.success : COLORS.primaryDark,
//                     marginRight: 8
//                   }} />
//                   <Text style={{
//                     fontSize: 12,
//                     color: COLORS.inactive,
//                     fontWeight: '500'
//                   }}>
//                     {plan.isActive ? 'Available' : 'Temporarily Unavailable'}
//                   </Text>
//                 </View>

//                 <ElegantButton
//                   onPress={() => handleSubscription(plan)}
//                   disabled={isButtonLoading || isCurrentPlan || !plan.isActive}
//                   variant={isCurrentPlan ? 'success' : 'primary'}
//                 >
//                   <Text style={{
//                     fontSize: 16,
//                     fontWeight: '700',
//                     color: '#ffffff'
//                   }}>
//                     {isButtonLoading 
//                       ? 'Processing...' 
//                       : isCurrentPlan 
//                       ? 'Current Plan' 
//                       : 'Choose Plan'
//                     }
//                   </Text>
//                 </ElegantButton>
//               </View>
//             </View>
//           );
//         })}
//       </View>

//       {/* Subscription Info */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         borderRadius: 20,
//         marginTop: 16,
//         padding: 20
//       }}>
//         <Text style={{
//           fontSize: 16,
//           fontWeight: '700',
//           color: '#111827',
//           marginBottom: 16
//         }}>Subscription Information</Text>
//         <View style={{ gap: 12 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
//             <Text style={{ fontSize: 14, color: COLORS.inactive, marginLeft: 12 }}>Secure payment processing</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="refresh" size={18} color={COLORS.primary} />
//             <Text style={{ fontSize: 14, color: COLORS.inactive, marginLeft: 12 }}>Easy plan upgrades anytime</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="time" size={18} color="#FF8F00" />
//             <Text style={{ fontSize: 14, color: COLORS.inactive, marginLeft: 12 }}>Instant plan activation</Text>
//           </View>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// // Main SettingsScreen component
// const SettingsScreen = () => {
//   const { user, logout } = useSession();
//   const navigation = useNavigation();
//   const [currentView, setCurrentView] = useState('account');
//   const [isSubscribing, setIsSubscribing] = useState(false);
//   const [activeButtonId, setActiveButtonId] = useState(null);

//   const {
//     plans,
//     freePlan,
//     loading,
//     error,
//     currentSubscription,
//     setCurrentSubscription,
//     isLoaded,
//     accountData,
//     setAccountData,
//     fetchData,
//   } = useSettingsData(user);

//   const handleRetry = async () => {
//     setIsSubscribing(false);
//     setActiveButtonId(null);
//     await fetchData();
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch('https://shiv-bandhan-testing.vercel.app/api/users/update', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: user?.id,
//           name: accountData.name,
//           email: accountData.email,
//           phone: accountData.phone,
//         }),
//       });

//       if (!response.ok) throw new Error('Failed to save settings');
      
//       Toast.show({
//         type: 'success',
//         text1: 'Settings Updated',
//         text2: 'Your account information has been saved successfully',
//         position: 'bottom',
//       });
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Update Failed',
//         text2: `Unable to save settings: ${error.message}`,
//         position: 'bottom',
//       });
//     }
//   };

//   const handleSubscription = async (plan) => {
//     try {
//       setActiveButtonId(plan._id);
//       setIsSubscribing(true);

//       const res = await fetch('https://shiv-bandhan-testing.vercel.app/api/payment/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: plan.price * 100,
//           userId: user?.id,
//           planId: plan._id,
//           currentSubscriptionId: currentSubscription?.subscriptionId || null,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to create order: ${res.status} ${res.statusText}`);
//       }

//       const order = await res.json();

//       const options = {
//         key: 'rzp_test_YgehxPKjMam2Wr',
//         amount: order.amount,
//         currency: order.currency,
//         name: 'ShivBandhan Subscription',
//         description: plan.name,
//         order_id: order.id,
//         handler: async (response) => {
//           try {
//             const updateRes = await fetch('https://shiv-bandhan-testing.vercel.app/api/users/update-plan', {
//               method: 'PATCH',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 userId: user.id,
//                 plan: plan.name,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 planId: plan._id,
//                 currentSubscriptionId: currentSubscription?.subscriptionId || null,
//               }),
//             });

//             if (updateRes.ok) {
//               setCurrentSubscription({ subscriptionId: plan._id, plan: plan.name });
//               navigation.navigate('PaymentSuccess');
//               Toast.show({
//                 type: 'success',
//                 text1: 'Subscription Activated',
//                 text2: `Welcome to ${plan.name}! Your subscription is now active.`,
//                 position: 'bottom',
//               });
//             } else {
//               throw new Error('Failed to update subscription');
//             }
//           } catch (err) {
//             Toast.show({
//               type: 'error',
//               text1: 'Subscription Failed',
//               text2: err.message || 'Unable to activate subscription',
//               position: 'bottom',
//             });
//             navigation.navigate('PaymentFailure');
//           }
//         },
//         prefill: {
//           name: user?.name || 'User',
//           email: user?.email || 'user@example.com',
//           contact: user?.phone || '9999999999',
//         },
//         theme: { color: COLORS.primary },
//       };

//       if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
//         throw new Error('RazorpayCheckout is not available. Please ensure the payment module is properly installed.');
//       }

//       await RazorpayCheckout.open(options);
//     } catch (err) {
//       console.error('Subscription error:', JSON.stringify(err, null, 2));
//       Toast.show({
//         type: 'error',
//         text1: 'Subscription Error',
//         text2: err.message || 'Something went wrong. Please try again.',
//         position: 'bottom',
//       });
//     } finally {
//       setActiveButtonId(null);
//       setIsSubscribing(false);
//     }
//   };

//   const navigationItems = [
//     { id: 'account', label: 'Account', icon: 'person-outline' },
//     { id: 'subscription', label: 'Subscription', icon: 'card-outline' },
//   ];

//   const renderContent = () => {
//     switch (currentView) {
//       case 'account':
//         return <AccountSettings accountData={accountData} setAccountData={setAccountData} />;
//       case 'subscription':
//         return (
//           <SubscriptionSettings
//             plans={plans}
//             freePlan={freePlan}
//             loading={loading}
//             error={error}
//             currentSubscription={currentSubscription}
//             setCurrentSubscription={setCurrentSubscription}
//             handleSubscription={handleSubscription}
//             isSubscribing={isSubscribing}
//             activeButtonId={activeButtonId}
//             handleRetry={handleRetry}
//             user={user}
//             navigation={navigation}
//           />
//         );
//       default:
//         return <AccountSettings accountData={accountData} setAccountData={setAccountData} />;
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

//       {/* Header */}
// <Header height={90}>
//   <View style={{ 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     width: '100%',
//     paddingHorizontal: 24,
//     paddingTop: 10
//   }}>
//     <View style={{
//       width: 40,
//       height: 40,
//       backgroundColor: 'rgba(255, 255, 255, 0.25)',
//       borderRadius: 20,
//       alignItems: 'center',
//       justifyContent: 'center',
//       shadowColor: 'rgba(0, 0, 0, 0.1)',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.8,
//       shadowRadius: 4,
//       elevation: 2
//     }}>
//       <Ionicons name="settings-outline" size={22} color="#ffffff" />
//     </View>
//     <Text style={{
//       fontSize: 20,
//       fontWeight: '700',
//       color: '#ffffff',
//       letterSpacing: 0.3,
//       textAlign: 'center',
//       flex: 1,
//       marginRight: 40
//     }}>Settings</Text>
//   </View>
// </Header>

//       {/* Navigation Tabs */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         paddingVertical: 16,
//         paddingTop: 24
//       }}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
//         >
//           {navigationItems.map((item) => (
//             <NavigationButton
//               key={item.id}
//               item={item}
//               currentView={currentView}
//               setCurrentView={setCurrentView}
//             />
//           ))}
//         </ScrollView>
//       </View>

//       {/* Content Area */}
//       <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
//         {renderContent()}
        
//         {currentView === 'account' && (
//           <View style={{ paddingBottom: 32, paddingTop: 16 }}>
//             <ElegantButton onPress={logout}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                 <Ionicons name="log-out" size={20} color="#ffffff" />
//                 <Text style={{
//                   fontSize: 16,
//                   fontWeight: '700',
//                   color: '#ffffff'
//                 }}>Log Out</Text>
//               </View>
//             </ElegantButton>
//           </View>
//         )}
//       </ScrollView>

//       <Toast />
//     </SafeAreaView>
//   );
// };

// export default SettingsScreen;
"use client";

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { useSession } from 'context/SessionContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';

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

const BASE_URL = "https://shiv-bandhan-testing.vercel.app/";

const useSettingsData = (user) => {
  const [plans, setPlans] = useState([]);
  const [freePlan, setFreePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [accountData, setAccountData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    name: user?.name || '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}api/subscription`);
      if (!response.ok) throw new Error('Failed to fetch plans');
      const data = await response.json();

      const freePlan = data.find((plan) => plan.price === 0 || plan.name?.toLowerCase().includes('free'));
      const paidPlans = data.filter((plan) => plan !== freePlan);

      setFreePlan(freePlan || null);
      setPlans(paidPlans);

      if (user?.id) {
        const userRes = await fetch(`${BASE_URL}api/users/${user.id}`);
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();

        if (userData.subscription) {
          setCurrentSubscription({
            subscriptionId: userData.subscription.subscriptionId,
            plan: userData.subscription.plan,
          });
        }

        setAccountData((prev) => ({
          ...prev,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          name: userData.name || prev.name,
        }));
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return {
    plans,
    freePlan,
    loading,
    error,
    currentSubscription,
    setCurrentSubscription,
    accountData,
    setAccountData,
    fetchData,
  };
};

const SettingsScreen = () => {
  const { user, logout } = useSession();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('account');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [activeButtonId, setActiveButtonId] = useState(null);

  const {
    plans,
    freePlan,
    loading,
    error,
    currentSubscription,
    setCurrentSubscription,
    accountData,
    setAccountData,
    fetchData,
  } = useSettingsData(user);

  const handleSave = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          name: accountData.name,
          email: accountData.email,
          phone: accountData.phone,
        }),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      Toast.show({
        type: 'success',
        text1: 'Settings Updated',
        text2: 'Your information has been saved',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message,
      });
    }
  };

  const handleSubscription = async (plan) => {
    try {
      setActiveButtonId(plan._id);
      setIsSubscribing(true);

      const res = await fetch(`${BASE_URL}api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price * 100,
          userId: user?.id,
          planId: plan._id,
          currentSubscriptionId: currentSubscription?.subscriptionId || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create order');
      const order = await res.json();

      const options = {
        key: 'rzp_test_YgehxPKjMam2Wr',
        amount: order.amount,
        currency: order.currency,
        name: 'ShreeKalyanam Subscription',
        description: plan.name,
        order_id: order.id,
        handler: async (response) => {
          try {
            const updateRes = await fetch(`${BASE_URL}api/users/update-plan`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                plan: plan.name,
                razorpay_payment_id: response.razorpay_payment_id,
                planId: plan._id,
                currentSubscriptionId: currentSubscription?.subscriptionId || null,
              }),
            });

            if (updateRes.ok) {
              setCurrentSubscription({ subscriptionId: plan._id, plan: plan.name });
              navigation.navigate('PaymentSuccess');
              Toast.show({
                type: 'success',
                text1: 'Subscription Activated',
              });
            }
          } catch (err) {
            navigation.navigate('PaymentFailure');
          }
        },
        prefill: {
          name: user?.name || 'User',
          email: user?.email || 'user@example.com',
          contact: user?.phone || '9999999999',
        },
        theme: { color: COLORS.primary },
      };

      await RazorpayCheckout.open(options);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Subscription Error',
        text2: err.message,
      });
    } finally {
      setActiveButtonId(null);
      setIsSubscribing(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return '0';
    return price?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };

  const getDuration = (duration) => {
    if (duration === 30) return 'month';
    if (duration === 365) return 'year';
    return `${duration} days`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={{
          paddingTop: Platform.OS === 'ios' ? 10 : (StatusBar.currentHeight || 0) + 10,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="settings" size={24} color={COLORS.background} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 26,
              fontWeight: '700',
              color: COLORS.background,
              letterSpacing: -0.5,
            }}>Settings</Text>
            <Text style={{
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.8)',
              marginTop: 2,
            }}>Manage your account & preferences</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Bar */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('account')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: activeTab === 'account' ? COLORS.primary : COLORS.surface,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: activeTab === 'account' ? COLORS.background : COLORS.text,
          }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('subscription')}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: activeTab === 'subscription' ? COLORS.primary : COLORS.surface,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: activeTab === 'subscription' ? COLORS.background : COLORS.text,
          }}>Subscription</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {activeTab === 'account' && (
          <Animated.View entering={FadeIn}>
            {/* Account Section */}
            <View style={{
              backgroundColor: COLORS.background,
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.text,
                marginBottom: 16,
              }}>Personal Information</Text>

              <View style={{ gap: 16 }}>
                <View>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                  }}>Name</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: COLORS.text,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                    value={accountData.name}
                    onChangeText={(text) => setAccountData({ ...accountData, name: text })}
                    placeholder="Enter your name"
                  />
                </View>

                <View>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                  }}>Email</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: COLORS.text,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                    value={accountData.email}
                    onChangeText={(text) => setAccountData({ ...accountData, email: text })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: COLORS.textSecondary,
                    marginBottom: 8,
                  }}>Phone</Text>
                  <TextInput
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      color: COLORS.text,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                    value={accountData.phone}
                    onChangeText={(text) => setAccountData({ ...accountData, phone: text })}
                    placeholder="Enter your phone"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  paddingVertical: 14,
                  marginTop: 20,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: COLORS.background,
                  fontSize: 15,
                  fontWeight: '600',
                }}>Save Changes</Text>
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={logout}
              style={{
                backgroundColor: COLORS.background,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: COLORS.error,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: COLORS.error,
              }}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {activeTab === 'subscription' && (
          <Animated.View entering={FadeIn}>
            {loading ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : error ? (
              <View style={{
                backgroundColor: COLORS.background,
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
              }}>
                <Ionicons name="alert-circle" size={40} color={COLORS.error} />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginTop: 12,
                }}>{error}</Text>
                <TouchableOpacity
                  onPress={fetchData}
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    marginTop: 16,
                  }}
                >
                  <Text style={{
                    color: COLORS.background,
                    fontWeight: '600',
                  }}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                {/* Free Plan */}
                {freePlan && (
                  <View style={{
                    backgroundColor: COLORS.background,
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    opacity: 0.7,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}>
                      <View>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: COLORS.text,
                          marginBottom: 4,
                        }}>{freePlan.name}</Text>
                        <Text style={{
                          fontSize: 24,
                          fontWeight: '700',
                          color: COLORS.primary,
                        }}>₹{formatPrice(freePlan.price)}</Text>
                      </View>
                      <View style={{
                        backgroundColor: COLORS.surface,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}>
                        <Text style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: COLORS.textSecondary,
                        }}>FREE</Text>
                      </View>
                    </View>
                    
                    <View style={{ gap: 8, marginBottom: 12 }}>
                      {freePlan.features?.slice(0, 3).map((feature, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                          <Text style={{
                            fontSize: 13,
                            color: COLORS.textSecondary,
                            marginLeft: 8,
                          }}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Paid Plans */}
                {plans.map((plan) => {
                  const isActive = currentSubscription?.subscriptionId === plan._id;
                  const isLoading = isSubscribing && activeButtonId === plan._id;

                  return (
                    <View key={plan._id} style={{
                      backgroundColor: COLORS.background,
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 2,
                      borderColor: isActive ? COLORS.primary : COLORS.border,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}>
                        <View>
                          <Text style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: COLORS.text,
                            marginBottom: 4,
                          }}>{plan.name}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{
                              fontSize: 24,
                              fontWeight: '700',
                              color: COLORS.primary,
                            }}>₹{formatPrice(plan.price)}</Text>
                            <Text style={{
                              fontSize: 13,
                              color: COLORS.textSecondary,
                              marginLeft: 4,
                            }}>/{getDuration(plan.durationInDays)}</Text>
                          </View>
                        </View>
                        {isActive && (
                          <View style={{
                            backgroundColor: COLORS.success,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                          }}>
                            <Text style={{
                              fontSize: 11,
                              fontWeight: '600',
                              color: COLORS.background,
                            }}>ACTIVE</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ gap: 8, marginBottom: 16 }}>
                        {plan.features?.slice(0, 4).map((feature, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                            <Text style={{
                              fontSize: 13,
                              color: COLORS.textSecondary,
                              marginLeft: 8,
                            }}>{feature}</Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        onPress={() => handleSubscription(plan)}
                        disabled={isLoading || isActive || !plan.isActive}
                        style={{
                          backgroundColor: isActive ? COLORS.surface : COLORS.primary,
                          borderRadius: 10,
                          paddingVertical: 12,
                          alignItems: 'center',
                          opacity: (!plan.isActive || isActive) ? 0.5 : 1,
                        }}
                      >
                        <Text style={{
                          color: isActive ? COLORS.text : COLORS.background,
                          fontSize: 14,
                          fontWeight: '600',
                        }}>
                          {isLoading ? 'Processing...' : isActive ? 'Current Plan' : 'Subscribe'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
};

export default SettingsScreen;