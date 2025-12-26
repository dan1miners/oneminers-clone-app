import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const features = [
  {
    id: '1',
    title: 'Real-Time Monitoring',
    description: 'Track miners in real-time, monitor hashrate, temperature, pool data, and mining performance at a glance',
    icon: 'stats-chart',
    details: [
      'Live miner status updates',
      'Hashrate performance tracking',
      'Temperature monitoring',
      'Pool connection analytics',
      'Performance alerts'
    ]
  },
  {
    id: '2',
    title: 'Wallet & Invoicing',
    description: 'Stay informed with real-time updates on balance, mining progress, and all invoices for electricity and fees',
    icon: 'wallet',
    details: [
      'Real-time balance tracking',
      'Automated invoicing',
      'Electricity cost monitoring',
      'Fee transparency',
      'Payment history'
    ]
  },
  {
    id: '3',
    title: 'AI Optimization',
    description: 'Our intelligent system selects the most profitable mining pools automatically based on real-time market data',
    icon: 'rocket',
    details: [
      'Automatic pool selection',
      'Profitability optimization',
      'Energy efficiency AI',
      'Market trend analysis',
      'Performance tuning'
    ]
  },
  {
    id: '4',
    title: 'Mobile Management',
    description: 'Manage your entire mining operation from anywhere with our dedicated mobile application',
    icon: 'phone-portrait',
    details: [
      'Full remote control',
      'Push notifications',
      'Mobile alerts',
      'On-the-go management',
      'Secure mobile access'
    ]
  },
  {
    id: '5',
    title: 'Marketplace',
    description: 'Set up custom or automated pricing for new miners and servers, tailored for both new and existing clients',
    icon: 'cart',
    details: [
      'Automated pricing strategies',
      'Client management tools',
      'Equipment marketplace',
      'Custom pricing plans',
      'Inventory management'
    ]
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: typeof features[0] }) => {
    return (
      <View className="items-center pt-5 pb-10" style={{ width: width - 40, marginHorizontal: 20 }}>
        <View className="w-[100px] h-[100px] rounded-full justify-center items-center bg-[#FFF9E6] mb-8">
          <Ionicons name={item.icon as any} size={70} color="#FFC000" />
        </View>
        
        <Text className="text-2xl font-bold text-black text-center mb-4 px-4">{item.title}</Text>
        <Text className="text-base text-gray-600 text-center leading-6 mb-8 px-5">{item.description}</Text>
        
        <View className="w-full mb-8 px-4">
          {item.details.map((detail, index) => (
            <View key={index} className="flex-row items-start mb-3">
              <View className="mr-3 mt-0.5">
                <Ionicons name="checkmark-circle" size={20} color="#FFC000" />
              </View>
              <Text className="text-sm text-gray-700 flex-1 leading-5">{detail}</Text>
            </View>
          ))}
        </View>
        
        <View className="flex-row justify-around w-full px-4 mt-2">
          <View className="items-center flex-1">
            <Ionicons name="analytics" size={20} color="#FFC000" />
            <Text className="text-xs font-semibold text-gray-500 mt-1.5">Real-time</Text>
          </View>
          <View className="items-center flex-1">
            <Ionicons name="flash" size={20} color="#FFC000" />
            <Text className="text-xs font-semibold text-gray-500 mt-1.5">Optimized</Text>
          </View>
          <View className="items-center flex-1">
            <Ionicons name="hardware-chip" size={20} color="#FFC000" />
            <Text className="text-xs font-semibold text-gray-500 mt-1.5">Efficient</Text>
          </View>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View className="flex-row justify-center items-center h-10 mb-5">
        {features.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          
          const dotColor = scrollX.interpolate({
            inputRange: [(i - 0.5) * width, i * width, (i + 0.5) * width],
            outputRange: ['#D1D5DB', '#FFC000', '#D1D5DB'],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={i}
              className="h-2 rounded mx-1"
              style={{
                width: dotWidth,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Handle completion - navigate to main app
      console.log('Onboarding completed');
      // navigation.navigate('Main');
      router.replace('/(auth)/login');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <View className="px-6 pt-3 pb-3 items-center">
        <View className="flex-row items-center justify-center">
          <Text className="text-[32px] font-bold text-[#FFC000]" style={{ textTransform: 'lowercase' }}>one</Text>
          <Text className="text-[32px] font-bold text-black" style={{ textTransform: 'lowercase' }}>miners</Text>
        </View>
        <Text className="text-sm text-gray-500 text-center mt-1" style={{ textTransform: 'lowercase' }}>professional mining management</Text>
      </View>

      <View className="flex-1 justify-between">
        <FlatList
          ref={flatListRef}
          data={features}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <Pagination />
      </View>

      <View className="flex-row justify-between items-center px-6 pb-[30px] pt-2.5 border-t border-gray-200">
        {currentIndex > 0 && (
          <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-gray-100 justify-center items-center opacity-80" onPress={handlePrev}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
        )}
        
        {!currentIndex && <View className="w-[50px]" />}
        
        <View className="items-center">
          <Text className="text-lg font-bold text-black">
            {currentIndex + 1}<Text className="text-sm font-normal text-gray-500">/{features.length}</Text>
          </Text>
        </View>
        
        <TouchableOpacity className="w-[50px] h-[50px] rounded-full bg-[#FFC000] justify-center items-center" onPress={handleNext}>
          <Ionicons 
            name={currentIndex === features.length - 1 ? "checkmark" : "chevron-forward"} 
            size={24} 
            color="#000000" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
