// utils/validations.ts

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Example validation: at least 8 characters
  return password.length >= 8;
};

// Add more validations as needed, such as for username, etc.
