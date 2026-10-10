import React, { useState } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { parseVimeoVideo } from '../../../../domain/utils/parseVimeoVideo';

type Props = {
  videoId: string;
  h?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

export const VimeoWebView = ({
  videoId,
  h,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}: Props) => {
  const video = parseVimeoVideo(videoId, h);

  if (!video) {
    return <Text style={styles.message}>Invalid Vimeo ID or URL.</Text>;
  }

  const params = [
    `autoplay=${autoplay ? 1 : 0}`,
    `loop=${loop ? 1 : 0}`,
    `muted=${muted ? 1 : 0}`,
    `controls=${controls ? 1 : 0}`,
    'playsinline=1',
    'dnt=1',
  ].join('&');

  const src = `${video.embedUrl}${video.hash ? '&' : '?'}${params}`;

  return (
    <VimeoContent
      key={src}
      src={src}
      watchUrl={video.watchUrl}
      autoplay={autoplay}
    />
  );
};

const VimeoContent = ({
  src,
  watchUrl,
  autoplay,
}: {
  src: string;
  watchUrl: string;
  autoplay: boolean;
}) => {
  const [failed, setFailed] = useState(false);

  const openVimeo = () => {
    Linking.openURL(watchUrl).catch(() => {
      Alert.alert('Unable to open Vimeo', 'Please try again.');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.player}>
        {failed ? (
          <View style={styles.error}>
            <Text style={styles.message}>Unable to load this video.</Text>

            <TouchableOpacity
              onPress={() => setFailed(false)}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ uri: src }}
            originWhitelist={['https://*', 'about:*']}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            javaScriptEnabled
            domStorageEnabled
            mediaPlaybackRequiresUserAction={!autoplay}
            setSupportMultipleWindows={false}
            scrollEnabled={false}
            onShouldStartLoadWithRequest={request => {
              const url = request.url ?? '';

              if (request.isTopFrame === false) return true;
              if (/^about:(blank|srcdoc)([?#]|$)/.test(url)) return true;

              return /^https:\/\/player\.vimeo\.com(?:\/|$)/i.test(url);
            }}
            onError={({ nativeEvent }) => {
              if (!nativeEvent.url || nativeEvent.url === src) {
                setFailed(true);
              }
            }}
            onHttpError={({ nativeEvent }) => {
              if (nativeEvent.url === src && nativeEvent.statusCode >= 400) {
                setFailed(true);
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity onPress={openVimeo} accessibilityRole="link">
        <Text style={styles.link}>Open in Vimeo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  player: { width: '100%', aspectRatio: 16 / 9 },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  message: {
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  retry: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#1f2937',
    borderRadius: 8,
  },
  retryText: { color: 'white' },
  link: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
