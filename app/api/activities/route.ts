import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const activitiesSnapshot = await db.collection('activities')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    const activities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, action } = await request.json();
    const newActivity = await db.collection('activities').add({
      userId,
      action,
      timestamp: new Date(),
    });
    return NextResponse.json({ id: newActivity.id, userId, action }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}