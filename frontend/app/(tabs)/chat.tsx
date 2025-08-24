import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ChatBot as ChatBotComponent } from "@/screens/ChatBot";

export default function Chat() {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 70}
            >
                <View style={styles.glowBackground} />
                <ChatBotComponent
                    apiEndpoint="http://127.0.0.1:8000/"
                    welcomeMessage="⚡ Hello there! 🚀✨"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        position: 'relative',
    },
    glowBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(74,144,226,0.02)',
    },
});