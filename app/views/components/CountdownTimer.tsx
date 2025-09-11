import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const CountdownTimer = ({ initialSeconds = 120, onFinish }: { initialSeconds: number, onFinish?: () => void }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinish?.()
      return
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  // Formatear a MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const secsRemaining = secs % 60
    return `${String(mins).padStart(2, '0')}:${String(secsRemaining).padStart(2, '0')}`
  };

  return (
    <View style={{opacity: secondsLeft > 0 ? 0.5 : 1}}>
      <Text style={styles.timerText}>
        {secondsLeft > 0 ? formatTime(secondsLeft) : "00:00"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    color: '#fff',
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default CountdownTimer;
