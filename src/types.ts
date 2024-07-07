export interface Meal {
  id?: string;
  time: string;
  description: string;
  calories: number;
}

export interface Time {
  name: string;
  id: string;
}

export const times: Time[] = [
  { name: 'Breakfast', id: 'breakfast' },
  { name: 'Snack', id: 'snack' },
  { name: 'Lunch', id: 'lunch' },
  { name: 'Dinner', id: 'dinner' },
];