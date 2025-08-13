export interface User {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

export interface NetworkingContact {
  id: string;
  name: string;
  details: string;
  remarks: string;
  date: string;
  userId: string;
  isSkipped?: boolean;
  skipReason?: string;
}

export interface InfoContact {
  id: string;
  networkingContactId: string;
  contactName: string;
  response: 'A' | 'B' | 'C';
  remarks: string;
  date: string;
  userId: string;
}

export interface ReinfoContact {
  id: string;
  infoContactId: string;
  contactName: string;
  remarks: string;
  date: string;
  userId: string;
}

export interface ProspectingContact {
  id: string;
  sourceContactId: string;
  contactName: string;
  storyShared: string;
  response: string;
  remarks: string;
  date: string;
  userId: string;
}

export interface InviContact {
  id: string;
  prospectingContactId: string;
  contactName: string;
  response: 'Yes' | 'No';
  date: string;
  userId: string;
  skipExplanations?: string[];
}