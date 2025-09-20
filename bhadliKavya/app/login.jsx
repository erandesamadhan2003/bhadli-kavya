import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { saveUserToFirestore, saveUserToBackend, getUserFromFirestore } from '../utils/database';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: '979914009632-1k8556mqjk3dp5566mm88vktd0prtqdu.apps.googleusercontent.com',
    webClientId: '294278448709-kvh5mc6fdau0dktqmb4cglkjecmrfko0.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@erandesamadhan2003/bhadlikavya'
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const handleGoogleSignIn = async (idToken) => {
        setGoogleLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;
            
            const userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                authProvider: 'google'
            };

            // Check if user exists in Firestore
            const existingUser = await getUserFromFirestore(user.uid);
            
            if (!existingUser) {
                // Save to both Firestore and backend if new user
                await saveUserToFirestore(userData);
                await saveUserToBackend(userData);
                Alert.alert('Success', 'Welcome! Account created successfully.');
            } else {
                Alert.alert('Success', 'Welcome back!');
            }
            
            router.push('/home');
        } catch (error) {
            if (error.message.includes('Email already registered')) {
                Alert.alert('Info', 'Account exists. Logging you in...');
                router.push('/home');
            } else {
                Alert.alert('Error', 'Google login failed: ' + error.message);
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            // Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Also verify with backend
            const backendResponse = await fetch("http://127.0.0.1:8000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
            });

            if (backendResponse.ok) {
                Alert.alert('Success', 'Logged in successfully');
                router.push('/home');
            } else {
                const error = await backendResponse.json();
                Alert.alert('Error', error.detail || 'Login failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        promptAsync();
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
                    className="bg-blue-600 p-4 rounded-lg items-center"
                    onPress={handleEmailLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold">Login</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-4 text-gray-500">OR</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                <TouchableOpacity
                    className="bg-white p-4 rounded-lg border border-gray-300 flex-row items-center justify-center"
                    onPress={handleGoogleLogin}
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <ActivityIndicator color="#0000ff" />
                    ) : (
                        <>
                            <Image 
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} 
                                className="w-6 h-6 mr-3"
                            />
                            <Text className="text-gray-700 font-semibold">Sign in with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <Link href="/signup" className="text-blue-600 font-semibold">Sign Up</Link>
                </View>
            </View>
        </View>
    );
}