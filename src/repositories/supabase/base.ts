import { SupabaseClient } from "@supabase/supabase-js";
import { Repository } from "../types";
import { supabase } from "../../config/supabase";
import { EntityNotFoundError } from "../../utils/error";
import { Database } from "../../config/database.types";

export abstract class SupabaseBaseRepository<T extends { id: string }> implements Repository<T> {
  protected client: SupabaseClient<Database>;

  constructor(protected table: string) {
    this.client = supabase;
  }

  protected abstract transformFromDb(row: unknown): T;
  protected abstract transformToDb(data: Omit<T, "id">): unknown;

  async getAll(): Promise<T[]> {
    const { data, error } = await this.client.from(this.table).select("*");

    if (error) throw error;
    return data.map(row => this.transformFromDb(row));
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.client.from(this.table).select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data ? this.transformFromDb(data) : null;
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const dbData = this.transformToDb(data);
    const { data: created, error } = await this.client.from(this.table).insert([dbData]).select().single();

    if (error) throw error;
    if (!created) throw new Error("Failed to create record");

    return this.transformFromDb(created);
  }

  async update(id: string, updates: Partial<Omit<T, "id">>): Promise<T> {
    const dbData = this.transformToDb({ ...updates } as Omit<T, "id">);
    const { data: updated, error } = await this.client.from(this.table).update(dbData).eq("id", id).select().single();

    if (error) throw error;
    if (!updated) throw new EntityNotFoundError(this.table, id);

    return this.transformFromDb(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(this.table).delete().eq("id", id);

    if (error) throw error;
  }
}
