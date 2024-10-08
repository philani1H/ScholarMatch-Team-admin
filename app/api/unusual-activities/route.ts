import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const unusualActivitiesSnapshot = await db.collection('unusualActivities')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    const unusualActivities = unusualActivitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(unusualActivities);
  } catch (error) {
    console.error('Error fetching unusual activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, action, severity } = await request.json();
    const newUnusualActivity = await db.collection('unusualActivities').add({
      userId,
      action,
      severity,
      timestamp: new Date(),
    });
    return NextResponse.json({ id: newUnusualActivity.id, userId, action, severity }, { status: 201 });
  } catch (error) {
    console.error('Error creating unusual activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}