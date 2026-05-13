import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  videoId: string; // p. ej. "399973319"
  h?: string; // hash del embed, p. ej. "5db959b2dc"
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
};

export const VimeoWebView: React.FC<Props> = ({
  videoId = '323783503',
  h,
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
}) => {
  const [blocked, setBlocked] = useState(false);

  const params = useMemo(() => {
    // Si prefieres evitar URLSearchParams en RN, puedes armar la string manual
    return [
      //`h=${encodeURIComponent(h)}`,
      `autoplay=${autoplay ? 1 : 0}`,
      `loop=${loop ? 1 : 0}`,
      `muted=${muted ? 1 : 0}`,
      `controls=${controls ? 1 : 0}`,
      `playsinline=1`,
      `dnt=1`,
      `app_id=react-native`,
    ].join('&');
  }, [h, autoplay, loop, muted, controls]);

  const src = `https://player.vimeo.com/video/${videoId}?${params}`;

  if (blocked) {
    // Fallback simple si el WebView intenta abrir about:srcdoc / políticas del dueño bloquean el embed
    return (
      <View
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Text
          style={{ color: '#888', textAlign: 'center', paddingHorizontal: 12 }}
        >
          Este video no permite reproducción embebida en apps o la conexión no
          pudo validarse.
        </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(`https://vimeo.com/${videoId}`).catch(() => {})
          }
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: '#1f2937',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white' }}>Abrir en Vimeo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ width: '100%', aspectRatio: 16 / 9 }}>
      <WebView
        source={{ uri: src }}
        // ✅ claves para iOS / RN
        allowsFullscreenVideo
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        scrollEnabled={false}
        // ✅ Bloquea about:srcdoc / about:blank (el warning que te salió)
        onShouldStartLoadWithRequest={req => {
          const url = req.url || '';
          if (url.startsWith('about:')) {
            setBlocked(true);
            return false;
          }
          return true;
        }}
        // ✅ Si algo falla (política de dominio/hash), mostramos fallback
        onError={() => setBlocked(true)}
      />
    </View>
  );
};
