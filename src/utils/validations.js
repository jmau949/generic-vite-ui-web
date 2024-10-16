// utils/validations.js

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Example validation: at least 8 characters
  return password.length >= 8;
};

// Add more validations as needed, such as for username, etc.
