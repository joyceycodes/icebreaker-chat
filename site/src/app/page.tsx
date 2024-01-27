"use client"
import { Buttons } from "@/components/Buttons";
import { Display } from "@/components/Display";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

	async function createRoom() {
    const res = await fetch('/api/room', {
      method: 'POST',
    });
    if (res.ok) {
      const { room_id } = await res.json();
      router.push(`/room/${room_id}`);
    } else {
      console.log('Failed to create room');
      router.push(`/error`);
    }
	}
  
  return (
      <>
        {/* Display */}
        <div className="mb-6 text-center">
          <Display text="Break the ice with fun questions!" />
        </div>

        {/* Buttons */}
        <div className="text-center">
            <Buttons onClick={createRoom} text='Create Room' size='lg' />
        </div>
      </>
  );
}
