import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks";

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    location: "",
    calendar_preference: "gregorian",
  });

  const { signup, isLoading, error, clearError } = useAuth();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    if (!formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const generateUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        location: formData.location || null,
        calendar_preference: formData.calendar_preference,
        auth_provider: "email",
        uid: generateUID(), // Auto-generate UUID
      };

      await signup(userData);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("login") },
      ]);
    } catch (err) {
      console.error("Signup failed:", err);
      Alert.alert(
        "Signup Failed",
        err?.detail || "Unable to create account. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>
                {error.detail || "Signup failed. Please try again."}
              </Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Location (Optional)"
            value={formData.location}
            onChangeText={(value) => handleChange("location", value)}
            autoCapitalize="words"
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Calendar Preference</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleChange("calendar_preference", "gregorian")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "gregorian" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Gregorian</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleChange("calendar_preference", "hindu")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "hindu" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Hindu</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#99c7ff",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: { color: "#c00", fontSize: 14 },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: { color: "#666", fontSize: 14 },
  loginLink: { color: "#007AFF", fontWeight: "bold", fontSize: 14 },
  pickerContainer: { marginBottom: 16 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  radioCircleSelected: {
    backgroundColor: "#007AFF",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SignupScreen;
