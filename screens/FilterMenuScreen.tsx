import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type FilterMenuScreenProps = NativeStackScreenProps<RootStackParamList, 'FilterMenu'>;

export default function FilterMenuScreen({ route }: FilterMenuScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<
    { dishName: string; description: string; course: string; price: number }[]
  >([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const menuItems = route.params?.menuItems || [];
  const categories = ['Starters', 'Mains', 'Desserts'];

  useEffect(() => {
    setFilteredItems(menuItems);
  }, [menuItems]);

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

    const results = menuItems.filter(
      (item) =>
        item.dishName.toLowerCase().includes(lowerSearchTerm) &&
        (selectedCategory ? item.course === selectedCategory : true) &&
        (minPrice ? item.price >= parseFloat(minPrice) : true) &&
        (maxPrice ? item.price <= parseFloat(maxPrice) : true) &&
        item.description.toLowerCase().includes(lowerSearchTerm)
    );

    if (results.length === 0) {
      setFilteredItems([]);
    } else {
      setFilteredItems(results);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('');
    setFilteredItems(menuItems);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setDropdownVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
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

          {/* Category Dropdown */}
          <Text style={styles.filterHeading}>Category:</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
            <Text style={styles.dropdownButtonText}>
              {selectedCategory || 'Select a Category'}
            </Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.dropdownItem}
                  onPress={() => selectCategory(category)}
                >
                  <Text style={styles.dropdownItemText}>{category}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => selectCategory('')}
              >
                <Text style={styles.dropdownItemText}>All Categories</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Apply Filters Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleSearch}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>

          {/* Reset Filters Button */}
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
            
            <ScrollView></ScrollView>
          {/* Display Filtered Results */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item.dishName} - {item.course}</Text>
                <Text style={styles.menuItemText}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.noResults}>
                  No results found. Please contact customer support if you require assistance.
                </Text>
              </View>
            }
          />
          
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  filterHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  dropdownItemText: {
    color: '#343a40',
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  menuItemText: {
    fontSize: 16,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noResults: {
    color: '#dc3545',
    textAlign: 'center',
  },
});
