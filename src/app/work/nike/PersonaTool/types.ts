export enum ChatMode {
  INDIVIDUAL = 'INDIVIDUAL',
  FOCUS_GROUP = 'FOCUS_GROUP'
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  tagline: string;
  avatarColor: string;
  systemInstruction: string;
  shortBio: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  senderName?: string;
  content: string;
  timestamp: Date;
}

export interface FollowUp {
  id: string;
  question: string;
}

export interface Topic {
  id: string;
  label: string;
  followUps: FollowUp[];
}

export interface ChatSession {
  id: string;
  mode: ChatMode;
  activePersonaId?: string;
  activePersonaIds?: string[];
  messages: Message[];
  currentTopicId?: string;
  isAskingFollowUp?: boolean;
}