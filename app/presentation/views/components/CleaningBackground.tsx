import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { 
  Rect, 
  Circle, 
  Defs, 
  RadialGradient, 
  Stop, 
  LinearGradient 
} from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CleaningBackgroundProps {
  width?: number;
  height?: number;
  style?: any;
}

const CleaningBackground: React.FC<CleaningBackgroundProps> = ({
  width = screenWidth,
  height = screenHeight,
  style,
}) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          {/* Gradiente de fondo principal con más azul */}
          <LinearGradient id="mainBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="25%" stopColor="#F8F9FA" />
            <Stop offset="60%" stopColor="#E3F2FD" />
            <Stop offset="85%" stopColor="#BBDEFB" />
            <Stop offset="100%" stopColor="#90CAF9" />
          </LinearGradient>
          
          {/* Gradiente para gotas grandes - más azul */}
          <RadialGradient id="largeDropGradient" cx="0.3" cy="0.3" r="0.8">
            <Stop offset="0%" stopColor="#1976D2" stopOpacity="0.35" />
            <Stop offset="50%" stopColor="#0D47A1" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#0D47A1" stopOpacity="0.18" />
          </RadialGradient>
          
          {/* Gradiente para gotas medianas - más azul */}
          <RadialGradient id="mediumDropGradient" cx="0.4" cy="0.2" r="0.7">
            <Stop offset="0%" stopColor="#2196F3" stopOpacity="0.28" />
            <Stop offset="70%" stopColor="#0D47A1" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#0D47A1" stopOpacity="0.15" />
          </RadialGradient>
          
          {/* Gradiente para gotas pequeñas - más azul */}
          <RadialGradient id="smallDropGradient" cx="0.5" cy="0.3" r="0.9">
            <Stop offset="0%" stopColor="#42A5F5" stopOpacity="0.22" />
            <Stop offset="80%" stopColor="#0D47A1" stopOpacity="0.16" />
            <Stop offset="100%" stopColor="#0D47A1" stopOpacity="0.12" />
          </RadialGradient>
          
          {/* Gradiente para micro gotas - más azul */}
          <RadialGradient id="microDropGradient" cx="0.5" cy="0.5" r="1">
            <Stop offset="0%" stopColor="#64B5F6" stopOpacity="0.18" />
            <Stop offset="100%" stopColor="#0D47A1" stopOpacity="0.12" />
          </RadialGradient>
        </Defs>
        
        {/* Fondo base con gradiente azul */}
        <Rect width={width} height={height} fill="url(#mainBgGradient)" />
        
        {/* Gotas grandes - más prominentes y azules */}
        <Circle cx={width * 0.2} cy={height * 0.15} r="50" fill="url(#largeDropGradient)" />
        <Circle cx={width * 0.8} cy={height * 0.25} r="45" fill="url(#largeDropGradient)" />
        <Circle cx={width * 0.9} cy={height * 0.6} r="48" fill="url(#largeDropGradient)" />
        <Circle cx={width * 0.15} cy={height * 0.7} r="42" fill="url(#largeDropGradient)" />
        <Circle cx={width * 0.6} cy={height * 0.85} r="38" fill="url(#largeDropGradient)" />
        
        {/* Gotas medianas con más presencia azul */}
        <Circle cx={width * 0.5} cy={height * 0.1} r="28" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.85} cy={height * 0.2} r="32" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.1} cy={height * 0.3} r="25" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.7} cy={height * 0.35} r="30" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.3} cy={height * 0.5} r="26" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.9} cy={height * 0.75} r="28" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.4} cy={height * 0.9} r="24" fill="url(#mediumDropGradient)" />
        <Circle cx={width * 0.65} cy={height * 0.45} r="22" fill="url(#mediumDropGradient)" />
        
        {/* Gotas pequeñas con más color azul */}
        <Circle cx={width * 0.35} cy={height * 0.08} r="12" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.65} cy={height * 0.14} r="15" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.05} cy={height * 0.22} r="13" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.95} cy={height * 0.35} r="11" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.45} cy={height * 0.4} r="14" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.25} cy={height * 0.45} r="12" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.75} cy={height * 0.52} r="16" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.08} cy={height * 0.58} r="10" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.55} cy={height * 0.68} r="13" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.88} cy={height * 0.82} r="11" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.2} cy={height * 0.88} r="14" fill="url(#smallDropGradient)" />
        <Circle cx={width * 0.6} cy={height * 0.95} r="9" fill="url(#smallDropGradient)" />
        
        {/* Micro gotas para textura con más azul */}
        <Circle cx={width * 0.3} cy={height * 0.12} r="5" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.7} cy={height * 0.18} r="6" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.18} cy={height * 0.28} r="4" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.82} cy={height * 0.38} r="5" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.4} cy={height * 0.48} r="6" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.78} cy={height * 0.58} r="4" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.12} cy={height * 0.65} r="5" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.58} cy={height * 0.78} r="6" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.25} cy={height * 0.82} r="4" fill="url(#microDropGradient)" />
        <Circle cx={width * 0.85} cy={height * 0.92} r="5" fill="url(#microDropGradient)" />
        
        {/* Gotas adicionales con colores muy claros */}
        <Circle cx={width * 0.6} cy={height * 0.05} r="8" fill="#E3F2FD" fillOpacity="0.08" />
        <Circle cx={width * 0.92} cy={height * 0.12} r="6" fill="#F5F5F5" fillOpacity="0.07" />
        <Circle cx={width * 0.05} cy={height * 0.4} r="7" fill="#E8F5E8" fillOpacity="0.08" />
        <Circle cx={width * 0.48} cy={height * 0.62} r="9" fill="#E3F2FD" fillOpacity="0.07" />
        <Circle cx={width * 0.72} cy={height * 0.72} r="6" fill="#FAFAFA" fillOpacity="0.08" />
        <Circle cx={width * 0.15} cy={height * 0.95} r="7" fill="#E8F5E8" fillOpacity="0.07" />
        <Circle cx={width * 0.38} cy={height * 0.28} r="5" fill="#F5F5F5" fillOpacity="0.06" />
        <Circle cx={width * 0.78} cy={height * 0.42} r="8" fill="#E3F2FD" fillOpacity="0.08" />
        <Circle cx={width * 0.22} cy={height * 0.65} r="6" fill="#E8F5E8" fillOpacity="0.07" />
        <Circle cx={width * 0.68} cy={height * 0.78} r="7" fill="#FAFAFA" fillOpacity="0.07" />
        
        {/* Elementos decorativos casi blancos */}
        <Circle cx={width * 0.12} cy={height * 0.12} r="3" fill="#F5F5F5" fillOpacity="0.06" />
        <Circle cx={width * 0.88} cy={height * 0.18} r="4" fill="#FAFAFA" fillOpacity="0.05" />
        <Circle cx={width * 0.25} cy={height * 0.35} r="3" fill="#E8F5E8" fillOpacity="0.05" />
        <Circle cx={width * 0.75} cy={height * 0.55} r="4" fill="#E3F2FD" fillOpacity="0.06" />
        <Circle cx={width * 0.35} cy={height * 0.75} r="3" fill="#F5F5F5" fillOpacity="0.05" />
        <Circle cx={width * 0.85} cy={height * 0.88} r="4" fill="#FAFAFA" fillOpacity="0.05" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default CleaningBackground;