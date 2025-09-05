import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Keyboard, ScrollView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'expo-router';

export default function ChatBot() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
    ]);
    const [inputText, setInputText] = useState('');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef();

    useEffect(() => {
        // Use keyboardWillShow for iOS for smoother animation
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSubscription = Keyboard.addListener(showEvent, (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSubscription = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Auto-scroll to bottom when new messages are added or keyboard appears
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, keyboardHeight]);

    const handleSend = () => {
        if (inputText.trim() === '') return;

        // Add user message
        const newUserMessage = { id: Date.now(), text: inputText, sender: "user" };
        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');

        // Simulate bot response after a delay
        setTimeout(() => {
            const botResponses = [
                "I understand. Can you tell me more?",
                "That's interesting!",
                "How can I assist you with that?",
                "I'm here to help!",
                "Let me know if you need more information."
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            const newBotMessage = { id: Date.now() + 1, text: randomResponse, sender: "bot" };
            setMessages(prev => [...prev, newBotMessage]);
        }, 1000);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" style={{ paddingBottom: keyboardHeight }}>
            <View className="bg-blue-600 p-4">
                <Text className="text-white text-xl font-bold text-center">Chat Bot</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                className="flex-1 p-4"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {messages.map((message) => (
                    <View
                        key={message.id}
                        className={`mb-4 ${message.sender === "user" ? "items-end" : "items-start"}`}
                    >
                        <View
                            className={`rounded-lg p-3 max-w-[80%] ${message.sender === "user"
                                    ? "bg-blue-500 rounded-br-none"
                                    : "bg-gray-200 rounded-bl-none"
                                }`}
                        >
                            <Text
                                className={message.sender === "user" ? "text-white" : "text-gray-800"}
                            >
                                {message.text}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Input container - fixed at bottom */}
            <View className="p-4 border-t border-gray-300 bg-white">
                <View className="flex-row items-center">
                    <TextInput
                        className="flex-1 bg-gray-100 rounded-lg p-4 mr-2"
                        placeholder="Type your message..."
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                        multiline={true}
                        style={{ maxHeight: 100 }}
                    />
                    <TouchableOpacity
                        className="bg-blue-600 rounded-lg p-4 justify-center items-center"
                        onPress={handleSend}
                        disabled={inputText.trim() === ''}
                    >
                        <Text className="text-white font-semibold">Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}