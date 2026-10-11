import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import type { AdItem } from '../../../../domain';
import { HomeScreenViewModel } from '../../../viewmodels/principal/HomeScreenViewModel';
import { colors } from '../../../theme/colors';
import CleaningBackground from '../../components/CleaningBackground';
import { AdvText } from '../../components/home/AdvText';
import { AdvImage } from '../../components/home/AdvImage';
import { AdvCarousel } from '../../components/home/AdvCarousel';
import { AdvVideo } from '../../components/home/AdvVideo';

export const HomeScreen = () => {
  const { getAdvertising } = HomeScreenViewModel();

  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeRef = useRef(false);
  const requestVersionRef = useRef(0);

  const loadAdvertising = useCallback(async () => {
    if (!activeRef.current) return;

    const requestVersion = ++requestVersionRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await getAdvertising();

      if (!activeRef.current || requestVersion !== requestVersionRef.current) {
        return;
      }

      if (!response.success || !Array.isArray(response.data)) {
        setError(response.message || 'Unable to load advertising.');
        return;
      }

      setAds(response.data);
    } catch {
      if (activeRef.current && requestVersion === requestVersionRef.current) {
        setError('Unable to load advertising. Please try again.');
      }
    } finally {
      if (activeRef.current && requestVersion === requestVersionRef.current) {
        setLoading(false);
      }
    }
  }, [getAdvertising]);

  useFocusEffect(
    useCallback(() => {
      activeRef.current = true;
      loadAdvertising();

      const subscription = AppState.addEventListener('change', nextState => {
        if (nextState === 'active') {
          loadAdvertising();
        }
      });

      return () => {
        activeRef.current = false;
        requestVersionRef.current += 1;
        subscription.remove();
      };
    }, [loadAdvertising]),
  );

  return (
    <>
      <CleaningBackground />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {loading && (
          <ActivityIndicator
            style={styles.loader}
            accessibilityLabel="Loading advertising"
          />
        )}

        {!loading && error && (
          <View style={styles.feedback}>
            <Text accessibilityRole="alert" style={styles.errorText}>
              {error}
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Retry loading advertising"
              style={styles.retryButton}
              onPress={() => {
                loadAdvertising();
              }}
            >
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && ads.length === 0 && (
          <Text style={styles.emptyText}>No advertisements available yet.</Text>
        )}

        {!loading &&
          !error &&
          ads.map(ad => {
            switch (ad.type) {
              case 'TEXT':
                return <AdvText key={ad.id} text={ad.text!} />;

              case 'IMAGE':
                return (
                  <AdvImage key={ad.id} text={ad.text!} image={ad.image1!} />
                );

              case 'IMAGE_CAROUSEL':
                const images = {
                  image1: ad.image1,
                  image2: ad.image2,
                  image3: ad.image3,
                  image4: ad.image4,
                  image5: ad.image5,
                };

                return (
                  <AdvCarousel key={ad.id} text={ad.text!} images={images} />
                );

              case 'VIDEO':
                return (
                  <AdvVideo key={ad.id} text={ad.text!} video={ad.video!} />
                );

              default:
                return null;
            }
          })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 60,
    alignContent: 'center',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loader: {
    paddingVertical: 24,
  },
  feedback: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.principalWhite,
    alignItems: 'center',
  },
  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.principalBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.principalWhite,
    fontWeight: '600',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#666666',
  },
});
