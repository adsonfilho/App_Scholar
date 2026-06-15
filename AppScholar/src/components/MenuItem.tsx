import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItemStyle } from '../styles/MenuItemStyle';

interface MenuItemProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
  badge?: boolean; 
}

export const MenuItem: React.FC<MenuItemProps> = ({ 
  title, 
  description, 
  iconName, 
  iconColor, 
  onPress,
  badge = false
}) => {
  return (
    <TouchableOpacity 
      style={MenuItemStyle.card} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <View style={{ position: 'relative' }}>
        <View style={[MenuItemStyle.iconContainer, { backgroundColor: iconColor + '15' }]}>
          <Ionicons name={iconName} size={26} color={iconColor} />
        </View>
        
        {badge && <View style={styles.redDot} />}
      </View>
      
      <View style={MenuItemStyle.content}>
        <Text style={MenuItemStyle.title}>{title}</Text>
        <Text style={MenuItemStyle.description}>{description}</Text>
      </View>

      <Text style={MenuItemStyle.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30', 
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  }
});