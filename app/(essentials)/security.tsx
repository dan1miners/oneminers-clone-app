import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SecurityScreen() {
  const router = useRouter();
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricLogin: true,
    autoLogout: true,
    autoLogoutMinutes: 15,
    sessionAlerts: true,
    loginAlerts: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    Alert.alert(
      'Password Changed',
      'Your password has been successfully updated.',
      [
        { text: 'OK', onPress: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }}
      ]
    );
  };

  const handleToggleSetting = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof securitySettings]
    }));
  };

  const handleAutoLogoutChange = (value: string) => {
    const minutes = parseInt(value) || 15;
    setSecuritySettings(prev => ({
      ...prev,
      autoLogoutMinutes: Math.min(Math.max(minutes, 1), 60)
    }));
  };

  const securityFeatures = [
    {
      id: 'twoFactor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: 'shield-checkmark',
      color: '#FFC000',
    },
    {
      id: 'biometric',
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID to log in',
      icon: 'finger-print-outline',
      color: '#34C759',
    },
    {
      id: 'session',
      title: 'Session Management',
      description: 'Manage active sessions and devices',
      icon: 'phone-portrait-sharp',
      color: '#007AFF',
    },
    {
      id: 'recovery',
      title: 'Account Recovery',
      description: 'Set up recovery options for your account',
      icon: 'key',
      color: '#5856D6',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Security</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Security Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <MaterialCommunityIcons name="shield-lock" size={24} color="#FFC000" />
            <Text style={styles.scoreTitle}>Security Score</Text>
          </View>
          <View style={styles.scoreProgress}>
            <View style={[styles.progressBar, { width: '85%' }]} />
          </View>
          <Text style={styles.scoreText}>85% - Excellent</Text>
          <Text style={styles.scoreSubtext}>Your account is well protected</Text>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              secureTextEntry
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
            <Text style={styles.passwordHint}>
              Use at least 8 characters with letters, numbers, and symbols
            </Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          
          {securityFeatures.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                <Ionicons name={feature.icon as any} size={22} color={feature.color} />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>
                  Requires a code from your authenticator app
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.twoFactorEnabled}
              onValueChange={() => handleToggleSetting('twoFactorEnabled')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint or face recognition
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.biometricLogin}
              onValueChange={() => handleToggleSetting('biometricLogin')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="timer-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Auto Logout</Text>
                <Text style={styles.settingDescription}>
                  Log out after inactivity
                </Text>
              </View>
            </View>
            <View style={styles.autoLogoutContainer}>
              <TextInput
                style={styles.autoLogoutInput}
                value={securitySettings.autoLogoutMinutes.toString()}
                onChangeText={handleAutoLogoutChange}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.autoLogoutLabel}>minutes</Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Login Alerts</Text>
                <Text style={styles.settingDescription}>
                  Get notified of new logins
                </Text>
              </View>
            </View>
            <Switch
              value={securitySettings.loginAlerts}
              onValueChange={() => handleToggleSetting('loginAlerts')}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          
          <View style={styles.sessionItem}>
            <View style={styles.sessionDevice}>
              <Ionicons name="phone-portrait" size={24} color="#FFC000" />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDeviceName}>iPhone 14 Pro</Text>
                <Text style={styles.sessionDetails}>San Francisco, USA • Current</Text>
                <Text style={styles.sessionTime}>Last active: Just now</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sessionAction}>
              <Text style={styles.sessionActionText}>Logout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sessionItem}>
            <View style={styles.sessionDevice}>
              <Ionicons name="laptop" size={24} color="#007AFF" />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDeviceName}>MacBook Pro</Text>
                <Text style={styles.sessionDetails}>San Jose, USA</Text>
                <Text style={styles.sessionTime}>Last active: 2 hours ago</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sessionAction}>
              <Text style={styles.sessionActionText}>Logout</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.viewAllSessions}>
            <Text style={styles.viewAllText}>View All Sessions</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Use a unique password for your Oneminers account
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Enable two-factor authentication for extra security
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Never share your password or 2FA codes with anyone
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Log out from shared or public computers
            </Text>
          </View>
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
    backgroundColor: '#F2F2F7',
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
  scoreCard: {
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
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 12,
  },
  scoreProgress: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC000',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 14,
    color: '#8E8E93',
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
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  passwordHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
  },
  changePasswordButton: {
    backgroundColor: '#FFC000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTexts: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  autoLogoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoLogoutInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    width: 40,
    textAlign: 'center',
    marginRight: 8,
  },
  autoLogoutLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  sessionDevice: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionDeviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  sessionDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  sessionAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  sessionActionText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  viewAllSessions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});