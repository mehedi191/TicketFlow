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

const getTicketById = async (ticketId) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  return ticket;
};

const assignTicket = async (ticketId, engineerId) => {
  // Check if the ticket exists
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  // Check if the engineer exists
  const engineer = await prisma.user.findUnique({
    where: {
      id: engineerId,
    },
  });

  if (!engineer) {
    throw new Error("Engineer not found.");
  }

  // Verify the user's role
  if (engineer.role !== "ENGINEER") {
    throw new Error("The selected user is not an engineer.");
  }

  // Assign the ticket
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      assignedToId: engineerId,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return updatedTicket;
};

// Update Ticket Status

const updateTicketStatus = async (
  ticketId,
  status,
  currentUser
) => {
  // Find the ticket
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  // Authorization
  if (currentUser.role === "CUSTOMER") {
    throw new Error(
      "Customers cannot update ticket status."
    );
  }

  if (
    currentUser.role === "ENGINEER" &&
    ticket.assignedToId !== currentUser.id
  ) {
    throw new Error(
      "You are not assigned to this ticket."
    );
  }

  // Allowed status transitions
  const allowedTransitions = {
    OPEN: ["IN_PROGRESS"],
    IN_PROGRESS: ["RESOLVED"],
    RESOLVED: ["CLOSED"],
    CLOSED: [],
  };

  if (!allowedTransitions[ticket.status].includes(status)) {
    throw new Error(
      `Cannot change status from ${ticket.status} to ${status}.`
    );
  }

  // Update ticket
  const updatedTicket = await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return updatedTicket;
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
};