import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ReadingData, Language, Saint, Homily} from './src/types';
import {fetchReadings} from './src/utils/readingsApi';
import {geminiService} from './src/services/geminiService';
import {languages} from './src/utils/languages';

function App(): JSX.Element {
  const [readings, setReadings] = useState<ReadingData | null>(null);
  const [saint, setSaint] = useState<Saint | null>(null);
  const [homily, setHomily] = useState<Homily | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [loadingSaint, setLoadingSaint] = useState(true);
  const [loadingHomily, setLoadingHomily] = useState(false);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    loadReadings();
    loadSaintOfTheDay();
  }, []);

  useEffect(() => {
    if (readings && !homily && !loadingHomily) {
      generateHomily();
    }
  }, [readings]);

  const loadReadings = async () => {
    try {
      const data = await fetchReadings();
      setReadings(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load readings');
      console.error('Error loading readings:', error);
    } finally {
      setLoadingReadings(false);
    }
  };

  const loadSaintOfTheDay = async () => {
    try {
      const saintData = await geminiService.getSaintOfTheDay(currentDate);
      setSaint(saintData);
    } catch (error) {
      setSaint({
        name: 'Saint of the Day',
        feast: 'Daily Commemoration',
        biography: 'Today we remember all the saints who have gone before us.',
      });
    } finally {
      setLoadingSaint(false);
    }
  };

  const generateHomily = async () => {
    if (!readings) return;

    setLoadingHomily(true);
    try {
      const content = await geminiService.generateHomily(readings, selectedLanguage);
      setHomily({
        content,
        language: selectedLanguage,
        generatedAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to generate homily');
      console.error('Error generating homily:', error);
    } finally {
      setLoadingHomily(false);
    }
  };

  const formatReading = (text: string) => {
    return text.split('\n').map((line, index) => (
      <Text key={index} style={styles.readingText}>
        {line}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="church" size={32} color="#fbbf24" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Daily Mass Companion</Text>
            <Text style={styles.subtitle}>Readings • Saints • AI Homilies</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Readings Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="book" size={24} color="#fbbf24" />
            <Text style={styles.cardTitle}>Daily Mass Readings</Text>
          </View>
          
          {loadingReadings ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.loadingText}>Loading readings...</Text>
            </View>
          ) : readings ? (
            <View style={styles.readingsContainer}>
              <View style={styles.readingSection}>
                <Text style={styles.readingTitle}>First Reading</Text>
                <Text style={styles.readingSource}>{readings.Mass_R1.source}</Text>
                {formatReading(readings.Mass_R1.text)}
              </View>

              <View style={styles.readingSection}>
                <Text style={styles.readingTitle}>Responsorial Psalm</Text>
                <Text style={styles.readingSource}>{readings.Mass_Ps.source}</Text>
                {formatReading(readings.Mass_Ps.text)}
              </View>

              {readings.Mass_R2 && (
                <View style={styles.readingSection}>
                  <Text style={styles.readingTitle}>Second Reading</Text>
                  <Text style={styles.readingSource}>{readings.Mass_R2.source}</Text>
                  {formatReading(readings.Mass_R2.text)}
                </View>
              )}

              <View style={styles.readingSection}>
                <Text style={styles.readingTitle}>Gospel</Text>
                <Text style={styles.readingSource}>{readings.Mass_G.source}</Text>
                {formatReading(readings.Mass_G.text)}
              </View>
            </View>
          ) : (
            <Text style={styles.errorText}>Failed to load readings</Text>
          )}
        </View>

        {/* Saint Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="star" size={24} color="#fbbf24" />
            <Text style={styles.cardTitle}>Saint of the Day</Text>
          </View>
          
          {loadingSaint ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.loadingText}>Loading saint...</Text>
            </View>
          ) : saint ? (
            <View>
              <Text style={styles.saintName}>{saint.name}</Text>
              <Text style={styles.saintFeast}>{saint.feast}</Text>
              <Text style={styles.saintBiography}>{saint.biography}</Text>
            </View>
          ) : (
            <Text style={styles.errorText}>Failed to load saint information</Text>
          )}
        </View>

        {/* Homily Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="lightbulb-outline" size={24} color="#fbbf24" />
            <Text style={styles.cardTitle}>AI-Generated Homily</Text>
          </View>
          
          {loadingHomily ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.loadingText}>Generating homily...</Text>
            </View>
          ) : homily ? (
            <View>
              <Text style={styles.homilyText}>{homily.content}</Text>
              <TouchableOpacity style={styles.regenerateButton} onPress={generateHomily}>
                <Icon name="refresh" size={20} color="#fff" />
                <Text style={styles.buttonText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.errorText}>Failed to generate homily</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#cbd5e1',
    marginTop: 12,
  },
  readingsContainer: {
    gap: 24,
  },
  readingSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
    paddingLeft: 16,
  },
  readingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  readingSource: {
    fontSize: 14,
    color: '#fbbf24',
    marginBottom: 12,
    fontWeight: '500',
  },
  readingText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 8,
  },
  saintName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 4,
  },
  saintFeast: {
    fontSize: 14,
    color: '#fbbf24',
    marginBottom: 12,
    fontWeight: '500',
  },
  saintBiography: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  homilyText: {
    fontSize: 14,
    color: '#f1f5f9',
    lineHeight: 22,
    marginBottom: 16,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default App;