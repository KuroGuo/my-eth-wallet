import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

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
