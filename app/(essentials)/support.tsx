import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'support';
  time: string;
  isAI?: boolean;
  attachments?: Attachment[];
};

type Topic = {
  id: string;
  title: string;
  icon: string;
};

type Attachment = {
  id: string;
  type: 'image' | 'video' | 'file';
  uri: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

const ACCENT = '#FFC000';
const MAX_LINES = 3;
const LINE_HEIGHT = 20;
const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES + 16;

export default function SupportScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Oneminers Support. How can we help today?',
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
      text: 'Got it. Please describe what you’re seeing (error, noise, hashrate, power, etc.).',
      sender: 'support',
      time: '10:03 AM',
      isAI: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [showHumanModal, setShowHumanModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);

  const [ticketId] = useState('OM-24819');

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const topics: Topic[] = [
    { id: 'orders', title: 'Orders', icon: 'cart-outline' },
    { id: 'repairs', title: 'Repairs', icon: 'build-outline' },
    { id: 'technical', title: 'Technical', icon: 'settings-outline' },
    { id: 'billing', title: 'Billing', icon: 'card-outline' },
    { id: 'account', title: 'Account', icon: 'person-outline' },
  ];

  const quickQuestions = ['Track my order', 'Warranty', 'Repair status', 'Payment methods', 'Setup guide'];

  const addAttachment = (a: Attachment) => {
    setAttachments((prev) => [...prev, a]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const pickFromGallery = async () => {
    setShowAttachModal(false);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (res.canceled) return;

    res.assets.forEach((asset) => {
      addAttachment({
        id: Date.now().toString() + Math.random().toString(),
        type: asset.type === 'video' ? 'video' : 'image',
        uri: asset.uri,
        name: asset.fileName ?? undefined,
        mimeType: asset.mimeType ?? undefined,
        size: asset.fileSize ?? undefined,
      });
    });
  };

  const takePhoto = async () => {
    setShowAttachModal(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;

    const res = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (res.canceled) return;

    const asset = res.assets[0];
    addAttachment({
      id: Date.now().toString(),
      type: 'image',
      uri: asset.uri,
      name: asset.fileName ?? undefined,
      mimeType: asset.mimeType ?? undefined,
      size: asset.fileSize ?? undefined,
    });
  };

  const pickFile = async () => {
    setShowAttachModal(false);

    const res = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (res.canceled) return;

    res.assets.forEach((f) => {
      addAttachment({
        id: Date.now().toString() + Math.random().toString(),
        type: 'file',
        uri: f.uri,
        name: f.name ?? undefined,
        mimeType: f.mimeType ?? undefined,
        size: f.size ?? undefined,
      });
    });
  };

  const handleSendMessage = () => {
    const txt = newMessage.trim();
    if (!txt && attachments.length === 0) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: txt,
      sender: 'user',
      time,
      attachments: attachments.length ? attachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setAttachments([]);

    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks. We’re reviewing this now. If you have an order number or miner SN, paste it here.',
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <View className={['mb-3', isUser ? 'items-end' : 'items-start'].join(' ')}>
        <View className={['flex-row items-end', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
          {!isUser ? (
            <View className="w-8 h-8 rounded-full bg-[#FFC000] items-center justify-center mr-2">
              <MaterialCommunityIcons name={item.isAI ? 'robot' : 'account'} size={18} color="#000" />
            </View>
          ) : null}

          <View
            className={[
              'max-w-[78%] px-4 py-3 rounded-2xl border',
              isUser ? 'bg-[#FFC000] border-[#FFC000]' : 'bg-white border-[#E5E7EB]',
              isUser ? 'rounded-br-md' : 'rounded-bl-md',
            ].join(' ')}
          >
            {item.text ? (
              <Text className={['text-[15px] leading-6', isUser ? 'text-white' : 'text-black'].join(' ')}>
                {item.text}
              </Text>
            ) : null}

            {item.attachments?.length ? (
              <View className="mt-3">
                {item.attachments.map((a) => (
                  <View
                    key={a.id}
                    className={[
                      'mt-2 px-3 py-2 rounded-xl border flex-row items-center',
                      isUser ? 'bg-white/10 border-white/15' : 'bg-[#F9FAFB] border-[#E5E7EB]',
                    ].join(' ')}
                  >
                    <Ionicons
                      name={a.type === 'image' ? 'image-outline' : a.type === 'video' ? 'videocam-outline' : 'document-outline'}
                      size={16}
                      color={isUser ? '#fff' : '#111827'}
                    />
                    <Text
                      className={['ml-2 text-[12px] flex-1', isUser ? 'text-white' : 'text-black'].join(' ')}
                      numberOfLines={1}
                    >
                      {a.name || a.type.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View className={['mt-2 flex-row items-center', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
              <Text className={['text-[11px]', isUser ? 'text-white/80' : 'text-[#8E8E93]'].join(' ')}>
                {item.time}
              </Text>

              {!isUser && item.isAI ? (
                <View className="ml-2 px-2 py-0.5 rounded-full bg-[#FFF8E6] border border-[#FFC000]/20">
                  <Text className="text-[10px] font-semibold text-black">AI</Text>
                </View>
              ) : null}
            </View>
          </View>

          {isUser ? (
            <View className="w-8 h-8 rounded-full bg-[#111827] items-center justify-center ml-2">
              <Ionicons name="person" size={16} color="#fff" />
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const copyTicket = async () => {
    await Clipboard.setStringAsync(ticketId);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-[#E5E7EB] flex-row items-center h-[60px] bg-[#F9FAFB]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-lg font-semibold text-black">Support</Text>
          <Text className="text-[12px] text-[#16A34A] mt-0.5">Online</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowHumanModal(true)}
          activeOpacity={0.9}
          className="px-3 py-2 rounded-xl bg-[#FFC000]/15 border border-[#FFC000]/25 flex-row items-center"
        >
          <MaterialCommunityIcons name="account-supervisor" size={18} color="#000" />
          <Text className="ml-2 text-[12px] font-bold text-black">Human</Text>
        </TouchableOpacity>
      </View>

      

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 bg-[#F9FAFB]"
        contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isTyping ? (
            <View className="mt-1 flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-[#FFC000] items-center justify-center mr-2">
                <MaterialCommunityIcons name="robot" size={18} color="#000" />
              </View>
              <View className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-2xl flex-row">
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
                <View className="w-2 h-2 bg-[#C7C7CC] rounded-full mx-1" />
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick questions (fixed height, fits content) */}
      <View className="bg-white border-t border-[#E9ECEF]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
        >
          {quickQuestions.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setNewMessage(q)}
              activeOpacity={0.9}
              className="bg-[#F8F9FA] border border-[#E9ECEF] px-4 py-2 rounded-full mr-2"
            >
              <Text className="text-[13px] font-semibold text-black">{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Attachments preview */}
      {attachments.length > 0 ? (
        <View className="bg-white border-t border-[#E9ECEF] px-4 pt-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map((a) => (
              <View
                key={a.id}
                className="mr-2 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E9ECEF] flex-row items-center"
              >
                <Ionicons
                  name={a.type === 'image' ? 'image-outline' : a.type === 'video' ? 'videocam-outline' : 'document-outline'}
                  size={16}
                  color="#111827"
                />
                <Text className="ml-2 text-[12px] text-black max-w-[140px]" numberOfLines={1}>
                  {a.name || a.type.toUpperCase()}
                </Text>
                <TouchableOpacity onPress={() => removeAttachment(a.id)} className="ml-2">
                  <Ionicons name="close-circle" size={18} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Input bar (buttons vertically centered) */}
      <View className="flex-row items-end bg-white border-t border-[#E9ECEF] px-4 py-3">
        {/* Attach */}
        <TouchableOpacity onPress={() => setShowAttachModal(true)} className="w-11 h-11 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] items-center justify-center">
          <Ionicons name="attach" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* Input */}
        <TextInput
          multiline
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#8E8E93"
          className="flex-1 bg-[#F8F9FA] rounded-2xl px-4 py-3 text-[15px] mx-3"
          style={{
            maxHeight: MAX_HEIGHT,
            lineHeight: LINE_HEIGHT,
          }}
          scrollEnabled
          textAlignVertical="top"
        />

        {/* Send */}
        <TouchableOpacity
          disabled={!newMessage.trim() && attachments.length === 0}
          onPress={handleSendMessage}
          className={[
            'w-11 h-11 rounded-full items-center justify-center',
            newMessage.trim() || attachments.length ? 'bg-[#FFC000]' : 'bg-[#E9ECEF]',
          ].join(' ')}
        >
          <Ionicons name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Attach Modal */}
      <Modal visible={showAttachModal} transparent animationType="fade" onRequestClose={() => setShowAttachModal(false)}>
        <View className="flex-1 bg-black/50 justify-end p-4">
          <View className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-bold text-black">Attach</Text>
              <TouchableOpacity
                onPress={() => setShowAttachModal(false)}
                className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="mt-4">
              <TouchableOpacity
                onPress={takePhoto}
                className="flex-row items-center px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]"
              >
                <Ionicons name="camera-outline" size={18} color="#111827" />
                <Text className="ml-3 text-[14px] font-semibold text-black">Take photo</Text>
              </TouchableOpacity>

              <View className="h-3" />

              <TouchableOpacity
                onPress={pickFromGallery}
                className="flex-row items-center px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]"
              >
                <Ionicons name="images-outline" size={18} color="#111827" />
                <Text className="ml-3 text-[14px] font-semibold text-black">Choose from gallery</Text>
              </TouchableOpacity>

              <View className="h-3" />

              <TouchableOpacity
                onPress={pickFile}
                className="flex-row items-center px-4 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]"
              >
                <Ionicons name="document-outline" size={18} color="#111827" />
                <Text className="ml-3 text-[14px] font-semibold text-black">Choose file</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setShowAttachModal(false)} className="mt-4 bg-[#FFC000] rounded-xl py-3 items-center">
              <Text className="text-[14px] font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Human Agent Modal */}
      <Modal visible={showHumanModal} transparent animationType="fade" onRequestClose={() => setShowHumanModal(false)}>
        <View className="flex-1 bg-black/50 justify-end p-4">
          <View className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-bold text-black">Connect to a human</Text>
              <TouchableOpacity
                onPress={() => setShowHumanModal(false)}
                className="w-9 h-9 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text className="text-[13px] text-[#6B7280] mt-2 leading-5">
              We’ll connect you to a live agent. Include your order number or miner SN for faster help.
            </Text>

            <View className="mt-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-4">
              <Text className="text-[12px] text-[#6B7280] font-semibold">Ticket ID</Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[16px] font-bold text-black">{ticketId}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await Clipboard.setStringAsync(ticketId);
                  }}
                  className="px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] flex-row items-center"
                >
                  <Ionicons name="copy-outline" size={16} color="#111827" />
                  <Text className="ml-2 text-[12px] font-bold text-black">Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row mt-4">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowHumanModal(false)}
                className="flex-1 py-3 rounded-xl items-center bg-[#F9FAFB] border border-[#E5E7EB]"
              >
                <Text className="text-[14px] font-bold text-black">Cancel</Text>
              </TouchableOpacity>

              <View className="w-3" />

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setShowHumanModal(false)}
                className="flex-1 py-3 rounded-xl items-center bg-[#FFC000]"
              >
                <Text className="text-[14px] font-bold text-white">Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
