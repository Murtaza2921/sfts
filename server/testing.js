import prisma from './utils/prisma'; // Import your Prisma client (adjust the path as needed)

async function testConnection() {
  try {
    // Simple test query: fetching users or any table you have
    const users = await prisma.user.findMany();
    console.log('Connected to MySQL! Found users:', users);
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}