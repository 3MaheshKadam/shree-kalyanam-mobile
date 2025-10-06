import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Animated, StatusBar, Platform, Image, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Reanimated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown,
  SlideInUp,
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { useSession } from '../context/SessionContext';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BASE_URL = 'https://shiv-bandhan-testing.vercel.app/';

// Enhanced color palette - Red theme
const COLORS = {
  primary: "#f87171", // red-400
  primaryLight: "#fca5a5", // red-300
  primaryDark: "#dc2626", // red-600
  secondary: "#f59e0b",
  accent: "#dc2626",
  inactive: "#64748b",
  background: "#ffffff",
  backgroundSecondary: "#f8fafc",
  border: "#e2e8f0",
  shadow: "#0f172a",
  success: "#10b981",
  gradientPrimary: ["#f87171", "#dc2626"], // red-400 to red-600
  gradient1: ["#fef2f2", "#fee2e2", "#fecaca"], // red tints
  gradient2: ["#ffffff", "#f9fafb"],
  cardGradient: ["#ffffff", "#fffbfb"],
};

// Reusable Header Component
const Header = ({ children, height: headerHeight = 220 }) => {
  return (
    <LinearGradient
      colors={COLORS.gradientPrimary}
      style={[styles.headerGradient, { height: headerHeight }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default function MatrimonialLoginScreen() {
  const { login, user } = useSession();
  let navigation;
  try {
    navigation = useNavigation();
  } catch (error) {
    console.warn('Navigation context not available:', error);
    navigation = null;
  }
  
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [otpFocusedIndex, setOtpFocusedIndex] = useState(-1);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const otpInputRefs = useRef([]);
  const buttonScale = useSharedValue(1);
  const containerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const inputScale = useSharedValue(1);
  const otpProgress = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withSpring(0, { damping: 20, stiffness: 100 });
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    setIsLoaded(true);

    if (user && navigation) {
      navigation.navigate('MainTabs', { screen: 'Matches' });
    }
  }, [user, navigation]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    const filledCount = otp.filter(digit => digit !== '').length;
    otpProgress.value = withTiming(filledCount / 6, { duration: 200 });
  }, [otp]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendOTP = async () => {
    setError('');
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      Toast.show({ 
        type: 'error', 
        text1: 'Invalid mobile number',
        visibilityTime: 3000,
        topOffset: 60
      });
      inputScale.value = withSpring(0.98, { duration: 100 }, () => {
        inputScale.value = withSpring(1, { duration: 100 });
      });
      return;
    }

    setIsLoading(true);
    buttonScale.value = withSpring(0.95);
    
    try {
      const response = await fetch(`${BASE_URL}api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.replace(/\s/g, '') }),
      });
      const data = await response.json();
      if (data.success) {
        setStep(2);
        setResendTimer(30);
        Toast.show({ 
          type: 'success', 
          text1: 'OTP sent successfully',
          visibilityTime: 2000,
          topOffset: 60
        });
      } else {
        setError(data.message || 'Failed to send OTP');
        Toast.show({ 
          type: 'error', 
          text1: data.message || 'Failed to send OTP',
          visibilityTime: 3000,
          topOffset: 60
        });
      }
    } catch (error) {
      setError('Network error. Please try again.');
      Toast.show({ 
        type: 'error', 
        text1: 'Network error',
        visibilityTime: 3000,
        topOffset: 60
      });
    } finally {
      setIsLoading(false);
      buttonScale.value = withSpring(1);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      Toast.show({ 
        type: 'error', 
        text1: 'Incomplete OTP',
        visibilityTime: 3000,
        topOffset: 60
      });
      return;
    }

    setIsLoading(true);
    setError('');
    buttonScale.value = withSpring(0.95);
    
    try {
      const response = await fetch(`${BASE_URL}api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\s/g, ''),
          otp: otpString,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const success = await login(data.userId);
        if (success) {
          Toast.show({ 
            type: 'success', 
            text1: 'Login successful',
            visibilityTime: 2000,
            topOffset: 60
          });
          if (navigation) {
            navigation.navigate('MainTabs', { screen: 'Matches' });
          }
        } else {
          setError('Session creation failed');
          Toast.show({ 
            type: 'error', 
            text1: 'Session creation failed',
            visibilityTime: 3000,
            topOffset: 60
          });
        }
      } else {
        setError(data.error || 'OTP verification failed');
        Toast.show({ 
          type: 'error', 
          text1: data.error || 'OTP verification failed',
          visibilityTime: 3000,
          topOffset: 60
        });
      }
    } catch (error) {
      setError('Network error. Please try again.');
      Toast.show({ 
        type: 'error', 
        text1: 'Network error',
        visibilityTime: 3000,
        topOffset: 60
      });
    } finally {
      setIsLoading(false);
      buttonScale.value = withSpring(1);
    }
  };

  const handleResendOTP = async () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendTimer(30);
    try {
      const response = await fetch(`${BASE_URL}api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.replace(/\s/g, '') }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message || 'Failed to resend OTP');
        setResendTimer(0);
        Toast.show({ 
          type: 'error', 
          text1: data.message || 'Failed to resend OTP',
          visibilityTime: 3000,
          topOffset: 60
        });
      } else {
        Toast.show({ 
          type: 'success', 
          text1: 'OTP resent successfully',
          visibilityTime: 2000,
          topOffset: 60
        });
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setResendTimer(0);
      Toast.show({ 
        type: 'error', 
        text1: 'Network error',
        visibilityTime: 3000,
        topOffset: 60
      });
    }
  };

  const formatPhoneDisplay = (phone) => {
    return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const otpProgressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(otpProgress.value, [0, 1], [0, 100], Extrapolate.CLAMP)}%`,
  }));

  if (user && isLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent={false} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Header height={220}>
            <Reanimated.View entering={FadeIn.duration(600).delay(200)} style={styles.headerContent}>
              {/* Logo */}
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image 
                    source={require('../assets/logo.png.jpeg')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              
              {/* Brand Text */}
              <Text style={styles.brandTitle}>Shree Kalyanam</Text>
              <Text style={styles.brandSubtitle}>Find your perfect match</Text>
            </Reanimated.View>
          </Header>

          {/* Content Area */}
          <Reanimated.View style={[containerAnimatedStyle, styles.contentArea]}>
            <Reanimated.View style={[cardAnimatedStyle, styles.card]}>
              
              {step === 1 ? (
                // Phone Number Step
                <Reanimated.View 
                  entering={SlideInUp.duration(500).delay(300)} 
                  style={styles.formContainer}
                >
                  {/* Step Indicator */}
                  <View style={styles.stepIndicator}>
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                    <View style={[styles.stepDot, styles.stepDotInactive]} />
                  </View>

                  {/* Welcome Text */}
                  <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Let's Sign You In</Text>
                    <Text style={styles.welcomeSubtitle}>
                      Welcome back, you've been missed!
                    </Text>
                  </View>

                  {/* Phone Input */}
                  <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <Reanimated.View style={[inputAnimatedStyle]}>
                      <View style={[
                        styles.phoneInputWrapper,
                        inputFocused && styles.phoneInputWrapperFocused
                      ]}>
                        <View style={styles.countryCodeContainer}>
                          <Text style={styles.countryFlag}>🇮🇳</Text>
                          <Text style={styles.countryCode}>{countryCode}</Text>
                        </View>
                        
                        <TextInput
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                          placeholder="Enter your mobile number"
                          placeholderTextColor="#9CA3AF"
                          style={styles.phoneInput}
                          keyboardType="phone-pad"
                          maxLength={10}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                        />
                        
                        {phoneNumber.length > 0 && (
                          <View style={styles.validationIcon}>
                            <Ionicons 
                              name={validatePhoneNumber(phoneNumber) ? "checkmark-circle" : "close-circle"} 
                              size={20} 
                              color={validatePhoneNumber(phoneNumber) ? COLORS.success : COLORS.primary} 
                            />
                          </View>
                        )}
                      </View>
                    </Reanimated.View>
                  </View>

                  {/* Error Message */}
                  {error ? (
                    <Reanimated.View 
                      entering={SlideInDown.duration(300)} 
                      exiting={FadeOut.duration(200)} 
                      style={styles.errorSection}
                    >
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    </Reanimated.View>
                  ) : null}

                  {/* Continue Button */}
                  <TouchableOpacity
                    disabled={isLoading || !phoneNumber.trim()}
                    onPress={handleSendOTP}
                    onPressIn={() => { buttonScale.value = withSpring(0.96) }}
                    onPressOut={() => { buttonScale.value = withSpring(1) }}
                    activeOpacity={1}
                    style={styles.buttonSection}
                  >
                    <Reanimated.View style={[buttonAnimatedStyle]}>
                      <View style={[
                        styles.primaryButton,
                        (isLoading || !phoneNumber.trim()) && styles.primaryButtonDisabled
                      ]}>
                        <View style={styles.buttonContent}>
                          {isLoading ? (
                            <>
                              <Animated.View 
                                style={{
                                  transform: [{
                                    rotate: fadeAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '360deg']
                                    })
                                  }]
                                }}
                              >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                              </Animated.View>
                              <Text style={styles.buttonText}>Sending OTP...</Text>
                            </>
                          ) : (
                            <Text style={styles.buttonTextLarge}>Get OTP</Text>
                          )}
                        </View>
                      </View>
                    </Reanimated.View>
                  </TouchableOpacity>

                  {/* Security Info */}
                  <View style={styles.securitySection}>
                    <View style={styles.securityContainer}>
                      <View style={styles.securityIcon}>
                        <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
                      </View>
                      <View style={styles.securityTextContainer}>
                        <Text style={styles.securityTitle}>Secure & Private</Text>
                        <Text style={styles.securitySubtitle}>Your number is encrypted and never shared</Text>
                      </View>
                    </View>
                  </View>

                </Reanimated.View>
              ) : (
                // OTP Step
                <Reanimated.View 
                  entering={SlideInUp.duration(500).delay(200)} 
                  style={styles.formContainer}
                >
                  {/* Step Indicator */}
                  <View style={styles.stepIndicator}>
                    <View style={[styles.stepDot, styles.stepDotCompleted]} />
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                  </View>

                  {/* Back Button */}
                  <TouchableOpacity 
                    onPress={() => {
                      setStep(1);
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="#6B7280" />
                  </TouchableOpacity>

                  {/* Title */}
                  <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>Enter Verification Code</Text>
                    <View style={styles.otpSubtitleContainer}>
                      <Text style={styles.welcomeSubtitle}>
                        Code sent to {countryCode} {formatPhoneDisplay(phoneNumber)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setStep(1);
                          setOtp(['', '', '', '', '', '']);
                          setError('');
                        }}
                      >
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* OTP Progress */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Enter 6-digit code</Text>
                      <Text style={styles.progressCount}>{otp.filter(d => d !== '').length}/6</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <Reanimated.View style={[otpProgressStyle, styles.progressFill]} />
                    </View>
                  </View>

                  {/* OTP Inputs */}
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <View key={index} style={styles.otpInputWrapper}>
                        <TextInput
                          ref={(ref) => (otpInputRefs.current[index] = ref)}
                          value={digit}
                          onChangeText={(value) => handleOTPChange(index, value)}
                          onKeyPress={(e) => handleKeyDown(index, e)}
                          onFocus={() => setOtpFocusedIndex(index)}
                          onBlur={() => setOtpFocusedIndex(-1)}
                          style={[
                            styles.otpInput,
                            digit && styles.otpInputFilled,
                            otpFocusedIndex === index && styles.otpInputFocused
                          ]}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          autoFocus={index === 0}
                          selectTextOnFocus
                        />
                      </View>
                    ))}
                  </View>

                  {/* Error Message */}
                  {error ? (
                    <Reanimated.View 
                      entering={SlideInDown.duration(300)} 
                      exiting={FadeOut.duration(200)} 
                      style={styles.errorSection}
                    >
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                        <Text style={styles.errorText}>{error}</Text>
                      </View>
                    </Reanimated.View>
                  ) : null}

                  {/* Verify Button */}
                  <TouchableOpacity
                    disabled={isLoading || otp.join('').length !== 6}
                    onPress={handleVerifyOTP}
                    onPressIn={() => { buttonScale.value = withSpring(0.96) }}
                    onPressOut={() => { buttonScale.value = withSpring(1) }}
                    activeOpacity={1}
                    style={styles.buttonSection}
                  >
                    <Reanimated.View style={[buttonAnimatedStyle]}>
                      <View style={[
                        styles.primaryButton,
                        (isLoading || otp.join('').length !== 6) && styles.primaryButtonDisabled
                      ]}>
                        <View style={styles.buttonContent}>
                          {isLoading ? (
                            <>
                              <Animated.View 
                                style={{
                                  transform: [{
                                    rotate: fadeAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '360deg']
                                    })
                                  }]
                                }}
                              >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                              </Animated.View>
                              <Text style={styles.buttonText}>Verifying...</Text>
                            </>
                          ) : (
                            <Text style={styles.buttonTextLarge}>Verify & Continue</Text>
                          )}
                        </View>
                      </View>
                    </Reanimated.View>
                  </TouchableOpacity>

                  {/* Resend Section */}
                  <View style={styles.resendSection}>
                    <Text style={styles.resendText}>Didn't receive the code?</Text>
                    <TouchableOpacity
                      onPress={handleResendOTP}
                      disabled={resendTimer > 0}
                      style={styles.resendButton}
                    >
                      <Text style={[
                        styles.resendButtonText,
                        resendTimer > 0 && styles.resendButtonDisabled
                      ]}>
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                </Reanimated.View>
              )}

            </Reanimated.View>

            {/* Bottom Help */}
            <Reanimated.View 
              entering={FadeIn.duration(600).delay(800)} 
              style={styles.helpSection}
            >
              <TouchableOpacity style={styles.helpContainer}>
                <Ionicons name="help-circle-outline" size={18} color="#6B7280" />
                <Text style={styles.helpText}>Need help? Contact support</Text>
              </TouchableOpacity>
            </Reanimated.View>

          </Reanimated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  formContainer: {
    padding: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  stepDot: {
    width: 32,
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    backgroundColor: '#f87171',
  },
  stepDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepDotCompleted: {
    backgroundColor: '#10B981',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    overflow: 'hidden',
  },
  phoneInputWrapperFocused: {
    backgroundColor: '#fef2f2',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  validationIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  errorSection: {
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
    flex: 1,
  },
  buttonSection: {
    marginBottom: 32,
  },
  primaryButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 50,
    backgroundColor: '#dc2626',
  },
  primaryButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonTextLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  securitySection: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 14,
    color: '#15803d',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
    borderRadius: 12,
  },
  otpSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  editText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  progressCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f87171',
    borderRadius: 2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 24,
  },
  otpInputWrapper: {
    flex: 1,
    position: 'relative',
  },
  otpInput: {
    height: 64,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  otpInputFilled: {
    backgroundColor: '#fef2f2',
  },
  otpInputFocused: {
    backgroundColor: '#fef2f2',
  },
  resendSection: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
  },
  resendButtonDisabled: {
    color: '#9ca3af',
  },
  helpSection: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: 'center',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});