import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Address = {
  id: string;
  title: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export default function ShippingAddressesScreen() {
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'Home',
      name: 'John Doe',
      address: '123 Mining Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    {
      id: '2',
      title: 'Office',
      name: 'John Doe',
      address: '456 Crypto Avenue',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95113',
      country: 'United States',
      phone: '+1 (555) 987-6543',
      isDefault: false,
    },
    {
      id: '3',
      title: 'Warehouse',
      name: 'MiningPros Inc.',
      address: '789 Mining Complex',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      country: 'United States',
      phone: '+1 (555) 456-7890',
      isDefault: false,
    },
  ]);

  const handleBackPress = () => {
    router.back();
  };

  const handleAddNewAddress = () => {
    router.push('/(essentials)/add-address');
  };

  const handleEditAddress = (addressId: string) => {
    router.push(`/(essentials)/edit-address?id=${addressId}`);
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this shipping address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
          }
        }
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    );
  };

  const renderAddressCard = (address: Address) => (
    <View key={address.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTitleRow}>
          <View style={styles.addressTitleContainer}>
            <Text style={styles.addressTitle}>{address.title}</Text>
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            )}
          </View>
          
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAddress(address.id)}
            >
              <Ionicons name="pencil" size={18} color="#007AFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAddress(address.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.addressContent}>
          <View style={styles.addressDetails}>
            <Text style={styles.addressName}>{address.name}</Text>
            <Text style={styles.addressText}>{address.address}</Text>
            <Text style={styles.addressText}>
              {address.city}, {address.state} {address.zipCode}
            </Text>
            <Text style={styles.addressText}>{address.country}</Text>
            <Text style={styles.addressPhone}>{address.phone}</Text>
          </View>
          
          <View style={styles.addressActionsVertical}>
            {!address.isDefault && (
              <TouchableOpacity
                style={styles.setDefaultButton}
                onPress={() => handleSetDefault(address.id)}
              >
                <Ionicons name="star-outline" size={16} color="#FFC000" />
                <Text style={styles.setDefaultText}>Set as Default</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.useAddressButton}>
              <Text style={styles.useAddressText}>Use This Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Shipping Addresses</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instruction */}
        <View style={styles.instructionCard}>
          <Ionicons name="information-circle" size={24} color="#FFC000" />
          <Text style={styles.instructionText}>
            Add and manage your shipping addresses for faster checkout
          </Text>
        </View>

        {/* Addresses List */}
        <View style={styles.addressesList}>
          {addresses.length > 0 ? (
            addresses.map(renderAddressCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={64} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Addresses Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add a shipping address to get started
              </Text>
            </View>
          )}
        </View>

        {/* Add New Address Button */}
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add-circle" size={24} color="#FFC000" />
          <Text style={styles.addNewButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Shipping Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Shipping Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Ensure your address is correct to avoid delivery delays
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Add multiple addresses for home, office, or warehouse
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Set a default address for faster checkout
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
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  addressesList: {
    marginBottom: 20,
  },
  addressCard: {
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
  addressHeader: {
    marginBottom: 16,
  },
  addressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  defaultBadge: {
    backgroundColor: '#FFC000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressPhone: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 4,
  },
  addressActionsVertical: {
    alignItems: 'flex-end',
    gap: 12,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  setDefaultText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  useAddressButton: {
    backgroundColor: '#FFC000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  useAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFC000',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addNewButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
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