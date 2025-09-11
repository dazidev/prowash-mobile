import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BubbleProps {
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

const AnimatedBubble: React.FC<BubbleProps> = ({ size, left, top, delay, duration }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateBubble = () => {
      // Reset values
      translateY.setValue(0);
      opacity.setValue(0);
      scale.setValue(0);

      // Start animations
      Animated.sequence([
        // Fade in and scale up
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            delay,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]),
        // Float up and fade out
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -height * 0.3,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: duration * 0.7,
            delay: duration * 0.3,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Restart animation
        setTimeout(animateBubble, Math.random() * 2000);
      });
    };

    const timeout = setTimeout(animateBubble, delay);
    return () => clearTimeout(timeout);
  }, [translateY, opacity, scale, delay, duration]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          left,
          top,
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

const BackgroundBubbles: React.FC = () => {
  // Generar burbujas con posiciones y tamaños aleatorios
  const bubbles = Array.from({ length: 15 }, (_, index) => ({
    id: index,
    size: Math.random() * 60 + 20, // Entre 20 y 80
    left: Math.random() * (width - 80),
    top: height * 0.3 + Math.random() * (height * 0.7),
    delay: Math.random() * 3000,
    duration: 3000 + Math.random() * 4000, // Entre 3 y 7 segundos
  }));

  return (
    <View style={styles.container}>
      {/* Fondo con gradiente azul */}
      <View style={styles.backgroundGradient} />
      
      {/* Burbujas animadas */}
      {bubbles.map((bubble) => (
        <AnimatedBubble
          key={bubble.id}
          size={bubble.size}
          left={bubble.left}
          top={bubble.top}
          delay={bubble.delay}
          duration={bubble.duration}
        />
      ))}

      {/* Burbujas estáticas adicionales para más densidad */}
      <View style={[styles.staticBubble, styles.staticBubble1]} />
      <View style={[styles.staticBubble, styles.staticBubble2]} />
      <View style={[styles.staticBubble, styles.staticBubble3]} />
      <View style={[styles.staticBubble, styles.staticBubble4]} />
      <View style={[styles.staticBubble, styles.staticBubble5]} />
      <View style={[styles.staticBubble, styles.staticBubble6]} />
      <View style={[styles.staticBubble, styles.staticBubble7]} />
      <View style={[styles.staticBubble, styles.staticBubble8]} />

      {/* Overlay sutil para mejorar la legibilidad */}
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D47A1', // Azul profundo base
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(135, 206, 250, 0.4)', // Azul claro semi-transparente
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  staticBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(135, 206, 250, 0.2)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  staticBubble1: {
    width: 40,
    height: 40,
    top: height * 0.1,
    left: width * 0.1,
  },
  staticBubble2: {
    width: 60,
    height: 60,
    top: height * 0.15,
    left: width * 0.8,
  },
  staticBubble3: {
    width: 30,
    height: 30,
    top: height * 0.25,
    left: width * 0.6,
  },
  staticBubble4: {
    width: 80,
    height: 80,
    top: height * 0.05,
    left: width * 0.4,
  },
  staticBubble5: {
    width: 25,
    height: 25,
    top: height * 0.3,
    left: width * 0.2,
  },
  staticBubble6: {
    width: 50,
    height: 50,
    top: height * 0.2,
    left: width * 0.9,
  },
  staticBubble7: {
    width: 35,
    height: 35,
    top: height * 0.08,
    left: width * 0.7,
  },
  staticBubble8: {
    width: 45,
    height: 45,
    top: height * 0.12,
    left: width * 0.05,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13, 71, 161, 0.1)', // Overlay azul muy sutil
  },
});

export default BackgroundBubbles;