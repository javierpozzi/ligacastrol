import { useCallback, useEffect, useState } from "react";
import { Location } from "../types";
import { RepositoryFactory } from "../repositories/factory";
import { LocationService } from "../services/location-service";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const locationService = new LocationService(RepositoryFactory.getLocationRepository());

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await locationService.getAllLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load locations"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return { locations, loading, error, reloadLocations: loadLocations };
}
