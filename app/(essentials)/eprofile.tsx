import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  
  // User data state
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    birthDate: '1990-05-15',
    gender: 'male',
    address: '123 Mining Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States',
    bio: 'Professional cryptocurrency miner with 5+ years of experience. Specializing in Bitcoin and Ethereum mining operations.',
    company: 'MiningPros Inc.',
    jobTitle: 'Senior Mining Engineer',
    website: 'www.johndoe-mining.com',
    isTwoFactorEnabled: true,
    emailNotifications: true,
    marketingEmails: false,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleSaveChanges = () => {
    Alert.alert(
      'Profile Updated',
      'Your profile information has been successfully updated.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderAvatar = () => {
    if (profileImage) {
      return (
        <Image source={{ uri: profileImage }} style={styles.avatarImage} />
      );
    }
    
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Profile</Text>
        
        <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Picture Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <View style={styles.profilePictureContainer}>
            {renderAvatar()}
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={20} color="#FFC000" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.removePhotoButton}
              onPress={() => setProfileImage(null)}
            >
              <Text style={styles.removePhotoText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={userData.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              placeholder="Enter first name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={userData.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              placeholder="Enter last name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={userData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="call-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={userData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity style={styles.datePicker}>
              <Ionicons name="calendar-outline" size={20} color="#8E8E93" />
              <Text style={styles.dateText}>{userData.birthDate}</Text>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    userData.gender === gender && styles.genderOptionActive
                  ]}
                  onPress={() => handleInputChange('gender', gender)}
                >
                  <Text style={[
                    styles.genderOptionText,
                    userData.gender === gender && styles.genderOptionTextActive
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address</Text>
            <TextInput
              style={styles.input}
              value={userData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter street address"
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={userData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="City"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>State/Province</Text>
              <TextInput
                style={styles.input}
                value={userData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholder="State"
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>ZIP/Postal Code</Text>
              <TextInput
                style={styles.input}
                value={userData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                placeholder="ZIP Code"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Country</Text>
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.countryText}>{userData.country}</Text>
                <Ionicons name="chevron-down" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={userData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{userData.bio.length}/250</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              style={styles.input}
              value={userData.company}
              onChangeText={(value) => handleInputChange('company', value)}
              placeholder="Company name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Job Title</Text>
            <TextInput
              style={styles.input}
              value={userData.jobTitle}
              onChangeText={(value) => handleInputChange('jobTitle', value)}
              placeholder="Your job title"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Website</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="globe-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={userData.website}
                onChangeText={(value) => handleInputChange('website', value)}
                placeholder="Your website URL"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>Add extra security to your account</Text>
              </View>
            </View>
            <Switch
              value={userData.isTwoFactorEnabled}
              onValueChange={(value) => handleInputChange('isTwoFactorEnabled', value)}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive important updates</Text>
              </View>
            </View>
            <Switch
              value={userData.emailNotifications}
              onValueChange={(value) => handleInputChange('emailNotifications', value)}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="megaphone-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Marketing Emails</Text>
                <Text style={styles.settingDescription}>Receive promotional content</Text>
              </View>
            </View>
            <Switch
              value={userData.marketingEmails}
              onValueChange={(value) => handleInputChange('marketingEmails', value)}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="key-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" style={styles.actionButtonIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text-outline" size={20} color="#FF9500" />
            <Text style={styles.actionButtonText}>Download My Data</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" style={styles.actionButtonIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" style={styles.actionButtonIcon} />
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  profilePictureContainer: {
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFC000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  removePhotoButton: {
    paddingVertical: 8,
  },
  removePhotoText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
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
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 48,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dateText: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
    marginLeft: 12,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  genderOptionActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFC000',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  genderOptionTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  countryText: {
    fontSize: 16,
    color: '#212529',
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
  actionButtonIcon: {
    marginLeft: 'auto',
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteButtonText: {
    color: '#FF3B30',
  },
  bottomSpacer: {
    height: 30,
  },
});