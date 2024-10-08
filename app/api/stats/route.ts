import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const usersCount = (await db.collection('users').count().get()).data().count;
    const activitiesCount = (await db.collection('activities').count().get()).data().count;
    const unusualActivitiesCount = (await db.collection('unusualActivities').count().get()).data().count;

    // Get user growth over the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const userGrowthSnapshot = await db.collection('users')
      .where('createdAt', '>=', sevenDaysAgo)
      .orderBy('createdAt')
      .get();
    const userGrowth = userGrowthSnapshot.docs.reduce((acc, doc) => {
      const date = doc.data().createdAt.toDate().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      usersCount,
      activitiesCount,
      unusualActivitiesCount,
      userGrowth,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}