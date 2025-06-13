const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Dodaj losowe membershipId jeśli nie istnieje
function generateMembershipId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

const users = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
    name: 'Admin',
    surname: 'User',
    phoneNumber: '123456789',
    birthDate: new Date('1990-01-01'),
    borrowedBooks: [],
    reservedBooks: [],
    membershipId: generateMembershipId()
  },
  {
    email: 'librarian@example.com',
    password: 'librarian123',
    role: 'Librarian',
    name: 'Librarian',
    surname: 'User',
    phoneNumber: '987654321',
    birthDate: new Date('1992-05-15'),
    borrowedBooks: [],
    reservedBooks: [],
    membershipId: generateMembershipId()
  },
  {
    email: 'user@example.com',
    password: 'user123',
    role: 'User',
    name: 'Regular',
    surname: 'User',
    phoneNumber: '555666777',
    birthDate: new Date('1995-12-31'),
    borrowedBooks: [],
    reservedBooks: [],
    membershipId: generateMembershipId()
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});

    // Hashuj hasła i dodaj użytkowników
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    await User.insertMany(hashedUsers);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
