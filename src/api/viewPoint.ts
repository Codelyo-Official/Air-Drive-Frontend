import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ==== TYPES ==== //

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type?: string;
  is_verified?: boolean;
  is_suspended?: boolean;
  // add more user fields as needed
}

export interface Car {
  id: number;
  make: string;
  model: string;
  license_plate: string;
  owner_id: number;
  status: 'pending' | 'available' | 'rejected';
  // add more car fields as needed
}

export interface Booking {
  id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  // add more booking fields as needed
}

export interface Review {
  id: number;
  author_id: number;
  car_id: number;
  rating: number;
  comment: string;
  // add more review fields as needed
}

// ==== USERS VIEWSET (Admin only) ==== //

export const listUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users/');
  return data;
};

export const getUser = async (id: number): Promise<User> => {
  const { data } = await api.get<User>(`/users/${id}/`);
  return data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.post<User>('/users/', userData);
  return data;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const { data } = await api.put<User>(`/users/${id}/`, userData);
  return data;
};

export const partialUpdateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>(`/users/${id}/`, userData);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}/`);
};

// ==== CARS VIEWSET ==== //

export const listCars = async (): Promise<Car[]> => {
  const { data } = await api.get<Car[]>('/cars/');
  return data;
};

export const getCar = async (id: number): Promise<Car> => {
  const { data } = await api.get<Car>(`/cars/${id}/`);
  return data;
};

export const createCar = async (carData: Partial<Car>): Promise<Car> => {
  const { data } = await api.post<Car>('/cars/', carData);
  return data;
};

export const updateCar = async (id: number, carData: Partial<Car>): Promise<Car> => {
  const { data } = await api.put<Car>(`/cars/${id}/`, carData);
  return data;
};

export const partialUpdateCar = async (id: number, carData: Partial<Car>): Promise<Car> => {
  const { data } = await api.patch<Car>(`/cars/${id}/`, carData);
  return data;
};

export const deleteCar = async (id: number): Promise<void> => {
  await api.delete(`/cars/${id}/`);
};

// ==== BOOKINGS VIEWSET ==== //

export const listBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get<Booking[]>('/bookings/');
  return data;
};

export const getBooking = async (id: number): Promise<Booking> => {
  const { data } = await api.get<Booking>(`/bookings/${id}/`);
  return data;
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
  const { data } = await api.post<Booking>('/bookings/', bookingData);
  return data;
};

export const updateBooking = async (id: number, bookingData: Partial<Booking>): Promise<Booking> => {
  const { data } = await api.put<Booking>(`/bookings/${id}/`, bookingData);
  return data;
};

export const partialUpdateBooking = async (id: number, bookingData: Partial<Booking>): Promise<Booking> => {
  const { data } = await api.patch<Booking>(`/bookings/${id}/`, bookingData);
  return data;
};

export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/bookings/${id}/`);
};

// ==== REVIEWS VIEWSET ==== //

export const listReviews = async (): Promise<Review[]> => {
  const { data } = await api.get<Review[]>('/reviews/');
  return data;
};

export const getReview = async (id: number): Promise<Review> => {
  const { data } = await api.get<Review>(`/reviews/${id}/`);
  return data;
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  const { data } = await api.post<Review>('/reviews/', reviewData);
  return data;
};

export const updateReview = async (id: number, reviewData: Partial<Review>): Promise<Review> => {
  const { data } = await api.put<Review>(`/reviews/${id}/`, reviewData);
  return data;
};

export const partialUpdateReview = async (id: number, reviewData: Partial<Review>): Promise<Review> => {
  const { data } = await api.patch<Review>(`/reviews/${id}/`, reviewData);
  return data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/reviews/${id}/`);
};
