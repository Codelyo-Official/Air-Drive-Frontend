// api/supportManagement.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  username: string;
}

interface TicketReply {
  id?: number;
  author: string;
  message: string;
  timestamp?: string;
  created_at?: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  created_at: string;
  updated_at?: string;
  user?: User;
  replies?: TicketReply[];
}

interface CreateTicketPayload {
  subject: string;
  message: string;
}

interface CreateTicketResponse {
  message: string;
  ticket: {
    id: number;
    subject: string;
    status: string;
    created_at: string;
  };
}

interface ReplyPayload {
  message: string;
}

interface ReplyResponse {
  message: string;
  reply: {
    author: string;
    message: string;
    timestamp: string;
  };
}

interface UpdateTicketStatusPayload {
  status: string;
}

interface UpdateTicketStatusResponse {
  message: string;
  ticket: {
    id: number;
    subject: string;
    status: string;
    updated_at: string;
  };
}

export const useSupport = () => {
  const queryClient = useQueryClient();

  // Create Ticket
  const createTicket = useMutation<CreateTicketResponse, Error, CreateTicketPayload>({
    mutationFn: async (payload) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/tickets/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data)?.[0]?.[0] || "Ticket creation failed.";
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Ticket created successfully!");
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
    onError: (error) => {
      console.error("Create Ticket Error:", error);
      toast.error(error.message);
    },
  });

  // Get User's Tickets
  const useUserTickets = () => {
    return useQuery<Ticket[], Error>({
      queryKey: ["userTickets"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/tickets/user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data?.detail || "Failed to fetch tickets.";
          throw new Error(errorMsg);
        }

        return response.json();
      },
    });
  };

  // Get All Tickets (Admin/Support)
  const useAdminTickets = () => {
    return useQuery<Ticket[], Error>({
      queryKey: ["adminTickets"],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/admin/tickets/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data?.detail || "Failed to fetch admin tickets.";
          throw new Error(errorMsg);
        }

        return response.json();
      },
    });
  };

  // Get Ticket Replies
  const useTicketReplies = (ticketId: number) => {
    return useQuery<TicketReply[], Error>({
      queryKey: ["ticketReplies", ticketId],
      queryFn: async () => {
        const token = localStorage.getItem("authToken");

        const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/replies/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          const errorMsg = data?.detail || "Failed to fetch ticket replies.";
          throw new Error(errorMsg);
        }

        return response.json();
      },
      enabled: !!ticketId,
    });
  };

  // Add Reply to Ticket
  const addReply = useMutation<ReplyResponse, Error, { ticketId: number; payload: ReplyPayload }>({
    mutationFn: async ({ ticketId, payload }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/reply/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data)?.[0]?.[0] || "Failed to send reply.";
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: (_, { ticketId }) => {
      toast.success("Reply sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["ticketReplies", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
    },
    onError: (error) => {
      console.error("Add Reply Error:", error);
      toast.error(error.message);
    },
  });

  // Update Ticket Status (Admin/Support)
  const updateTicketStatus = useMutation<UpdateTicketStatusResponse, Error, { ticketId: number; payload: UpdateTicketStatusPayload }>({
    mutationFn: async ({ ticketId, payload }) => {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data)?.[0]?.[0] || "Failed to update ticket status.";
        throw new Error(errorMsg);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success(`Ticket status updated`);
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
    onError: (error) => {
      console.error("Update Ticket Status Error:", error);
      toast.error(error.message);
    },
  });

  return {
    createTicket,
    useUserTickets,
    useAdminTickets,
    useTicketReplies,
    addReply,
    updateTicketStatus,
  };
};

// Helper function to create ticket payload
export const createTicketPayload = (ticketData: {
  subject: string;
  message: string;
}): CreateTicketPayload => {
  return {
    subject: ticketData.subject,
    message: ticketData.message,
  };
};

// Helper function to create reply payload
export const createReplyPayload = (message: string): ReplyPayload => {
  return {
    message,
  };
};

// Helper function to create status update payload
export const createStatusUpdatePayload = (status: string): UpdateTicketStatusPayload => {
  return {
    status,
  };
};

// Constants for ticket statuses
export const TICKET_STATUSES = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;

export type TicketStatus = typeof TICKET_STATUSES[keyof typeof TICKET_STATUSES];