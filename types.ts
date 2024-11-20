// types.ts
export type RootStackParamList = {
  Home: { newItem?: { dishName: string; description: string; course: string; price: number } };
  AddMenu: undefined;
  FilterMenu: { menuItems: { dishName: string; description: string; course: string; price: number }[] };
};
