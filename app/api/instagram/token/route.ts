import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://graph.facebook.com/debug_token?input_token=EAAeUl0ZA85tYBRdtUIE0xigHrMq8zGJKJSDkXK0dsehPxVMFZBXLa18PdZCiyIFy9gWSQSMI5OgDISOMUenmGNktL0Jp7L0CaNYM8ZCF3e8ckOkgXdqZAW2xOZBkZB1PlBw6wN4VLwOHKT2nTv1iKTyuZATouFI1azYNPqp6UwUgDv1ysH5FfOehfQneXAmbb5ZCW4lQaM8sNBkTKQwZDZD&access_token=2133702280537814|11d0034e515439229f7ba59d92428b90'
    );

    if (!response.ok) {
      throw new Error('Unable to fetch facebook data');
    }

    const jsonData = await response.json();

    return NextResponse.json(
      {
        expiration_date: new Date(jsonData.data.data_access_expires_at * 1000),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
