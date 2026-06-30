const prisma = require("../config/prisma");

const createTicket = async ({
  title,
  description,
  priority,
  userId,
}) => {
  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      priority,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return ticket;
};

const getMyTickets = async (userId) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      createdById: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return tickets;
};

module.exports = {
  createTicket,
  getMyTickets,
};