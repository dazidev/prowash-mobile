import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface BubbleProps {
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

interface BubbleData extends BubbleProps {
  id: number;
}

const AnimatedBubble = memo(
  ({ size, left, top, delay, duration }: BubbleProps) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0)).current;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      let isMounted = true;

      const animateBubble = () => {
        if (!isMounted) return;

        translateY.setValue(0);
        opacity.setValue(0);
        scale.setValue(0);

        animationRef.current = Animated.sequence([
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
        ]);

        animationRef.current.start(() => {
          if (!isMounted) return;

          timeoutRef.current = setTimeout(animateBubble, Math.random() * 2000);
        });
      };

      timeoutRef.current = setTimeout(animateBubble, delay);

      return () => {
        isMounted = false;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        animationRef.current?.stop();
      };
    }, [delay, duration, opacity, scale, translateY]);

    return (
      <Animated.View
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            left,
            top,
            transform: [{ translateY }, { scale }],
            opacity,
          },
        ]}
      />
    );
  },
);

const BackgroundBubbles = () => {
  const bubbles = useRef<BubbleData[]>(
    Array.from({ length: 15 }, (_, index) => ({
      id: index,
      size: Math.random() * 60 + 20,
      left: Math.random() * (width - 80),
      top: height * 0.3 + Math.random() * (height * 0.7),
      delay: Math.random() * 3000,
      duration: 3000 + Math.random() * 4000,
    })),
  ).current;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.backgroundGradient} />

      {bubbles.map(bubble => (
        <AnimatedBubble
          key={bubble.id}
          size={bubble.size}
          left={bubble.left}
          top={bubble.top}
          delay={bubble.delay}
          duration={bubble.duration}
        />
      ))}

      <View style={[styles.staticBubble, styles.staticBubble1]} />
      <View style={[styles.staticBubble, styles.staticBubble2]} />
      <View style={[styles.staticBubble, styles.staticBubble3]} />
      <View style={[styles.staticBubble, styles.staticBubble4]} />
      <View style={[styles.staticBubble, styles.staticBubble5]} />
      <View style={[styles.staticBubble, styles.staticBubble6]} />
      <View style={[styles.staticBubble, styles.staticBubble7]} />
      <View style={[styles.staticBubble, styles.staticBubble8]} />

      <View style={styles.overlay} />
    </View>
  );
};

export default memo(BackgroundBubbles);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D47A1',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(135, 206, 250, 0.4)',
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 71, 161, 0.1)',
  },
});
