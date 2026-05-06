export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    creatorEmail: string;
    assignedTechnicianEmail: string | null;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    slaBreached: boolean;
  }