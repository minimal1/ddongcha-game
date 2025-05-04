export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: string;
          created_at: string;
          question_type: 'trivia' | 'movie' | 'photo-year' | 'guess-who';
          question: string;
          image_urls: string[] | null;
          answer: string;
          options: string[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          question_type: 'trivia' | 'movie' | 'photo-year' | 'guess-who';
          question: string;
          image_urls?: string[] | null;
          answer: string;
          options?: string[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          question_type?: 'trivia' | 'movie' | 'photo-year' | 'guess-who';
          question?: string;
          image_urls?: string[] | null;
          answer?: string;
          options?: string[] | null;
        };
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          password: string;
          role: 'admin' | 'user';
        };
        Insert: {
          id?: string;
          created_at?: string;
          email: string;
          password: string;
          role?: 'admin' | 'user';
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          password?: string;
          role?: 'admin' | 'user';
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
