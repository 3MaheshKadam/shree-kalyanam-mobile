// import React, { useEffect, useRef } from 'react';
// import { View, Animated, Image, Text, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as SplashScreen from 'expo-splash-screen';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // Prevent the native splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// const CustomSplashScreen = ({ onFinish }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const insets = useSafeAreaInsets();

//   useEffect(() => {
//     // Start animations
//     const fadeIn = Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     });

//     const scaleUp = Animated.spring(scaleAnim, {
//       toValue: 1,
//       friction: 6,
//       tension: 40,
//       useNativeDriver: true,
//     });

//     const pulse = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     Animated.parallel([fadeIn, scaleUp]).start(() => {
//       // After animations, wait a moment and hide the splash screen
//       setTimeout(async () => {
//         await SplashScreen.hideAsync();
//         onFinish(); // Notify parent component to proceed
//       }, 1000); // Delay for a smooth transition
//     });

//     pulse.start();

//     return () => {
//       pulse.stop();
//     };
//   }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

//   return (
//     <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//       <LinearGradient
//         colors={['#E91E63', '#C2185B', '#F06292']}
//         style={styles.background}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       >
//         <Animated.View
//           style={[
//             styles.logoContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ scale: pulseAnim }],
//             },
//           ]}
//         >
//           <Image
//             source={require('../assets/logo.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </Animated.View>
//         <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
//           <Text style={styles.text}>Shivbandhan</Text>
//         </Animated.View>
//         <View style={styles.dotsContainer}>
//           <View style={[styles.dot, { backgroundColor: '#F06292' }]} />
//           <View style={[styles.dot, { backgroundColor: '#F8A1B9' }]} />
//           <View style={[styles.dot, { backgroundColor: '#FFFFFF' }]} />
//         </View>
//       </LinearGradient>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 10,
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
//   text: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     position: 'absolute',
//     bottom: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
// });

// export default CustomSplashScreen;
import React, { useEffect, useRef } from 'react';
import { View, Animated, Image, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const CustomSplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Start animations
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const scaleUp = Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    });

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel([fadeIn, scaleUp]).start(() => {
      // After animations, wait a moment and hide the splash screen
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        onFinish(); // Notify parent component to proceed
      }, 1000); // Delay for a smooth transition
    });

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#f87171', '#dc2626', '#ef4444']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
          <Text style={styles.text}>Shree Kalyanam</Text>
        </Animated.View>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: '#fca5a5' }]} />
          <View style={[styles.dot, { backgroundColor: '#fecaca' }]} />
          <View style={[styles.dot, { backgroundColor: '#FFFFFF' }]} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default CustomSplashScreen;