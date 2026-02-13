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
import { validateSignupForm } from "../../utils";

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
    console.log("🔵 Signup button clicked");

    // Validate form using utility function
    const validation = validateSignupForm(formData);
    console.log("🔵 Validation result:", validation);

    if (!validation.isValid) {
      console.log("❌ Validation failed:", validation.error);
      Alert.alert("Error", validation.error);
      return;
    }

    console.log("✅ Validation passed, preparing user data");

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        location: formData.location || null,
        calendar_preference: formData.calendar_preference,
        auth_provider: "email",
        uid: generateUID(),
      };

      console.log("🔵 Sending signup request with data:", {
        ...userData,
        password: "***hidden***",
      });

      const response = await signup(userData);
      console.log("✅ Signup successful:", response);

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("login") },
      ]);
    } catch (err) {
      console.error("❌ Signup failed:", err);
      console.error("❌ Error details:", JSON.stringify(err, null, 2));

      Alert.alert(
        "Signup Failed",
        err?.detail ||
          err?.message ||
          "Unable to create account. Please try again."
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
            placeholderTextColor="#666"
            onChangeText={(value) => handleChange("name", value)}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            placeholderTextColor="#666"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={formData.password}
            placeholderTextColor="#666"
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password *"
            value={formData.confirmPassword}
            placeholderTextColor="#666"
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Location (Optional)"
            value={formData.location}
            placeholderTextColor="#666"
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
                onPress={() => handleChange("calendar_preference", "hindi")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "hindi" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Hindi</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleChange("calendar_preference", "gujarati")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "gujarati" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Gujarati</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handleChange("calendar_preference", "bengali")}
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "bengali" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Bengali</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() =>
                  handleChange("calendar_preference", "rajasthani")
                }
              >
                <View
                  style={[
                    styles.radioCircle,
                    formData.calendar_preference === "rajasthani" &&
                      styles.radioCircleSelected,
                  ]}
                />
                <Text style={styles.radioText}>Rajasthani</Text>
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
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { flexGrow: 1 },
  content: { padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#6B4CE6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6B4CE6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#B8A8F5",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: { color: "#F44336", fontSize: 14 },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: { color: "#666", fontSize: 14 },
  loginLink: { color: "#6B4CE6", fontWeight: "bold", fontSize: 14 },
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
    marginBottom: 8,
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
    borderColor: "#6B4CE6",
  },
  radioCircleSelected: {
    backgroundColor: "#6B4CE6",
  },
  radioText: {
    fontSize: 14,
    color: "#333",
  },
});

export default SignupScreen;
