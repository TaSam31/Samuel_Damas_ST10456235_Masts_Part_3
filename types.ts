export type RootStackParamList = {
  Home: { 
    newItem?: { 
      dishName: string; 
      description: string; 
      course: string; 
      price: number; 
    };
  };
  AddMenu: undefined;  // No parameters are passed to AddMenu screen
  FilterMenu: { 
    menuItems: { 
      dishName: string; 
      description: string; 
      course: string; 
      price: number; 
    }[];  // A list of menu items passed to the FilterMenu screen
  };
};
