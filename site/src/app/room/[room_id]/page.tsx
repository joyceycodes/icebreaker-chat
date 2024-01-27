"use client";

import { Buttons } from '@/components/Buttons';
import { CopyLink } from '@/components/CopyLink';
import { Display } from '@/components/Display';
import { pusherClient } from '@/lib/pusher';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function Home() {

	const path = usePathname();
	const roomId = (path.split('/')[2])
	const [questionText, setQuestionText] = useState('')

	useEffect(() => {
		// getting the current question text of the room
		fetch(`/api/room/${roomId}`)
		.then(response => response.json())
		.then(data => {
			setQuestionText(data.current_question_text);
		})
		.catch(error => console.error('Error:', error));

		// subcribe to the proper channel
		pusherClient.subscribe(`${roomId}`)

		// question text coming from the server
		const questionTextHandler = (question_text: string) => {
			setQuestionText(() => question_text)
		}

		pusherClient.bind('next-question', questionTextHandler)

		return () => {
			pusherClient.unsubscribe(`${roomId}`)
			pusherClient.unbind('next-question', questionTextHandler)
		}
	})


	const nextQuestionText = async () => {
		await fetch(`/api/room/${roomId}`, {
			method: 'PATCH',
		  })
}

return (
	<>
        <div style={{ display: questionText.includes("Waiting for the game to start...") ? "" : "none" }}
		className="mb-6 text-center" >
			<CopyLink hostName={window.location.hostname} />
		</div>
        <div className="mb-6 text-center">
          <Display text={questionText} />
        </div>
        <div className="mb-6 text-center">
			{questionText.includes("Waiting for the game to start...") &&
			 <Buttons text='Start Game' size='lg' onClick={nextQuestionText} />
			}
			{!questionText.includes("That's all, thanks for playing!") && !questionText.includes("Waiting for the game to start...")
			 && <Buttons text='Next question' size='lg' onClick={nextQuestionText} />
			}
		</div>
	</>
   
  );

}
