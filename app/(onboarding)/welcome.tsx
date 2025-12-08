import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon as any} size={70} color="#FFC000" />
        </View>
        
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        
        <View style={styles.detailsContainer}>
          {item.details.map((detail, index) => (
            <View key={index} style={styles.detailRow}>
              <Ionicons name="checkmark-circle" size={20} color="#FFC000" style={styles.checkIcon} />
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="analytics" size={20} color="#FFC000" />
            <Text style={styles.statText}>Real-time</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={20} color="#FFC000" />
            <Text style={styles.statText}>Optimized</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="hardware-chip" size={20} color="#FFC000" />
            <Text style={styles.statText}>Efficient</Text>
          </View>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
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
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  backgroundColor: dotColor,
                }
              ]}
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandOne}>one</Text>
          <Text style={styles.brandMiners}>miners</Text>
        </View>
        <Text style={styles.headerSubtitle}>professional mining management</Text>
      </View>

      <View style={styles.contentWrapper}>
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
          contentContainerStyle={styles.listContent}
        />

        <Pagination />
      </View>

      <View style={styles.footer}>
        {currentIndex > 0 && (
          <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
        )}
        
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1}<Text style={styles.pageIndicatorTotal}>/{features.length}</Text>
          </Text>
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandOne: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFC000',
    textTransform: 'lowercase',
  },
  brandMiners: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textTransform: 'lowercase',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'lowercase',
    textAlign: 'center',
    marginTop: 4,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 20,
  },
  slide: {
    width: width - 40,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  prevButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFC000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageIndicatorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  pageIndicatorTotal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});