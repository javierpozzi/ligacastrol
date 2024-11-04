export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          logo: string;
          preferences: {
            preferredLocationIds: string[];
            preferredStartHour: number;
            preferredEndHour: number;
          };
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["teams"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["teams"]["Insert"]>;
      };
      leagues: {
        Row: {
          id: string;
          name: string;
          year: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leagues"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["leagues"]["Insert"]>;
      };
      league_teams: {
        Row: {
          id: string;
          league_id: string;
          team_id: string;
          played: number;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          points: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["league_teams"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["league_teams"]["Insert"]>;
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["locations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["locations"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          home_team_id: string;
          away_team_id: string;
          league_id: string;
          location_id: string | null;
          week_number: number;
          date: string | null;
          home_score: number | null;
          away_score: number | null;
          status: "scheduled" | "completed";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["matches"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      players: {
        Row: {
          id: string;
          name: string;
          team_id: string;
          disabled: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["players"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
      };
      match_goals: {
        Row: {
          id: string;
          match_id: string;
          player_id: string | null;
          team_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["match_goals"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["match_goals"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["users"]["Row"];
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
    };
  };
}
