import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const getRandomChampion = async () => {
  try {
    const response = await fetch(
      'https://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json'
    );
    const data = await response.json();
    const champions = Object.keys(data.data);
    const randomIndex = Math.floor(Math.random() * champions.length);
    const randomChampion = champions[randomIndex];
    return data.data[randomChampion];
  } catch (error) {
    console.error('Error fetching champion:', error);
  }
};

const HomeScreen = ({ navigation }) => {
  const [randomChampion, setRandomChampion] = useState(null);

  const generateRandomChampion = async () => {
    const champion = await getRandomChampion();
    setRandomChampion(champion);
    navigation.navigate('Image', { champion });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Gerar Imagem de Campeão Aleatório"
        onPress={generateRandomChampion}
      />
    </View>
  );
};

const ImageScreen = ({ navigation }) => {
  const champion = navigation.getParam('champion');

  const goBack = () => {
    navigation.goBack();
  };

  if (!champion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>Nenhum campeão encontrado.</Text>
        <Button title="Voltar" onPress={goBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/${champion.image.full}`,
        }}
        style={styles.championImage}
      />
      <Text style={styles.championName}>{champion.name}</Text>
      <Button title="Voltar" onPress={goBack} />
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Image: ImageScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
  return <AppContainer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 18,
    marginBottom: 10,
  },
  championImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  championName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
