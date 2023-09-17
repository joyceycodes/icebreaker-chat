# ICEBREAKER
Icebreaker is a game designed to help you break the ice with strangers and turn those awkward moments into memorable interactions.

## [Link to play](https://chingu.sabih.me/)

<kbd>
<img src="https://res.cloudinary.com/dsioshcio/image/upload/v1694896529/Screenshot_2023-09-16_at_13.32.16_osmwwy.png" width="700px" border="1px"/>
</kbd>
<kbd>
 <img src="https://res.cloudinary.com/dsioshcio/image/upload/v1694896530/Screenshot_2023-09-16_at_13.32.30_vitlow.png" width="700px" style="border: 1px solid black"/>
</kbd>

# Technologies
- Next.js + React + Typescript
- Tailwind CSS 
- WebSocket: Pusher Channels 
- Prisma + Vercel Postgres
- UI Library: Mantine
- Testing: Playwright

# Features
- Room creation and deletion
- Shareable Room URL link
- Real-time game updates

# Highlighted Features
### Shareable Room URL Link
<img src="https://res.cloudinary.com/dclcbz6dx/image/upload/v1694990186/firefox_XSp9fygHB0_mxcm7d.gif" width="700px" border="1px"/>

### Real-time game updates
<img src="https://res.cloudinary.com/dclcbz6dx/image/upload/v1694989760/firefox_S9d0a28xp2_gqxx4i.gif" width="700px" border="1px"/>

# Highlighted Code Snippets
### Room Creation
```javascript
export async function POST(req: Request) {
  try {
    const new_room = await prisma.rooms.create({
        data: {
            current_question: 0
        }
    })

    return NextResponse.json({
        room_id: new_room.room_id
    });
  } catch (error) {
    return new NextResponse("Error creating room", { status: 500 });
  }
}
```

### Automated Room Deletion 
```javascript
export async function DELETE(req: Request) {
  try {
    const res = await prisma.rooms.deleteMany({
      where: {
        created_at: {
          lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    return new NextResponse("Successfully deleted expired rooms!", {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Error deleting expired rooms", { status: 500 });
  }
}
```

### Sending Real-time Updates
```javascript
export const PATCH = async (req: Request, { params }: { params: { room_id: string } }) => {
	const room_id = params.room_id;
	const body = await req.json();
	pusherServer.trigger(`${room_id}`, 'setupLoading', '');

	if (body.current_question >= 20) {
		pusherServer.trigger(`${room_id}`, 'finishGame', '');
	}

	try {
		const room_response = await prisma.rooms.update({
			where: {
				room_id: parseInt(room_id),
			},
			data: {
				current_question: {
					increment: 1,
				},
			},
		});

		let current_question_query;
		if (room_response) {
			current_question_query = await prisma.questions.findUnique({
				where: {
					question_id: room_response.current_question,
				},
			});
		}

		if (!room_response || !current_question_query) {
			return new NextResponse("Cannot update the current room's question", { status: 404 });
		}

		pusherServer.trigger(`${room_id}`, 'next-question', {
			question_text: current_question_query.question,
			question_num: room_response.current_question,
		});

		return new NextResponse('', { status: 200 });
	} catch (error) {
		return new Response('failed to update room', { status: 500 });
	}
};

```

### Automated Testing with Playwright
```javascript
test('create room button redirects you to the room page', async ({ page }) => {
	await page.goto(url);

	const button = page.getByRole('button', { name: 'Create Room' });
	const regexRoomUrl = new RegExp(`${url}/room/[0-9]+`);

	button.click();

	await page.waitForURL(regexRoomUrl);

	await expect(page).toHaveURL(regexRoomUrl);
});
```


# Setup
- Run `npm install`
- Set up database
    - Rename `.env.example` to `.env`
    - Follow this guide to make a vercel postgres database: [guide](https://vercel.com/docs/storage/vercel-postgres/quickstart). Follow only until step 2 and copy the database URL.
    - Copy the secrets under the `.env.local` in the vercel postgres dashboard section after creating a database and paste the secrets in your `.env` file
    - Run `npx prisma migrate dev` to create the tables in your database
    - Run `npx prisma db seed` to populate the database with the initial set of questions
- Set up Pusher
    - Create a Pusher account and create a Channels app. 
    - From the Pusher Dashboard, navigate to App Keys. Copy your app_id, key, secret, and cluster.
    - In your `.env` file, paste your keys as follows:
        ```
            PUSHER_APP_ID = "your app_id"
            NEXT_PUBLIC_PUSHER_APP_KEY = "your key"
            PUSHER_APP_SECRET = "your secret"
        ```
    - In `pusher.ts`, update the cluster value to the value from your App Keys.
