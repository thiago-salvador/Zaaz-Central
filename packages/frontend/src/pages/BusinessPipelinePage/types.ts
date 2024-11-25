export interface Deal {
  id: string;
  name: string;
  value: number;
  probability: number;
  stage: string;
  company: string;
  dueDate: string;
  contacts: string[];
  description?: string;
  notes?: string;
  lastUpdated?: string;
  createdAt?: string;
  assignedTo?: string;
  tags?: string[];
}
