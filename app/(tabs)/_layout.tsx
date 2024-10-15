import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Pressable } from 'react-native'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 4
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderWidth: 0,
          borderTopWidth: 0,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: 'hidden'
        },
        tabBarButton(props) {
          return <Pressable {...props} android_ripple={{ color: 'rgba(0, 0, 0, .0382)' }} />
        },
        headerTitleAlign: 'center'
        // tabBarLabelStyle: {
        // fontSize: 12,
        // marginBottom: 10,
        // },
        // tabBarIconStyle: {
        // marginTop: 10,
        // },
        // tabBarStyle: {
        //   height: 100, // 调整整个 Tab Bar 的高度
        // },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '开发',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
