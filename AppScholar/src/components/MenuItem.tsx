import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuItemStyle } from '../styles/MenuItemStyle';

interface MenuItemProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ 
  title, 
  description, 
  iconName, 
  iconColor, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={MenuItemStyle.card} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <View style={[MenuItemStyle.iconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={iconName} size={26} color={iconColor} />
      </View>
      
      <View style={MenuItemStyle.content}>
        <Text style={MenuItemStyle.title}>{title}</Text>
        <Text style={MenuItemStyle.description}>{description}</Text>
      </View>

      <Text style={MenuItemStyle.arrow}>›</Text>
    </TouchableOpacity>
  );
};

