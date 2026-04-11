import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, Animated } from 'react-native';
import { StatusStyle } from '../styles/StatusStyle';

interface StatusMessageProps {
  message: string | null;
  type?: 'success' | 'error' | 'warning'; 
  onClose: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message, type = 'error', onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (message) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [message]);

  if (!message) return null;

  const backgroundStyle = type === 'success' 
    ? StatusStyle.success 
    : type === 'warning' ? StatusStyle.warning : StatusStyle.error;

  return (
    <Animated.View style={[StatusStyle.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity 
        style={[StatusStyle.content, backgroundStyle]} 
        onPress={onClose} 
        activeOpacity={0.9}
      >
        <Text style={StatusStyle.text}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};