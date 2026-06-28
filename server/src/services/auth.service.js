const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");

const registerUser = async ({ name, email, password, role = "CUSTOMER" }) => {
  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

module.exports = {
  registerUser,
};