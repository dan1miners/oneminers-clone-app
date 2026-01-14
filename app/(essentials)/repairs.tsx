import {
  View,
  Text,
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

  const handleUpdateStatus = (repairId: string) => {
    Alert.alert('Update Status', 'What would you like to do?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark as Completed',
        onPress: () =>
          setRepairs(prev =>
            prev.map(r =>
              r.id === repairId
                ? { ...r, status: 'completed', progress: 100 }
                : r
            )
          ),
      },
      {
        text: 'Request Update',
        onPress: () =>
          Alert.alert(
            'Request Sent',
            'A status update has been requested from our repair team.'
          ),
      },
    ]);
  };

  const getStatusColor = (status: Repair['status']) => {
    switch (status) {
      case 'diagnosis':
        return '#FF9500';
      case 'repairing':
        return '#007AFF';
      case 'testing':
        return '#5856D6';
      case 'completed':
        return '#34C759';
      case 'shipped':
        return '#32D74B';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = (status: Repair['status']) => {
    switch (status) {
      case 'diagnosis':
        return 'search-outline';
      case 'repairing':
        return 'build-outline';
      case 'testing':
        return 'speedometer-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'shipped':
        return 'cube-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderRepairCard = (repair: Repair) => {
    const color = getStatusColor(repair.status);

    return (
      <TouchableOpacity
        key={repair.id}
        onPress={() =>
          router.push(`/(essentials)/repair-details?id=${repair.id}`)
        }
        className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-xl p-4 mb-3"
      >
        {/* Header */}
        <View className="flex-row justify-between mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-black mb-2">
              {repair.minerName}
            </Text>

            <View
              className="flex-row items-center self-start px-2 py-1 rounded-md"
              style={{ backgroundColor: `${color}20` }}
            >
              <Ionicons name={getStatusIcon(repair.status)} size={14} color={color} />
              <Text className="ml-1 text-xs font-semibold" style={{ color }}>
                {repair.status.charAt(0).toUpperCase() +
                  repair.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text className="text-xl font-bold text-black">
            {repair.cost}
          </Text>
        </View>

        {/* Details */}
        {[
          { icon: 'barcode-outline', text: repair.serialNumber },
          { icon: 'alert-circle-outline', text: repair.issue },
          {
            icon: 'calendar-outline',
            text: `Received: ${repair.dateReceived}`,
          },
        ].map((row, i) => (
          <View key={i} className="flex-row items-center mb-2">
            <Ionicons name={row.icon as any} size={16} color="#8E8E93" />
            <Text className="ml-2 text-sm text-[#6C757D] flex-1">
              {row.text}
            </Text>
          </View>
        ))}

        {/* Progress */}
        <View className="mt-3 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-[#8E8E93]">Progress</Text>
            <Text className="text-sm font-semibold text-black">
              {repair.progress}%
            </Text>
          </View>

          <View className="h-2 bg-[#F2F2F7] rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${repair.progress}%`,
                backgroundColor: color,
              }}
            />
          </View>

          <Text className="text-xs text-[#8E8E93] mt-2">
            Estimated completion: {repair.estimatedCompletion}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => handleUpdateStatus(repair.id)}
            className="flex-1 flex-row items-center justify-center bg-white border border-[#E9ECEF] rounded-lg py-2"
          >
            <Ionicons name="refresh-outline" size={18} color="#007AFF" />
            <Text className="ml-1 text-sm font-medium">Update</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-[#E9ECEF] rounded-lg py-2">
            <Ionicons name="chatbubble-outline" size={18} color="#FFC000" />
            <Text className="ml-1 text-sm font-medium">Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-white border border-[#E9ECEF] rounded-lg py-2">
            <Ionicons name="document-outline" size={18} color="#34C759" />
            <Text className="ml-1 text-sm font-medium">Invoice</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">Repairs</Text>

        <TouchableOpacity onPress={() => router.push('/(essentials)/new-repair')}>
          <Ionicons name="add" size={24} color="#FFC000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {repairs.length > 0 ? (
          repairs.map(renderRepairCard)
        ) : (
          <View className="items-center py-10">
            <MaterialIcons name="handyman" size={64} color="#E5E5EA" />
            <Text className="text-lg font-bold mt-4">
              No Active Repairs
            </Text>
            <Text className="text-base text-[#8E8E93] mt-2 text-center">
              Submit a repair request to get started
            </Text>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
