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

const getAllTicketsService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Search
  if (query.search) {
    where.OR = [
      {
        title: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Status filter
  if (query.status) {
    where.status = query.status;
  }

  // Priority filter
  if (query.priority) {
    where.priority = query.priority;
  }

  // Engineer filter
  if (query.engineerId) {
    where.assignedToId = query.engineerId;
  }

  // Sorting
  const orderBy = {
    createdAt: query.sort === "oldest" ? "asc" : "desc",
  };

  const tickets = await prisma.ticket.findMany({
    where,
    skip,
    take: limit,
    orderBy,
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

  const total = await prisma.ticket.count({
    where,
  });

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDashboardService = async () => {
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    priorityStats,
  ] = await Promise.all([
    prisma.ticket.count(),

    prisma.ticket.count({
      where: { status: "OPEN" },
    }),

    prisma.ticket.count({
      where: { status: "IN_PROGRESS" },
    }),

    prisma.ticket.count({
      where: { status: "RESOLVED" },
    }),

    prisma.ticket.count({
      where: { status: "CLOSED" },
    }),

    prisma.ticket.groupBy({
      by: ["priority"],
      _count: {
        priority: true,
      },
    }),
  ]);

  const ticketsByPriority = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  priorityStats.forEach((item) => {
    ticketsByPriority[item.priority] = item._count.priority;
  });

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    ticketsByPriority,
  };
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  assignTicket,
  updateTicketStatus,
  getAllTicketsService,
  getDashboardService,
};