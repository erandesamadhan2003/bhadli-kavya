import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  
  const features = [
    {
      title: "Poetry Collection",
      description: "Discover beautiful poems from various poets and traditions",
      icon: "📖"
    },
    {
      title: "Literary Works",
      description: "Explore classic and contemporary literary masterpieces",
      icon: "📜"
    },
    {
      title: "Cultural Heritage",
      description: "Connect with rich traditions of poetry and literature",
      icon: "🏛️"
    },
    {
      title: "Reading Experience",
      description: "Enjoy a peaceful and immersive reading environment",
      icon: "🌸"
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>📚</Text>
          </View>
          <Text style={styles.title}>Bhadli Kavya</Text>
          <Text style={styles.titleGujarati}>ભદલી કાવ્ય</Text>
          <Text style={styles.subtitle}>Beautiful Poetry Collection</Text>
          <Text style={styles.description}>
            Immerse yourself in the world of beautiful poetry. 
            Discover timeless verses that touch the heart and soul.
          </Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            "Poetry is the language of the heart, 
            speaking truths that prose cannot express."
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Explore & Discover</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{feature.icon}</Text>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.startButtonText}>Start Reading</Text>
          <Text style={styles.startButtonEmoji}>📖</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "Where beautiful words create lasting memories"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light theme background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  titleGujarati: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#34495e',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#5a6c7d',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  quoteContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quoteText: {
    fontSize: 18,
    color: '#2c3e50',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  featureIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#e8f3ff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 15,
    color: '#5a6c7d',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  startButtonEmoji: {
    fontSize: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  footerText: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});