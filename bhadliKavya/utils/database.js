import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const saveUserToFirestore = async (userData) => {
    try {
        await setDoc(doc(db, 'users', userData.uid), {
            uid: userData.uid,
            email: userData.email,
            name: userData.name || userData.displayName,
            photoURL: userData.photoURL,
            authProvider: userData.authProvider || 'google',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        });
        console.log('User saved to Firestore');
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
        throw error;
    }
};

export const getUserFromFirestore = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user from Firestore:', error);
        throw error;
    }
};

export const saveUserToBackend = async (userData) => {
    try {
        console.log('💾 Saving to backend:', userData.email);
        
        // For mobile testing, use your computer's IP address
        const response = await fetch("http://10.174.186.27:8000/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userData.email,
                password: userData.authProvider === 'google' ? 'google_oauth' : userData.password,
                name: userData.name || userData.displayName,
                uid: userData.uid,
                auth_provider: userData.authProvider || 'email',
                photoURL: userData.photoURL
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Backend registration failed");
        }

        const result = await response.json();
        console.log('✅ Backend save result:', result);
        
        return result;
    } catch (error) {
        console.error('❌ Backend save error:', error);
        throw error;
    }
};