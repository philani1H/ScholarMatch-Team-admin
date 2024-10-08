const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.detectUnusualActivity = functions.firestore
    .document('activities/{activityId}')
    .onCreate(async (snap, context) => {
        const activity = snap.data();
        const userId = activity.userId;

        // Fetch rules from Firestore
        const rulesDoc = await admin.firestore().collection('settings').doc('rules').get();
        const rules = rulesDoc.data();

        if (!rules) {
            console.error('Rules document not found in settings collection');
            return;
        }

        // Check for multiple login attempts
        if (activity.action === 'login') {
            const userRef = admin.firestore().collection('users').doc(userId);
            const userSnap = await userRef.get();
            const loginAttempts = userSnap.data().loginAttempts || 0;

            if (loginAttempts >= rules.maxLoginAttempts) {
                await admin.firestore().collection('unusualActivities').add({
                    userId: userId,
                    action: 'Multiple login attempts',
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    severity: 'high'
                });
                await userRef.update({ isBlocked: true });
            } else {
                await userRef.update({ loginAttempts: loginAttempts + 1 });
            }
        }

        // Check for rapid-fire actions
        const recentActivities = await admin.firestore()
            .collection('activities')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(rules.rapidFireActionCount)
            .get();

        if (recentActivities.size === rules.rapidFireActionCount) {
            const oldestTimestamp = recentActivities.docs[recentActivities.size - 1].data().timestamp.toDate();
            const newestTimestamp = recentActivities.docs[0].data().timestamp.toDate();
            const timeDiff = (newestTimestamp - oldestTimestamp) / 1000; // in seconds

            if (timeDiff < rules.rapidFireTimeWindow) {
                await admin.firestore().collection('unusualActivities').add({
                    userId: userId,
                    action: 'Rapid-fire actions',
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    severity: 'medium'
                });
            }
        }

        // Check for actions at unusual times
        const hour = activity.timestamp.toDate().getHours();
        if (hour >= rules.unusualHoursStart && hour <= rules.unusualHoursEnd) {
            await admin.firestore().collection('unusualActivities').add({
                userId: userId,
                action: 'Activity at unusual hours',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                severity: 'low'
            });
        }
    });