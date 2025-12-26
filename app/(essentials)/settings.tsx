import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    autoUpdate: true,
    saveLogin: true,
    dataSaver: false,
    clearCache: false,
    analytics: true,
    crashReports: true,
    language: 'English',
    currency: 'USD',
    region: 'United States',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleToggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof settings]
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove temporary files and free up storage space. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setSettings(prev => ({ ...prev, clearCache: true }));
            Alert.alert('Success', 'Cache cleared successfully.');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              autoUpdate: true,
              saveLogin: true,
              dataSaver: false,
              clearCache: false,
              analytics: true,
              crashReports: true,
              language: 'English',
              currency: 'USD',
              region: 'United States',
            });
            Alert.alert('Success', 'Settings reset to default.');
          }
        }
      ]
    );
  };

  const appSettings = [
    {
      id: 'general',
      title: 'General',
      items: [
        { id: 'language', title: 'Language', value: settings.language, icon: 'language', color: '#007AFF' },
        { id: 'currency', title: 'Currency', value: settings.currency, icon: 'cash', color: '#FFC000' },
        { id: 'region', title: 'Region', value: settings.region, icon: 'earth', color: '#34C759' },
      ]
    },
    {
      id: 'app',
      title: 'App Settings',
      items: [
        { id: 'autoUpdate', title: 'Auto Update', value: settings.autoUpdate, icon: 'cloud-download', color: '#5856D6' },
        { id: 'saveLogin', title: 'Save Login', value: settings.saveLogin, icon: 'key', color: '#FF9500' },
        { id: 'dataSaver', title: 'Data Saver', value: settings.dataSaver, icon: 'cellular', color: '#32D74B' },
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy',
      items: [
        { id: 'analytics', title: 'Analytics', value: settings.analytics, icon: 'analytics', color: '#BF5AF2' },
        { id: 'crashReports', title: 'Crash Reports', value: settings.crashReports, icon: 'bug', color: '#FF453A' },
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Info */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIcon}>
            <Ionicons name="cube" size={32} color="#FFC000" />
          </View>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>Oneminers</Text>
            <Text style={styles.appVersion}>Version 1.2.4 (Build 124)</Text>
            <Text style={styles.appSubtext}>Mining Equipment Marketplace</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {appSettings.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <View style={styles.menuList}>
              {section.items.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  
                  {typeof item.value === 'boolean' ? (
                    <Switch
                      value={item.value}
                      onValueChange={() => handleToggleSetting(item.id)}
                      trackColor={{ false: '#F2F2F7', true: item.color }}
                      thumbColor="#FFFFFF"
                    />
                  ) : (
                    <View style={styles.menuItemRight}>
                      <Text style={styles.menuItemValue}>{item.value}</Text>
                      <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          
          <View style={styles.storageInfo}>
            <View style={styles.storageProgress}>
              <View style={[styles.storageBar, { width: '35%' }]} />
            </View>
            <Text style={styles.storageText}>2.1 GB of 6 GB used</Text>
          </View>
          
          <TouchableOpacity style={styles.clearCacheButton} onPress={handleClearCache}>
            <Ionicons name="trash-outline" size={20} color="#FFC000" />
            <Text style={styles.clearCacheText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="notifications-outline" size={22} color="#FFC000" />
              <Text style={styles.preferenceText}>Notification Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="text-outline" size={22} color="#FFC000" />
              <Text style={styles.preferenceText}>Font Size</Text>
            </View>
            <Text style={styles.preferenceValue}>Medium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="contrast-outline" size={22} color="#FFC000" />
              <Text style={styles.preferenceText}>Theme</Text>
            </View>
            <Text style={styles.preferenceValue}>Light</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Ionicons name="download-outline" size={22} color="#FFC000" />
              <Text style={styles.preferenceText}>Download Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>Rate Oneminers</Text>
            <Ionicons name="star-outline" size={18} color="#FFC000" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>Share App</Text>
            <Ionicons name="share-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>What's New</Text>
            <Ionicons name="sparkles" size={18} color="#5856D6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutText}>Help & Feedback</Text>
            <Ionicons name="help-circle-outline" size={18} color="#34C759" />
          </TouchableOpacity>
        </View>

        {/* Reset Settings */}
        <TouchableOpacity style={styles.resetSection} onPress={handleResetSettings}>
          <Ionicons name="refresh" size={20} color="#FF9500" />
          <Text style={styles.resetText}>Reset All Settings</Text>
        </TouchableOpacity>

        {/* Developer Info */}
        <View style={styles.developerSection}>
          <Text style={styles.developerTitle}>Developer Information</Text>
          <Text style={styles.developerText}>Oneminers Technologies Inc.</Text>
          <Text style={styles.developerText}>© 2024 All rights reserved</Text>
          <Text style={styles.developerSubtext}>Build: 124 • API: v2.1</Text>
        </View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  appInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  appSubtext: {
    fontSize: 14,
    color: '#6C757D',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  menuList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  storageInfo: {
    marginBottom: 20,
  },
  storageProgress: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  storageBar: {
    height: '100%',
    backgroundColor: '#FFC000',
    borderRadius: 4,
  },
  storageText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  clearCacheText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#8E8E93',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  aboutText: {
    fontSize: 16,
    color: '#000000',
  },
  resetSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
    marginLeft: 12,
  },
  developerSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  developerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  developerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  developerSubtext: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 8,
  },
  bottomSpacer: {
    height: 30,
  },
});