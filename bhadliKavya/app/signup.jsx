import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        // Here you would typically handle the signup logic
        Alert.alert('Success', 'Account created successfully');
        router.push('/home');
    };

    return (
        <View className="flex-1 justify-center bg-gray-50 px-6">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">Create Account</Text>

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

                <TextInput
                    className="bg-white p-4 rounded-lg border border-gray-300"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    className="bg-blue-600 p-4 rounded-lg"
                    onPress={handleSignUp}
                >
                    <Text className="text-white text-center font-semibold">Sign Up</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
                </View>
            </View>
        </View>
    );
}