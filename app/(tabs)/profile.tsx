import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const userInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2024',
    miningLevel: 'Advanced Miner',
    memberSince: 'Member since January 2024',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Information Card - Clean */}
        <View style={styles.profileCard}>
          <View style={styles.profileCompact}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
            </View>
            
            <View style={styles.profileInfoCompact}>
              <Text style={styles.profileName}>{userInfo.name}</Text>
              <Text style={styles.profileLevel}>{userInfo.miningLevel}</Text>
              <Text style={styles.profileEmail}>{userInfo.email}</Text>
              <Text style={styles.profileDetail}>{userInfo.phone}</Text>
              <Text style={styles.memberSince}>{userInfo.memberSince}</Text>
            </View>

            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="create-outline" size={18} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#007AFF20' }]}>
                  <Ionicons name="person-outline" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#34C75920' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#34C759" />
                </View>
                <Text style={styles.menuItemText}>Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#5856D620' }]}>
                  <Ionicons name="wallet-outline" size={20} color="#5856D6" />
                </View>
                <Text style={styles.menuItemText}>Wallet Manager</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mining Operations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mining Operations</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FF950020' }]}>
                  <Ionicons name="cart-outline" size={20} color="#FF9500" />
                </View>
                <Text style={styles.menuItemText}>Orders</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuBadge}>12</Text>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FF2D5520' }]}>
                  <Ionicons name="build-outline" size={20} color="#FF2D55" />
                </View>
                <Text style={styles.menuItemText}>Repairs</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuBadge}>3</Text>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#32D74B20' }]}>
                  <Ionicons name="people-outline" size={20} color="#32D74B" />
                </View>
                <Text style={styles.menuItemText}>Referrals</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuBadge}>8</Text>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuList}>
            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#007AFF20' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={setIsNotificationsEnabled}
                trackColor={{ false: '#F2F2F7', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#4A4A4A20' }]}>
                  <Ionicons name="moon-outline" size={20} color="#4A4A4A" />
                </View>
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkModeEnabled}
                onValueChange={setIsDarkModeEnabled}
                trackColor={{ false: '#F2F2F7', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#5856D620' }]}>
                  <Ionicons name="settings-outline" size={20} color="#5856D6" />
                </View>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#32D74B20' }]}>
                  <Ionicons name="headset-outline" size={20} color="#32D74B" />
                </View>
                <Text style={styles.menuItemText}>Customer Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#BF5AF220' }]}>
                  <Ionicons name="document-text-outline" size={20} color="#BF5AF2" />
                </View>
                <Text style={styles.menuItemText}>Terms & Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutSection}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIcon, { backgroundColor: '#FF453A20' }]}>
              <Ionicons name="log-out-outline" size={20} color="#FF453A" />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Oneminers v1.2.4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Profile Card - Clean without stats
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  profileCompact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfoCompact: {
    flex: 1,
    marginRight: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  profileLevel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 2,
    opacity: 0.8,
  },
  profileDetail: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 13,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
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
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  // Logout Section
  logoutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    color: '#FF3B30',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 13,
    color: '#8E8E93',
  },
});