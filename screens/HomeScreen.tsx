import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
  const [menuItems, setMenuItems] = useState<{ dishName: string; description: string; course: string; price: number }[]>([]);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const savedMenuItems = await AsyncStorage.getItem('menuItems');
        if (savedMenuItems) {
          setMenuItems(JSON.parse(savedMenuItems));
        }
      } catch (error) {
        console.error('Error loading menu items from AsyncStorage:', error);
      }
    };

    loadMenuItems();
  }, []);

  const saveMenuItems = async (items: { dishName: string; description: string; course: string; price: number }[]) => {
    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving menu items to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    if (route.params?.newItem) {
      const newItem = route.params.newItem as { dishName: string; description: string; course: string; price: number };
      const updatedMenuItems = [...menuItems, newItem];
      setMenuItems(updatedMenuItems);
      saveMenuItems(updatedMenuItems);
    }
  }, [route.params?.newItem]);

  const deleteItem = (index: number) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {
            const updatedMenuItems = menuItems.filter((_, itemIndex) => itemIndex !== index);
            setMenuItems(updatedMenuItems);
            saveMenuItems(updatedMenuItems);
          }
        },
      ],
      { cancelable: true }
    );
  };

  // Calculate average prices by course
  const calculateAveragePrice = (course: string) => {
    const filteredItems = menuItems.filter(item => item.course === course);
    const totalPrice = filteredItems.reduce((sum, item) => sum + item.price, 0);
    return filteredItems.length > 0 ? totalPrice / filteredItems.length : 0;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chef's Menu</Text>
      
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddMenu')}>
        <Text style={styles.buttonText}>Add Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('FilterMenu', { menuItems })}>
        <Text style={styles.buttonText}>Filter Menu</Text>
      </TouchableOpacity>

      <Text style={styles.itemCount}>Total Items: {menuItems.length}</Text>
      <ScrollView></ScrollView>
      <Text style={styles.avgPrice}>Average Price by Course:</Text>
      {['Starters', 'Mains', 'Desserts'].map(course => (
        <Text key={course} style={styles.avgPriceText}>
          {course}: R{calculateAveragePrice(course).toFixed(2)}
        </Text>
      ))}

      {menuItems.length === 0 ? (
        <Text style={styles.emptyMessage}>No dishes available. Add a dish to the menu!</Text>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item, index) => item.dishName + index}
          renderItem={({ item, index }) => (
            <View style={styles.menuItem}>
              <Text style={styles.dishName}>{item.dishName} - {item.course}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
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
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 40,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
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