import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

interface AttendanceScreenProps {
  onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const [punchedIn, setPunchedIn] = useState(true);

  const staff = [
    { name: 'Ramesh Kumar', role: 'Counter Billing', time: '08:45 AM', status: 'present', geo: 'Inside Shop (12m)' },
    { name: 'Sunita Patil', role: 'Inventory & Stock', time: '09:00 AM', status: 'present', geo: 'Inside Shop (18m)' },
    { name: 'Suresh Verma', role: 'Helper & Delivery', time: '09:12 AM', status: 'present', geo: 'Mandi Gate (45m)' },
    { name: 'Manoj Shinde', role: 'Loading Staff', time: '--:--', status: 'absent', geo: 'Not Clocked In' },
  ];

  const togglePunch = () => {
    setPunchedIn(!punchedIn);
    Alert.alert(
      punchedIn ? 'Punch Out Recorded' : '✅ Punch In Verified!',
      punchedIn
        ? 'Your clock-out has been recorded for the day.'
        : 'Geotag verified at Pune Mandi Counter (Accuracy 12m). Attendance marked present.'
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Staff Attendance"
        subtitle="GPS Geotag & Shop Muster"
        showBack={true}
        onBack={onBack}
        rightBadge="GPS Active"
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mandi Geotag Banner */}
        <View style={styles.geoCard}>
          <View style={styles.geoTop}>
            <View style={styles.geoLeft}>
              <MaterialIcons name="storefront" size={20} color={theme.colors.secondary} />
              <Text style={styles.geoTitle}>Counter 01 · Shree Ganesh Traders</Text>
            </View>
            <View style={styles.geoPill}>
              <Text style={styles.geoPillText}>Pune Mandi</Text>
            </View>
          </View>

          <View style={styles.geoBottom}>
            <View style={styles.geoDateRow}>
              <MaterialIcons name="calendar-today" size={14} color={theme.colors.textMuted} />
              <Text style={styles.geoDate}>Today, Friday, 24 Oct</Text>
            </View>
            <View style={styles.musterBadge}>
              <View style={styles.musterDot} />
              <Text style={styles.musterText}>Muster Open</Text>
            </View>
          </View>
        </View>

        {/* Quick Stat Ribbon */}
        <View style={styles.ribbon}>
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>PRESENT</Text>
            <Text style={[styles.ribbonVal, { color: theme.colors.success }]}>3</Text>
          </View>
          <View style={styles.ribbonDivider} />
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>ABSENT</Text>
            <Text style={[styles.ribbonVal, { color: theme.colors.error }]}>1</Text>
          </View>
          <View style={styles.ribbonDivider} />
          <View style={styles.ribbonItem}>
            <Text style={styles.ribbonLabel}>ON LEAVE</Text>
            <Text style={styles.ribbonVal}>0</Text>
          </View>
        </View>

        {/* Punch In / Out Button */}
        <TouchableOpacity
          style={[styles.punchBtn, !punchedIn && styles.punchBtnOut]}
          activeOpacity={0.85}
          onPress={togglePunch}
        >
          <View style={styles.punchLeft}>
            <View style={styles.punchIconCircle}>
              <MaterialIcons
                name={punchedIn ? 'check-circle' : 'touch-app'}
                size={24}
                color={punchedIn ? theme.colors.success : theme.colors.primary}
              />
            </View>
            <View>
              <Text style={styles.punchTitle}>
                {punchedIn ? 'You are Clocked In' : 'Punch In Now (हाजिरी लगाएं)'}
              </Text>
              <Text style={styles.punchSubtitle}>
                {punchedIn ? 'GPS Geotag Verified · 08:45 AM' : 'Tap to mark presence with GPS tag'}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Staff List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Staff Roster</Text>
          <Text style={styles.sectionCount}>4 Members</Text>
        </View>

        <View style={styles.staffList}>
          {staff.map((s, idx) => (
            <View key={idx} style={styles.staffCard}>
              <View style={styles.staffLeft}>
                <View
                  style={[
                    styles.avatarCircle,
                    s.status === 'present'
                      ? { backgroundColor: theme.colors.successBg }
                      : { backgroundColor: theme.colors.errorContainer },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      s.status === 'present'
                        ? { color: theme.colors.success }
                        : { color: theme.colors.error },
                    ]}
                  >
                    {s.name.charAt(0)}
                  </Text>
                </View>

                <View>
                  <Text style={styles.staffName}>{s.name}</Text>
                  <Text style={styles.staffRole}>{s.role}</Text>
                  <View style={styles.geoRow}>
                    <MaterialIcons
                      name={s.status === 'present' ? 'location-on' : 'location-off'}
                      size={12}
                      color={s.status === 'present' ? theme.colors.success : theme.colors.textMuted}
                    />
                    <Text style={styles.geoText}>{s.geo}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.staffRight}>
                <Text style={styles.staffTime}>{s.time}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    s.status === 'present'
                      ? { backgroundColor: theme.colors.successBg }
                      : { backgroundColor: theme.colors.errorContainer },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      s.status === 'present'
                        ? { color: theme.colors.success }
                        : { color: theme.colors.error },
                    ]}
                  >
                    {s.status === 'present' ? 'Present' : 'Absent'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  geoCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  geoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  geoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  geoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  geoPill: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  geoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  geoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  geoDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  geoDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  musterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  musterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.secondary,
  },
  musterText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  ribbon: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 10,
    marginBottom: theme.spacing.md,
  },
  ribbonItem: {
    flex: 1,
    alignItems: 'center',
  },
  ribbonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  ribbonVal: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 2,
  },
  ribbonDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.border,
  },
  punchBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  punchBtnOut: {
    backgroundColor: theme.colors.secondary,
  },
  punchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  punchIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  punchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  punchSubtitle: {
    fontSize: 11,
    color: theme.colors.primaryDim,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  staffList: {
    gap: theme.spacing.sm,
  },
  staffCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  staffLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  staffName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  staffRole: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  geoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 3,
  },
  geoText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  staffRight: {
    alignItems: 'flex-end',
  },
  staffTime: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statusBadge: {
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
