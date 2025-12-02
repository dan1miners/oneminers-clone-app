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

type Repair = {
  id: string;
  minerName: string;
  model: string;
  serialNumber: string;
  issue: string;
  status: 'diagnosis' | 'repairing' | 'testing' | 'completed' | 'shipped';
  dateReceived: string;
  estimatedCompletion: string;
  progress: number;
  cost: string;
};

export default function RepairsScreen() {
  const router = useRouter();
  
  const [repairs, setRepairs] = useState<Repair[]>([
    {
      id: '1',
      minerName: 'Antminer S19 Pro',
      model: 'Bitmain S19 Pro',
      serialNumber: 'SN-2023-00123',
      issue: 'Power supply failure',
      status: 'repairing',
      dateReceived: '2024-01-15',
      estimatedCompletion: '2024-01-25',
      progress: 65,
      cost: '$450',
    },
    {
      id: '2',
      minerName: 'Whatsminer M30S+',
      model: 'MicroBT M30S+',
      serialNumber: 'SN-2023-00456',
      issue: 'Fan replacement',
      status: 'testing',
      dateReceived: '2024-01-10',
      estimatedCompletion: '2024-01-20',
      progress: 85,
      cost: '$280',
    },
    {
      id: '3',
      minerName: 'AvalonMiner 1246',
      model: 'Canaan 1246',
      serialNumber: 'SN-2023-00789',
      issue: 'Hashboard repair',
      status: 'diagnosis',
      dateReceived: '2024-01-18',
      estimatedCompletion: '2024-01-30',
      progress: 30,
      cost: '$650',
    },
    {
      id: '4',
      minerName: 'Antminer L7',
      model: 'Bitmain L7',
      serialNumber: 'SN-2023-00987',
      issue: 'Completed',
      status: 'completed',
      dateReceived: '2023-12-20',
      estimatedCompletion: '2024-01-05',
      progress: 100,
      cost: '$520',
    },
  ]);

  const handleBackPress = () => {
    router.back();
  };

  const handleNewRepair = () => {
    router.push('/(essentials)/new-repair');
  };

  const handleViewDetails = (repairId: string) => {
    router.push(`/(essentials)/repair-details?id=${repairId}`);
  };

  const handleUpdateStatus = (repairId: string) => {
    Alert.alert(
      'Update Status',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark as Completed', onPress: () => {
          setRepairs(prev => prev.map(repair => 
            repair.id === repairId 
              ? { ...repair, status: 'completed', progress: 100 }
              : repair
          ));
        }},
        { text: 'Request Update', onPress: () => {
          Alert.alert('Request Sent', 'A status update has been requested from our repair team.');
        }},
      ]
    );
  };

  const getStatusColor = (status: Repair['status']) => {
    switch (status) {
      case 'diagnosis': return '#FF9500';
      case 'repairing': return '#007AFF';
      case 'testing': return '#5856D6';
      case 'completed': return '#34C759';
      case 'shipped': return '#32D74B';
      default: return '#8E8E93';
    }
  };

  const getStatusIcon = (status: Repair['status']) => {
    switch (status) {
      case 'diagnosis': return 'search-outline';
      case 'repairing': return 'build-outline';
      case 'testing': return 'speedometer-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'shipped': return 'cube-outline';
      default: return 'help-circle-outline';
    }
  };

  const renderRepairCard = (repair: Repair) => (
    <TouchableOpacity 
      key={repair.id}
      style={styles.repairCard}
      onPress={() => handleViewDetails(repair.id)}
    >
      <View style={styles.repairHeader}>
        <View style={styles.repairTitle}>
          <Text style={styles.minerName}>{repair.minerName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(repair.status)}20` }]}>
            <Ionicons name={getStatusIcon(repair.status)} size={14} color={getStatusColor(repair.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(repair.status) }]}>
              {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.repairCost}>{repair.cost}</Text>
      </View>
      
      <View style={styles.repairDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="barcode-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{repair.serialNumber}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="alert-circle-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>{repair.issue}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <Text style={styles.detailText}>Received: {repair.dateReceived}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>Progress</Text>
          <Text style={styles.progressPercent}>{repair.progress}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${repair.progress}%`,
                backgroundColor: getStatusColor(repair.status)
              }
            ]} 
          />
        </View>
        
        <Text style={styles.estimatedText}>
          Estimated completion: {repair.estimatedCompletion}
        </Text>
      </View>
      
      <View style={styles.repairActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleUpdateStatus(repair.id)}
        >
          <Ionicons name="refresh-outline" size={18} color="#007AFF" />
          <Text style={styles.actionButtonText}>Update</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color="#FFC000" />
          <Text style={styles.actionButtonText}>Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-outline" size={18} color="#34C759" />
          <Text style={styles.actionButtonText}>Invoice</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const stats = {
    activeRepairs: repairs.filter(r => r.status !== 'completed').length,
    completedRepairs: repairs.filter(r => r.status === 'completed').length,
    totalCost: repairs.reduce((sum, repair) => sum + parseInt(repair.cost.replace('$', '')), 0),
    averageDays: 12,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Repairs</Text>
        
        <TouchableOpacity 
          style={styles.newRepairButton}
          onPress={handleNewRepair}
        >
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFC00020' }]}>
                <Ionicons name="build-outline" size={24} color="#FFC000" />
              </View>
              <Text style={styles.statValue}>{stats.activeRepairs}</Text>
              <Text style={styles.statLabel}>Active Repairs</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#34C75920' }]}>
                <Ionicons name="checkmark-done-outline" size={24} color="#34C759" />
              </View>
              <Text style={styles.statValue}>{stats.completedRepairs}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#007AFF20' }]}>
                <Ionicons name="cash-outline" size={24} color="#007AFF" />
              </View>
              <Text style={styles.statValue}>${stats.totalCost}</Text>
              <Text style={styles.statLabel}>Total Cost</Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#5856D620' }]}>
                <Ionicons name="timer-outline" size={24} color="#5856D6" />
              </View>
              <Text style={styles.statValue}>{stats.averageDays}</Text>
              <Text style={styles.statLabel}>Avg. Days</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF8E6' }]}>
              <Ionicons name="add-circle" size={24} color="#FFC000" />
            </View>
            <Text style={styles.quickActionText}>New Repair</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0F9F0' }]}>
              <Ionicons name="search" size={24} color="#34C759" />
            </View>
            <Text style={styles.quickActionText}>Track Repair</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F0F8FF' }]}>
              <Ionicons name="document-text" size={24} color="#007AFF" />
            </View>
            <Text style={styles.quickActionText}>Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF0F5' }]}>
              <Ionicons name="headset" size={24} color="#FF2D55" />
            </View>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Repairs List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Repairs</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {repairs.length > 0 ? (
            repairs.map(renderRepairCard)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="handyman" size={64} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Active Repairs</Text>
              <Text style={styles.emptySubtitle}>
                Submit a repair request to get started
              </Text>
            </View>
          )}
        </View>

        {/* Repair Status Guide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Status Guide</Text>
          
          <View style={styles.statusGuide}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.statusItemText}>Diagnosis</Text>
              <Text style={styles.statusItemDesc}>Initial assessment</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#007AFF' }]} />
              <Text style={styles.statusItemText}>Repairing</Text>
              <Text style={styles.statusItemDesc}>Parts replacement</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#5856D6' }]} />
              <Text style={styles.statusItemText}>Testing</Text>
              <Text style={styles.statusItemDesc}>Quality checks</Text>
            </View>
            
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
              <Text style={styles.statusItemText}>Completed</Text>
              <Text style={styles.statusItemDesc}>Ready for pickup</Text>
            </View>
          </View>
        </View>

        {/* Repair Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Tips</Text>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Package miners securely with proper padding
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Include all accessories and power cables
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Note down the exact issues you're experiencing
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            <Text style={styles.tipText}>
              Keep your tracking number for status updates
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
  newRepairButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  repairCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  repairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  repairTitle: {
    flex: 1,
  },
  minerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  repairCost: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  repairDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    flex: 1,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  estimatedText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  repairActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
  statusGuide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '48%',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  statusItemDesc: {
    fontSize: 12,
    color: '#8E8E93',
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