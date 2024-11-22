import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const courses = ['Starters', 'Mains', 'Desserts'];
const PIN = '1234'; // Replace with the desired PIN

type AddMenuScreenProps = NativeStackScreenProps<RootStackParamList, 'AddMenu'>;

export default function AddMenuScreen({ navigation }: AddMenuScreenProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(courses[0]);
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  // Load existing menu items from AsyncStorage
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const existingMenu = await AsyncStorage.getItem('menuItems');
        const parsedMenu = existingMenu ? JSON.parse(existingMenu) : [];
        setMenuItems(parsedMenu);
      } catch (error) {
        console.error('Error loading menu items:', error);
      }
    };
    loadMenuItems();
  }, []);

  // Authenticate user with PIN
  const handlePinSubmit = () => {
    if (enteredPin === PIN) {
      setIsAuthenticated(true);
    } else {
      Alert.alert('Error', 'Invalid PIN. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!dishName || !description || !price || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Validation Error', 'Please fill in all fields with valid data.');
      return;
    }

    const newItem = { dishName, description, course, price: parseFloat(price) };
    const updatedMenu = [...menuItems, newItem];

    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedMenu));
      setMenuItems(updatedMenu); // Update state with the new menu
      Alert.alert('Success', 'Dish added successfully!');
      setDishName('');
      setDescription('');
      setCourse(courses[0]);
      setPrice('');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  // Render menu items
  const renderMenuItem = ({ item }: { item: any }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>
        {item.dishName} - {item.course} - R{item.price.toFixed(2)}
      </Text>
    </View>
  );

  // Handle item removal
  const handleRemoveItem = async (index: number) => {
    const updatedMenu = menuItems.filter((_, i) => i !== index);

    try {
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedMenu));
      setMenuItems(updatedMenu); // Update state after removal
      Alert.alert('Success', 'Dish removed successfully!');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Enter PIN:</Text>
        <TextInput
          style={styles.input}
          value={enteredPin}
          onChangeText={setEnteredPin}
          placeholder="Enter PIN"
          keyboardType="numeric"
          secureTextEntry
        />
        <TouchableOpacity style={styles.addButton} onPress={handlePinSubmit}>
          <Text style={styles.buttonText}>Submit PIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dish Name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDishName}
        value={dishName}
        placeholder="Enter dish name"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        placeholder="Enter description"
      />

      <Text style={styles.label}>Course:</Text>
      <Picker style={styles.picker} selectedValue={course} onValueChange={setCourse}>
        {courses.map((course) => (
          <Picker.Item key={course} label={course} value={course} />
        ))}
      </Picker>

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPrice}
        value={price}
        placeholder="Enter price"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      <Text style={styles.menuTitle}>Current Menu:</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>
              {item.dishName} - {item.course} - R{item.price.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
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
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#343a40',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#495057',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
