import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Load menu items from AsyncStorage
  const loadMenuItems = async () => {
    try {
      const storedMenu = await AsyncStorage.getItem('menuItems');
      const parsedMenu = storedMenu ? JSON.parse(storedMenu) : [];
      setMenuItems(parsedMenu);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  // Delete item by index
  const deleteItem = async (index: number) => {
    const updatedMenu = menuItems.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedMenu));
      setMenuItems(updatedMenu); // Update state
      Alert.alert('Success', 'Dish removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Calculate average price by course
  const calculateAveragePrice = (course: string) => {
    const filteredItems = menuItems.filter((item) => item.course === course);
    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
    return filteredItems.length > 0 ? totalPrice / filteredItems.length : 0;
  };

  // Load menu items whenever the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadMenuItems);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu</Text>

      {/* Logo */}
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

      {/* Add Menu Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMenu')}>
        <Text style={styles.buttonText}>Add Menu</Text>
      </TouchableOpacity>

      {/* Filter Menu Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('FilterMenu', { menuItems })}>
        <Text style={styles.buttonText}>Filter Menu</Text>
      </TouchableOpacity>

      {/* Total Items Count */}
      <Text style={styles.itemCount}>Total Items: {menuItems.length}</Text>

      {/* Average Price by Course */}
      <ScrollView>
        <Text style={styles.avgPrice}>Average Price by Course:</Text>
        {['Starters', 'Mains', 'Desserts'].map((course) => (
          <Text key={course} style={styles.avgPriceText}>
            {course}: R{calculateAveragePrice(course).toFixed(2)}
          </Text>
        ))}
      </ScrollView>

      {/* Menu Items List */}
      {menuItems.length === 0 ? (
        <Text style={styles.emptyMessage}>No dishes available. Add a dish to the menu!</Text>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.menuItem}>
              <Text style={styles.dishName}>{item.dishName}</Text>
              <Text>{item.description}</Text>
              <Text>{item.course}</Text>
              <Text>{`R${item.price.toFixed(2)}`}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(index)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    margin: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
  },
  avgPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 20,
  },
  avgPriceText: {
    fontSize: 18,
    color: '#343a40',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#343a40',
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
