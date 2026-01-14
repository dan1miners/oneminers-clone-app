import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
  isAI?: boolean;
};

type Topic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

export default function SupportScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Oneminers Support. How can I help you today?',
      sender: 'support',
      time: '10:00 AM',
      isAI: true,
    },
    {
      id: '2',
      text: 'Hi, I have an issue with my Antminer S19 Pro.',
      sender: 'user',
      time: '10:02 AM',
    },
    {
      id: '3',
      text: 'I understand. Could you please describe the issue in more detail?',
      sender: 'support',
      time: '10:03 AM',
      isAI: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics: Topic[] = [
    { id: 'orders', title: 'Order Issues', description: 'Tracking, cancellations, returns', icon: 'cart', color: '#FFC000' },
    { id: 'repairs', title: 'Repairs & Service', description: 'Status, quotes, warranty', icon: 'build', color: '#007AFF' },
    { id: 'technical', title: 'Technical Support', description: 'Setup, troubleshooting, guides', icon: 'settings', color: '#34C759' },
    { id: 'billing', title: 'Billing & Payments', description: 'Invoices, refunds, payment methods', icon: 'card', color: '#FF9500' },
    { id: 'mining', title: 'Mining Support', description: 'Pool setup, optimization, profitability', icon: 'speedometer', color: '#5856D6' },
    { id: 'account', title: 'Account & Security', description: 'Login, security, profile', icon: 'person', color: '#FF2D55' },
  ];

  const quickQuestions = [
    'How do I track my order?',
    'What is the repair process?',
    'How to set up my miner?',
    'Payment methods accepted?',
    'Warranty information',
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team is reviewing it.',
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row mb-4 items-end ${
        item.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {item.sender === 'support' && (
        <View className="w-8 h-8 rounded-full bg-[#FFC000] items-center justify-center mx-2">
          {item.isAI ? (
            <MaterialCommunityIcons name="robot" size={18} color="#FFF" />
          ) : (
            <Ionicons name="person" size={18} color="#FFF" />
          )}
        </View>
      )}

      <View
        className={`max-w-[75%] p-3 rounded-2xl ${
          item.sender === 'user'
            ? 'bg-[#FFC000] rounded-br-md'
            : 'bg-white rounded-bl-md shadow-sm'
        }`}
      >
        <Text className="text-base text-black leading-6">{item.text}</Text>

        <View className="flex-row items-center justify-end mt-1">
          <Text className="text-[11px] text-[#8E8E93]">{item.time}</Text>
          {item.sender === 'support' && item.isAI && (
            <Text className="ml-2 text-[10px] font-semibold text-[#FFC000] bg-[#FFF8E6] px-1.5 py-0.5 rounded">
              AI
            </Text>
          )}
        </View>
      </View>

      {item.sender === 'user' && (
        <View className="w-8 h-8 rounded-full bg-[#007AFF] items-center justify-center mx-2">
          <Ionicons name="person" size={18} color="#FFF" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-lg font-semibold text-black">Support</Text>
          <Text className="text-xs text-green-600">Online • 24/7 Support</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="call-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Topics */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white border-b border-[#E9ECEF] px-4 py-3">
        {topics.map(topic => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => setSelectedTopic(topic.id)}
            className={`items-center mr-5 p-2 rounded-xl ${
              selectedTopic === topic.id ? 'bg-[#FFF8E6]' : ''
            }`}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
              style={{ backgroundColor: `${topic.color}20` }}
            >
              <Ionicons name={topic.icon as any} size={20} color={topic.color} />
            </View>
            <Text className="text-xs font-medium text-black text-center">
              {topic.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1 bg-[#F2F2F7]"
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-[#FFC000] items-center justify-center mx-2">
                <MaterialCommunityIcons name="robot" size={18} color="#FFF" />
              </View>
              <View className="bg-white p-3 rounded-2xl flex-row">
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick Questions */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white border-t border-[#E9ECEF] px-4 py-3">
        {quickQuestions.map((q, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setNewMessage(q)}
            className="bg-[#F8F9FA] border border-[#E9ECEF] px-4 py-2 rounded-full mr-3"
          >
            <Text className="text-sm text-black">{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View className="flex-row items-center bg-white border-t border-[#E9ECEF] px-4 py-3">
        <TouchableOpacity className="p-2">
          <Ionicons name="attach" size={22} color="#8E8E93" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-[#F8F9FA] rounded-full px-4 py-2.5 text-base mx-3 max-h-[100px]"
          placeholder="Type your message..."
          placeholderTextColor="#8E8E93"
          multiline
          value={newMessage}
          onChangeText={setNewMessage}
        />

        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
          className={`w-11 h-11 rounded-full items-center justify-center ${
            newMessage.trim() ? 'bg-[#FFC000]' : 'bg-[#E9ECEF]'
          }`}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Connect to Human */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Connect to Human Agent',
            'You will be connected to a live agent. Estimated wait time: 2–3 minutes.'
          )
        }
        className="flex-row items-center justify-center bg-[#007AFF] py-4"
      >
        <MaterialCommunityIcons name="account-supervisor" size={20} color="#FFF" />
        <Text className="ml-2 text-base font-semibold text-white">
          Connect to Human Agent
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
