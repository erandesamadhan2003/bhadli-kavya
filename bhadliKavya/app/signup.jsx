import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { saveUserToFirestore, saveUserToBackend, getUserFromFirestore } from '../utils/database';

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        expoClientId: '979914009632-1k8556mqjk3dp5566mm88vktd0prtqdu.apps.googleusercontent.com',
        webClientId: '294278448709-kvh5mc6fdau0dktqmb4cglkjecmrfko0.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

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
                // Save to both Firestore and backend
                await saveUserToFirestore(userData);
                try {
                    await saveUserToBackend(userData);
                } catch (backendError) {
                    console.log('Backend save failed (user might already exist):', backendError);
                }
                Alert.alert('Success', 'Google signup successful!');
            } else {
                Alert.alert('Info', 'Account already exists. Logging you in...');
            }
            
            router.push('/home');
        } catch (error) {
            console.error('Google signup error:', error);
            Alert.alert('Error', 'Google signup failed: ' + error.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleEmailSignUp = async () => {
        // Validation
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            console.log('Attempting to create user with email:', email);
            
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Firebase user created successfully:', user.uid);

            const userData = {
                uid: user.uid,
                email: user.email,
                name: email.split('@')[0], // Use email prefix as name
                photoURL: null,
                authProvider: 'email',
                password: password
            };

            // Save to Firestore
            try {
                await saveUserToFirestore(userData);
                console.log('User saved to Firestore');
            } catch (firestoreError) {
                console.error('Firestore save error:', firestoreError);
            }

            // Save to backend
            try {
                await saveUserToBackend(userData);
                console.log('User saved to backend');
            } catch (backendError) {
                console.error('Backend save error:', backendError);
                // Don't fail the entire process if backend fails
            }

            Alert.alert('Success', 'Account created successfully!');
            router.push('/home');
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already registered. Please use login instead.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak. Please use a stronger password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                default:
                    errorMessage = error.message || 'Signup failed. Please try again.';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        setGoogleLoading(true);
        promptAsync();
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
                    placeholder="Password (min 6 characters)"
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
                    className="bg-blue-600 p-4 rounded-lg items-center"
                    onPress={handleEmailSignUp}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold">Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="mx-4 text-gray-500">OR</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                <TouchableOpacity
                    className="bg-white p-4 rounded-lg border border-gray-300 flex-row items-center justify-center"
                    onPress={handleGoogleSignUp}
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
                            <Text className="text-gray-700 font-semibold">Sign up with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
                </View>
            </View>
        </View>
    );
}