import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type FilterMenuScreenProps = NativeStackScreenProps<RootStackParamList, 'FilterMenu'>;

export default function FilterMenuScreen({ route }: FilterMenuScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<{ dishName: string, description: string, course: string, price: number }[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Access menuItems passed from HomeScreen
  const menuItems = route.params?.menuItems || [];

  const categories = ['Starters', 'Mains', 'Desserts'];

  const validateFilterInputs = (minPrice: string, maxPrice: string) => {
    if ((minPrice && isNaN(Number(minPrice))) || (maxPrice && isNaN(Number(maxPrice)))) {
      alert('Please enter valid numbers for price.');
      return false;
    }
    return true;
  };

  const handleSearch = () => {
    if (!validateFilterInputs(minPrice, maxPrice)) return;

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    const results = menuItems.filter(item =>
      item.dishName.toLowerCase().includes(lowerSearchTerm) &&
      (selectedCategory ? item.course === selectedCategory : true) &&
      (minPrice ? item.price >= parseFloat(minPrice) : true) &&
      (maxPrice ? item.price <= parseFloat(maxPrice) : true) &&
      item.description.toLowerCase().includes(lowerSearchTerm)
    );

    if (results.length === 0) {
      setFilteredItems([]); // Clear previous results if no items found
    } else {
      setFilteredItems(results);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Menu</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by dish name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Price Filters */}
      <View style={styles.priceContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
      </View>

      {/* Category Filter */}
      <Text>Select Category:</Text>
      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <Button
            key={category}
            title={category}
            onPress={() => setSelectedCategory(category)}
            color={selectedCategory === category ? '#007bff' : '#6c757d'}
          />
        ))}
        <Button title="All Categories" onPress={() => setSelectedCategory('')} />
      </View>

      {/* Apply Filters Button */}
      <Button title="Apply Filters" onPress={handleSearch} />

      {/* Display Filtered Results */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - {item.course}</Text>
            <Text>{item.description}</Text>
            <Text>R{item.price.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>
            No results found. Please contact customer support if you require assistance.
          </Text>
        }
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
    paddingVertical: 10,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  noResults: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
});
