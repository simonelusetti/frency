export type User = {
  id: number;
  email: string;
  role: "player" | "scout";
  created_at: string;
  player_profile_id?: number | null;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type Video = {
  id: number;
  player_id?: number;
  title: string;
  description?: string | null;
  file_path: string;
  uploaded_at: string;
};

export type Document = {
  id: number;
  player_id?: number;
  title: string;
  document_type?: string | null;
  file_path: string;
  visibility: string;
  uploaded_at: string;
};

export type PlayerCard = {
  id: number;
  user_id: number;
  full_name: string;
  age: number;
  nationality: string;
  current_team?: string | null;
  primary_role: string;
  secondary_role?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  preferred_foot?: string | null;
  bio?: string | null;
  availability_status?: string | null;
  profile_image_path?: string | null;
};

export type PlayerProfile = PlayerCard & {
  date_of_birth: string;
  videos: Video[];
  documents?: Document[];
};

export type SavedPlayersResponse = {
  players: PlayerCard[];
};

export type ScoutNote = {
  player_id: number;
  note: string;
  created_at: string;
  updated_at: string;
};
