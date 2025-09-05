import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Here you would typically handle the login logic
        if (email && password) {
            Alert.alert('Success', 'Logged in successfully');
            router.push('/home');
        } else {
            Alert.alert('Error', 'Please enter both email and password');
        }
    };

    return (
        <View className="flex-1 justify-center bg-gray-50 px-6">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">Login</Text>

            <View className="space-y-4">
                <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-300"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-300"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg"
                    onPress={handleLogin}
                >
                    <Text className="text-white text-center font-semibold">Login</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <Link href="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
                </View>
            </View>
        </View>
    );
}