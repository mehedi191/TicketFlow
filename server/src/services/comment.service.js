const prisma = require("../config/prisma");

const addComment = async (ticketId, message, currentUser) => {
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
    if (ticket.createdById !== currentUser.id) {
      throw new Error("You can only comment on your own tickets.");
    }
  }

  if (currentUser.role === "ENGINEER") {
    if (ticket.assignedToId !== currentUser.id) {
      throw new Error("You are not assigned to this ticket.");
    }
  }

  // ADMIN can comment on any ticket

  // Create the comment
  const comment = await prisma.comment.create({
    data: {
      message,
      ticketId,
      userId: currentUser.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return comment;
};

const getComments = async (ticketId, currentUser) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  // Authorization
  if (
    currentUser.role === "CUSTOMER" &&
    ticket.createdById !== currentUser.id
  ) {
    throw new Error("Access denied.");
  }

  if (
    currentUser.role === "ENGINEER" &&
    ticket.assignedToId !== currentUser.id
  ) {
    throw new Error("Access denied.");
  }

  const comments = await prisma.comment.findMany({
    where: {
      ticketId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return comments;
};

module.exports = {
  addComment,
  getComments,
};