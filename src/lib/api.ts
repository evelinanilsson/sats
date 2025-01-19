import { Gym } from "@/types/gym";

export const getAllGyms = async (): Promise<Gym[]> => {
  try {
    const response = await fetch("https://hfnapi.sats.com/clubs-v2/sats/clubs/");
    if (!response.ok) {
      throw new Error("Failed to fetch gym data");
    }

    const data = await response.json();

    return data.clubs.map((club: Gym) => ({
      id: club.id,
      name: club.name,
      address: {
        country: club.address.country || "Unknown",
        city: club.address.city || "Unknown",
        address1: club.address.address1 || "Unknown",
        postalCode: club.address.postalCode || "Unknown"
      },
      geoLocation: club.geoLocation
        ? {
            latitude: club.geoLocation.latitude ?? undefined,
            longitude: club.geoLocation.longitude ?? undefined,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching gyms:", error);
    throw error;
  }
};

