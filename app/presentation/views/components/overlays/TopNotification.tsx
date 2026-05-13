import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NotificationCustom } from '../NotificationCustom';

type typeNotif = 'error' | 'success';

export type TopNotificationHandle = {
  show: (text: string, type: typeNotif, duration?: number) => void;
  hide: () => void;
};

const TopNotification = forwardRef<TopNotificationHandle, {}>((_, ref) => {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<typeNotif>('success');
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const hide = () => {
    clearTimer();
    Animated.timing(translateY, {
      toValue: -120,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const show = (msg: string, type: typeNotif, duration = 3000) => {
    clearTimer();
    setText(msg);
    setType(type);
    setVisible(true);
    translateY.setValue(-120);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      timerRef.current = setTimeout(hide, duration);
    });
  };

  useImperativeHandle(ref, () => ({ show, hide }), []);
  useEffect(() => () => clearTimer(), []);

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.host,
          {
            paddingTop: insets.top + 8,
            transform: [{ translateY }],
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.inner}>
          <NotificationCustom text={text} type={type} />
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  inner: {
    width: '100%',
    paddingHorizontal: 12,
  },
});

export default TopNotification;
