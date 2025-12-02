import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddAddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditMode = params.id ? true : false;
  const addressId = params.id as string;

  const [formData, setFormData] = useState({
    title: isEditMode ? 'Office' : '',
    firstName: isEditMode ? 'John' : '',
    lastName: isEditMode ? 'Doe' : '',
    company: isEditMode ? 'MiningPros Inc.' : '',
    address: isEditMode ? '456 Crypto Avenue' : '',
    apartment: isEditMode ? 'Suite 500' : '',
    city: isEditMode ? 'San Jose' : '',
    state: isEditMode ? 'CA' : '',
    zipCode: isEditMode ? '95113' : '',
    country: isEditMode ? 'United States' : '',
    phone: isEditMode ? '+1 (555) 987-6543' : '',
    isDefault: isEditMode ? false : false,
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSaveAddress = () => {
    // Validate required fields
    if (!formData.title || !formData.address || !formData.city || !formData.zipCode || !formData.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Success',
      isEditMode ? 'Address updated successfully!' : 'New address added successfully!',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Address' : 'Add New Address'}
        </Text>
        
        <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Address Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Type</Text>
          <View style={styles.addressTypeOptions}>
            {['Home', 'Office', 'Warehouse', 'Other'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.addressTypeOption,
                  formData.title === type && styles.addressTypeOptionActive
                ]}
                onPress={() => handleInputChange('title', type)}
              >
                <Text style={[
                  styles.addressTypeText,
                  formData.title === type && styles.addressTypeTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter first name"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter last name"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.company}
              onChangeText={(value) => handleInputChange('company', value)}
              placeholder="Enter company name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="call-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputWithPadding]}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Address Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="Enter street address"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Apartment, Suite, etc. (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.apartment}
              onChangeText={(value) => handleInputChange('apartment', value)}
              placeholder="Enter apartment or suite number"
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="Enter city"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>State/Province</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => handleInputChange('state', value)}
                placeholder="Enter state"
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>ZIP/Postal Code *</Text>
              <TextInput
                style={styles.input}
                value={formData.zipCode}
                onChangeText={(value) => handleInputChange('zipCode', value)}
                placeholder="Enter ZIP code"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Country *</Text>
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.countryText}>
                  {formData.country || 'Select country'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#C7C7CC" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Address Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="star" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Set as Default Address</Text>
                <Text style={styles.settingDescription}>
                  Use this address for all future orders
                </Text>
              </View>
            </View>
            <Switch
              value={formData.isDefault}
              onValueChange={(value) => handleInputChange('isDefault', value)}
              trackColor={{ false: '#F2F2F7', true: '#FFC000' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity style={styles.deliveryInstructions}>
            <View style={styles.deliveryInfo}>
              <Ionicons name="cube-outline" size={22} color="#FFC000" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingTitle}>Delivery Instructions</Text>
                <Text style={styles.settingDescription}>
                  Add special instructions for delivery
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleBackPress}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveAddressButton} onPress={handleSaveAddress}>
            <Text style={styles.saveAddressButtonText}>
              {isEditMode ? 'Update Address' : 'Save Address'}
            </Text>
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
    backgroundColor: '#F2F2F7',
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
  addressTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addressTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 80,
    alignItems: 'center',
  },
  addressTypeOptionActive: {
    backgroundColor: '#FFF8E6',
    borderColor: '#FFC000',
  },
  addressTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  addressTypeTextActive: {
    color: '#000000',
    fontWeight: '600',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
  deliveryInstructions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deliveryInfo: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C757D',
  },
  saveAddressButton: {
    flex: 2,
    backgroundColor: '#FFC000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveAddressButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  bottomSpacer: {
    height: 30,
  },
});