import { getAllGyms } from "@/lib/api";
import { Gym } from "@/types/gym";
import GymList from "@/components/GymList";

export default async function HomePage() {
  let gyms: Gym[] = [];

  try {
    gyms = await getAllGyms();
    console.log(gyms);
  } catch (error) {
    console.error("Failed to fetch gyms:", error);
  }


  return (
    <div className="flex h-full bg-[#0f2133]">
      <GymList gyms={gyms} />
    </div>
  );
}