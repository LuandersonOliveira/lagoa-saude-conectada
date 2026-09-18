export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string
          created_by: string | null
          data_hora: string
          id: string
          observacoes: string | null
          paciente_id: string
          servico: string
          servico_outro: string | null
          status: Database["public"]["Enums"]["agendamento_status"]
          tipo: Database["public"]["Enums"]["agendamento_tipo"]
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_hora: string
          id?: string
          observacoes?: string | null
          paciente_id: string
          servico: string
          servico_outro?: string | null
          status?: Database["public"]["Enums"]["agendamento_status"]
          tipo: Database["public"]["Enums"]["agendamento_tipo"]
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_hora?: string
          id?: string
          observacoes?: string | null
          paciente_id?: string
          servico?: string
          servico_outro?: string | null
          status?: Database["public"]["Enums"]["agendamento_status"]
          tipo?: Database["public"]["Enums"]["agendamento_tipo"]
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_saude"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas: {
        Row: {
          ativo: boolean
          bairro_id: string | null
          created_at: string
          created_by: string | null
          descricao: string
          doenca: string
          id: string
          nivel: Database["public"]["Enums"]["alerta_nivel"]
          titulo: string
          zona: Database["public"]["Enums"]["zona_tipo"] | null
        }
        Insert: {
          ativo?: boolean
          bairro_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao: string
          doenca: string
          id?: string
          nivel?: Database["public"]["Enums"]["alerta_nivel"]
          titulo: string
          zona?: Database["public"]["Enums"]["zona_tipo"] | null
        }
        Update: {
          ativo?: boolean
          bairro_id?: string | null
          created_at?: string
          created_by?: string | null
          descricao?: string
          doenca?: string
          id?: string
          nivel?: Database["public"]["Enums"]["alerta_nivel"]
          titulo?: string
          zona?: Database["public"]["Enums"]["zona_tipo"] | null
        }
        Relationships: [
          {
            foreignKeyName: "alertas_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          actor_id: string | null
          created_at: string
          detalhes: Json
          entidade: string
          entidade_id: string | null
          id: string
        }
        Insert: {
          acao: string
          actor_id?: string | null
          created_at?: string
          detalhes?: Json
          entidade: string
          entidade_id?: string | null
          id?: string
        }
        Update: {
          acao?: string
          actor_id?: string | null
          created_at?: string
          detalhes?: Json
          entidade?: string
          entidade_id?: string | null
          id?: string
        }
        Relationships: []
      }
      bairros: {
        Row: {
          id: string
          nome: string
          zona: Database["public"]["Enums"]["zona_tipo"]
        }
        Insert: {
          id?: string
          nome: string
          zona?: Database["public"]["Enums"]["zona_tipo"]
        }
        Update: {
          id?: string
          nome?: string
          zona?: Database["public"]["Enums"]["zona_tipo"]
        }
        Relationships: []
      }
      fila_atendimento: {
        Row: {
          agendamento_id: string | null
          atendente_id: string | null
          created_at: string
          id: string
          paciente_id: string
          prioridade: Database["public"]["Enums"]["prioridade_legal"] | null
          status: Database["public"]["Enums"]["fila_status"]
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          agendamento_id?: string | null
          atendente_id?: string | null
          created_at?: string
          id?: string
          paciente_id: string
          prioridade?: Database["public"]["Enums"]["prioridade_legal"] | null
          status?: Database["public"]["Enums"]["fila_status"]
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          agendamento_id?: string | null
          atendente_id?: string | null
          created_at?: string
          id?: string
          paciente_id?: string
          prioridade?: Database["public"]["Enums"]["prioridade_legal"] | null
          status?: Database["public"]["Enums"]["fila_status"]
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fila_atendimento_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fila_atendimento_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fila_atendimento_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades_saude"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bairro_id: string | null
          cep: string | null
          cns: string | null
          complemento: string | null
          cpf: string
          created_at: string
          data_nascimento: string
          email: string | null
          genero: string
          id: string
          logradouro: string | null
          nome_civil: string
          nome_social: string | null
          numero: string | null
          ponto_referencia: string | null
          prioridades: Database["public"]["Enums"]["prioridade_legal"][]
          raca_cor: string
          responsavel_nome: string | null
          rg: string | null
          status: Database["public"]["Enums"]["user_status"]
          status_motivo: string | null
          telefone: string | null
          updated_at: string
          zona: Database["public"]["Enums"]["zona_tipo"]
        }
        Insert: {
          bairro_id?: string | null
          cep?: string | null
          cns?: string | null
          complemento?: string | null
          cpf: string
          created_at?: string
          data_nascimento: string
          email?: string | null
          genero: string
          id: string
          logradouro?: string | null
          nome_civil: string
          nome_social?: string | null
          numero?: string | null
          ponto_referencia?: string | null
          prioridades?: Database["public"]["Enums"]["prioridade_legal"][]
          raca_cor: string
          responsavel_nome?: string | null
          rg?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          status_motivo?: string | null
          telefone?: string | null
          updated_at?: string
          zona?: Database["public"]["Enums"]["zona_tipo"]
        }
        Update: {
          bairro_id?: string | null
          cep?: string | null
          cns?: string | null
          complemento?: string | null
          cpf?: string
          created_at?: string
          data_nascimento?: string
          email?: string | null
          genero?: string
          id?: string
          logradouro?: string | null
          nome_civil?: string
          nome_social?: string | null
          numero?: string | null
          ponto_referencia?: string | null
          prioridades?: Database["public"]["Enums"]["prioridade_legal"][]
          raca_cor?: string
          responsavel_nome?: string | null
          rg?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          status_motivo?: string | null
          telefone?: string | null
          updated_at?: string
          zona?: Database["public"]["Enums"]["zona_tipo"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
        ]
      }
      transportes: {
        Row: {
          acompanhante: boolean
          created_at: string
          data_hora: string
          destino_cidade: string
          destino_unidade: string
          id: string
          motivo: string
          observacoes: string | null
          paciente_id: string
          status: Database["public"]["Enums"]["transporte_status"]
          updated_at: string
        }
        Insert: {
          acompanhante?: boolean
          created_at?: string
          data_hora: string
          destino_cidade: string
          destino_unidade: string
          id?: string
          motivo: string
          observacoes?: string | null
          paciente_id: string
          status?: Database["public"]["Enums"]["transporte_status"]
          updated_at?: string
        }
        Update: {
          acompanhante?: boolean
          created_at?: string
          data_hora?: string
          destino_cidade?: string
          destino_unidade?: string
          id?: string
          motivo?: string
          observacoes?: string | null
          paciente_id?: string
          status?: Database["public"]["Enums"]["transporte_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transportes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_saude: {
        Row: {
          ativo: boolean
          bairro_id: string | null
          created_at: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          tipo: string
        }
        Insert: {
          ativo?: boolean
          bairro_id?: string | null
          created_at?: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tipo?: string
        }
        Update: {
          ativo?: boolean
          bairro_id?: string | null
          created_at?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "unidades_saude_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      agendamento_status:
        | "agendado"
        | "confirmado"
        | "reagendado"
        | "em_atendimento"
        | "concluido"
        | "cancelado"
      agendamento_tipo: "consulta" | "exame"
      alerta_nivel: "atencao" | "alto" | "critico"
      app_role: "admin" | "atendente" | "paciente"
      fila_status: "aguardando" | "em_atendimento" | "atendido" | "ausente"
      prioridade_legal: "idoso" | "pcd" | "gestante" | "lactante"
      transporte_status: "solicitado" | "aprovado" | "negado" | "concluido"
      user_status: "pendente" | "ativo" | "inativo"
      zona_tipo: "urbana" | "rural"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agendamento_status: [
        "agendado",
        "confirmado",
        "reagendado",
        "em_atendimento",
        "concluido",
        "cancelado",
      ],
      agendamento_tipo: ["consulta", "exame"],
      alerta_nivel: ["atencao", "alto", "critico"],
      app_role: ["admin", "atendente", "paciente"],
      fila_status: ["aguardando", "em_atendimento", "atendido", "ausente"],
      prioridade_legal: ["idoso", "pcd", "gestante", "lactante"],
      transporte_status: ["solicitado", "aprovado", "negado", "concluido"],
      user_status: ["pendente", "ativo", "inativo"],
      zona_tipo: ["urbana", "rural"],
    },
  },
} as const
