import {
  View,
  Text,
  StyleSheet,
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
    {
      id: 'orders',
      title: 'Order Issues',
      description: 'Tracking, cancellations, returns',
      icon: 'cart',
      color: '#FFC000',
    },
    {
      id: 'repairs',
      title: 'Repairs & Service',
      description: 'Status, quotes, warranty',
      icon: 'build',
      color: '#007AFF',
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Setup, troubleshooting, guides',
      icon: 'settings',
      color: '#34C759',
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Invoices, refunds, payment methods',
      icon: 'card',
      color: '#FF9500',
    },
    {
      id: 'mining',
      title: 'Mining Support',
      description: 'Pool setup, optimization, profitability',
      icon: 'speedometer',
      color: '#5856D6',
    },
    {
      id: 'account',
      title: 'Account & Security',
      description: 'Login, security, profile',
      icon: 'person',
      color: '#FF2D55',
    },
  ];

  const handleBackPress = () => {
    router.back();
  };

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

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(newMessage),
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('order') || lowerMessage.includes('tracking')) {
      return 'I can help you with order tracking. Please provide your order number for more specific assistance.';
    } else if (lowerMessage.includes('repair') || lowerMessage.includes('fix')) {
      return 'For repair inquiries, I can check the status or help you submit a new repair request. Do you have a repair ID?';
    } else if (lowerMessage.includes('technical') || lowerMessage.includes('setup')) {
      return 'I can guide you through technical setup. Which miner model are you having issues with?';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
      return 'I can assist with billing questions. Please provide more details about your payment issue.';
    } else if (lowerMessage.includes('mining') || lowerMessage.includes('pool')) {
      return 'For mining support, I can help with pool configuration, optimization tips, and profitability calculations.';
    } else {
      return 'Thank you for your message. I understand you need assistance. Could you please provide more details so I can help you better?';
    }
  };

  const handleQuickQuestion = (question: string) => {
    setNewMessage(question);
  };

  const handleConnectToHuman = () => {
    Alert.alert(
      'Connect to Human Agent',
      'You will be connected to a live support agent. Estimated wait time: 2-3 minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Connect', 
          onPress: () => {
            const agentMessage: Message = {
              id: Date.now().toString(),
              text: 'Hi, I\'m Sarah from Oneminers support team. How can I assist you today?',
              sender: 'support',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, agentMessage]);
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.supportMessage
    ]}>
      {item.sender === 'support' && (
        <View style={styles.avatar}>
          {item.isAI ? (
            <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
          ) : (
            <Ionicons name="person" size={20} color="#FFFFFF" />
          )}
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.supportBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.supportMessageText
        ]}>
          {item.text}
        </Text>
        
        <View style={styles.messageMeta}>
          <Text style={styles.messageTime}>{item.time}</Text>
          {item.sender === 'support' && item.isAI && (
            <Text style={styles.aiBadge}>AI</Text>
          )}
        </View>
      </View>
      
      {item.sender === 'user' && (
        <View style={[styles.avatar, styles.userAvatar]}>
          <Ionicons name="person" size={20} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  const quickQuestions = [
    'How do I track my order?',
    'What is the repair process?',
    'How to set up my miner?',
    'Payment methods accepted?',
    'Warranty information',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Support</Text>
          <Text style={styles.headerSubtext}>Online • 24/7 Support</Text>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call-outline" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        {/* Topics */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.topicsContainer}
          contentContainerStyle={styles.topicsContent}
        >
          {topics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicButton,
                selectedTopic === topic.id && styles.topicButtonActive
              ]}
              onPress={() => setSelectedTopic(topic.id)}
            >
              <View style={[styles.topicIcon, { backgroundColor: `${topic.color}20` }]}>
                <Ionicons name={topic.icon as any} size={20} color={topic.color} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View style={styles.welcomeCard}>
              <View style={styles.welcomeHeader}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#FFC000" />
                <Text style={styles.welcomeTitle}>Welcome to Support</Text>
              </View>
              <Text style={styles.welcomeText}>
                I'm your AI assistant. I can help with orders, repairs, technical issues, and more.
                For urgent matters, you can connect with a human agent.
              </Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
                </View>
                <View style={[styles.messageBubble, styles.supportBubble]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Questions */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.questionsContainer}
          contentContainerStyle={styles.questionsContent}
        >
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.questionButton}
              onPress={() => handleQuickQuestion(question)}
            >
              <Text style={styles.questionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputActionButton}>
            <Ionicons name="attach" size={24} color="#8E8E93" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message..."
            placeholderTextColor="#8E8E93"
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons name="send" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Connect to Human */}
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnectToHuman}
        >
          <MaterialCommunityIcons name="account-supervisor" size={20} color="#FFFFFF" />
          <Text style={styles.connectButtonText}>Connect to Human Agent</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerSubtext: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 2,
  },
  headerButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  topicsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  topicsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topicButton: {
    alignItems: 'center',
    marginRight: 20,
    padding: 8,
    borderRadius: 12,
    minWidth: 80,
  },
  topicButtonActive: {
    backgroundColor: '#FFF8E6',
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicTitle: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  messagesContent: {
    padding: 16,
  },
  welcomeCard: {
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
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  supportMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFC000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: '#007AFF',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#FFC000',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000000',
  },
  supportMessageText: {
    color: '#000000',
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  aiBadge: {
    fontSize: 10,
    color: '#FFC000',
    fontWeight: '600',
    marginLeft: 8,
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C7C7CC',
    marginHorizontal: 2,
  },
  questionsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  questionsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  questionButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  questionText: {
    fontSize: 14,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  inputActionButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    marginHorizontal: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFC000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E9ECEF',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    gap: 8,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});