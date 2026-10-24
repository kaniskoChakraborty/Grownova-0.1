import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

interface AttendanceScreenProps {
  onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const {
    staff,
    isOwnerPunchedIn,
    ownerPunchTime,
    toggleOwnerPunch,
    setStaffStatus,
    addStaff,
    language,
  } = useApp();

  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Counter Billing');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  const presentCount = staff.filter((s) => s.status === 'present').length;
  const halfDayCount = staff.filter((s) => s.status === 'half_day').length;
  const absentCount = staff.filter((s) => s.status === 'absent').length;
  const attendanceRate = Math.round(((presentCount + halfDayCount * 0.5) / (staff.length || 1)) * 100);

  const handleCreateStaff = () => {
    if (!newStaffName.trim() || !newStaffPhone.trim()) {
      Alert.alert('Required Fields', 'Please enter staff name and mobile number.');
      return;
    }

    addStaff({
      name: newStaffName.trim(),
      role: newStaffRole,
      phone: newStaffPhone.trim(),
    });

    setNewStaffName('');
    setNewStaffPhone('');
    setAddStaffModalVisible(false);
    Alert.alert('✅ Staff Registered', `${newStaffName} added to shop muster.`);
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'स्टाफ हाजिरी (Attendance)' : 'Staff Attendance & Geotag'}
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
        {/* Mandi Geotag Banner Card */}
        <View style={styles.geoCard}>
          <View style={styles.geoTop}>
            <View style={styles.geoLeft}>
              <View style={styles.geoIconCircle}>
                <MaterialIcons name="location-on" size={24} color={theme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.geoTitle}>Pune Mandi Market Counter</Text>
                <Text style={styles.geoCoords}>18.5204° N, 73.8567° E · Accuracy 12m</Text>
              </View>
            </View>
            <View style={styles.inShopBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.inShopText}>Inside Geofence</Text>
            </View>
          </View>

          {/* Owner Punch Clock CTA */}
          <View style={styles.punchRow}>
            <View>
              <Text style={styles.punchTitle}>
                {isOwnerPunchedIn ? 'Counter Clocked In' : 'Counter Clocked Out'}
              </Text>
              <Text style={styles.punchTime}>
                {isOwnerPunchedIn ? `Clocked in at ${ownerPunchTime || '08:30 AM'}` : 'Not clocked in today'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.punchBtn,
                !isOwnerPunchedIn && { backgroundColor: theme.colors.success },
              ]}
              onPress={toggleOwnerPunch}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={isOwnerPunchedIn ? 'logout' : 'fingerprint'}
                size={20}
                color="#FFF"
              />
              <Text style={styles.punchBtnText}>
                {isOwnerPunchedIn ? 'Clock Out' : 'Tap to Punch In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3-Part Attendance Summary */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{presentCount}</Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.success }]}>Present</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{halfDayCount}</Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.warning }]}>Half-Day</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{absentCount}</Text>
            <Text style={[styles.summaryLabel, { color: theme.colors.error }]}>Absent</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryCol}>
            <Text style={styles.summaryNumber}>{attendanceRate}%</Text>
            <Text style={styles.summaryLabel}>Muster</Text>
          </View>
        </View>

        {/* Staff Roster Section */}
        <View style={styles.rosterHeaderRow}>
          <Text style={styles.sectionTitle}>Shop Staff Roster ({staff.length})</Text>
          <TouchableOpacity
            style={styles.addStaffBtn}
            onPress={() => setAddStaffModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person-add" size={16} color="#FFF" />
            <Text style={styles.addStaffBtnText}>+ Add Staff</Text>
          </TouchableOpacity>
        </View>

        {staff.map((member) => (
          <View key={member.id} style={styles.staffCard}>
            <View style={styles.staffTop}>
              <View style={styles.staffLeft}>
                <View style={styles.staffAvatar}>
                  <Text style={styles.staffInitial}>{member.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.staffName}>{member.name}</Text>
                  <Text style={styles.staffRole}>
                    {member.role} · {member.phone}
                  </Text>
                  <Text style={styles.staffGeo}>
                    <MaterialIcons name="gps-fixed" size={12} color={theme.colors.secondary} />{' '}
                    {member.geoAccuracy}
                    {member.checkInTime ? ` · ${member.checkInTime}` : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Interactive 3-way attendance status buttons */}
            <View style={styles.statusToggleRow}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  member.status === 'present' && styles.statusBtnPresentActive,
                ]}
                onPress={() => setStaffStatus(member.id, 'present')}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="check-circle"
                  size={15}
                  color={member.status === 'present' ? '#FFF' : theme.colors.success}
                />
                <Text
                  style={[
                    styles.statusBtnText,
                    member.status === 'present' && styles.statusBtnTextActive,
                    member.status !== 'present' && { color: theme.colors.success },
                  ]}
                >
                  Present
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  member.status === 'half_day' && styles.statusBtnHalfActive,
                ]}
                onPress={() => setStaffStatus(member.id, 'half_day')}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="timelapse"
                  size={15}
                  color={member.status === 'half_day' ? '#FFF' : theme.colors.warning}
                />
                <Text
                  style={[
                    styles.statusBtnText,
                    member.status === 'half_day' && styles.statusBtnTextActive,
                    member.status !== 'half_day' && { color: theme.colors.warning },
                  ]}
                >
                  Half-Day
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  member.status === 'absent' && styles.statusBtnAbsentActive,
                ]}
                onPress={() => setStaffStatus(member.id, 'absent')}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="cancel"
                  size={15}
                  color={member.status === 'absent' ? '#FFF' : theme.colors.error}
                />
                <Text
                  style={[
                    styles.statusBtnText,
                    member.status === 'absent' && styles.statusBtnTextActive,
                    member.status !== 'absent' && { color: theme.colors.error },
                  ]}
                >
                  Absent
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Staff Modal */}
      <Modal
        visible={addStaffModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddStaffModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register Staff (नया कर्मचारी)</Text>
              <TouchableOpacity
                onPress={() => setAddStaffModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Staff Name (नाम):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Nilesh Deshmukh"
              placeholderTextColor={theme.colors.textMuted}
              value={newStaffName}
              onChangeText={setNewStaffName}
            />

            <Text style={styles.inputLabel}>Mobile Phone (फ़ोन):</Text>
            <TextInput
              style={styles.formInput}
              placeholder="98230-00000"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="phone-pad"
              value={newStaffPhone}
              onChangeText={setNewStaffPhone}
            />

            <Text style={styles.inputLabel}>Role (पद):</Text>
            <View style={styles.rolesGrid}>
              {[
                'Counter Billing',
                'Inventory & Stock',
                'Helper & Delivery',
                'Loading Staff',
              ].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.roleChip, newStaffRole === role && styles.roleChipActive]}
                  onPress={() => setNewStaffRole(role)}
                >
                  <Text
                    style={[
                      styles.roleChipText,
                      newStaffRole === role && styles.roleChipTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmStaffBtn}
              onPress={handleCreateStaff}
              activeOpacity={0.85}
            >
              <MaterialIcons name="check" size={20} color="#FFF" />
              <Text style={styles.confirmStaffBtnText}>Register to Attendance Muster</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.lg,
  },
  geoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  geoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
    marginRight: 6,
  },
  geoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  geoCoords: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  inShopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  inShopText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.success,
  },
  punchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  punchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  punchTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  punchBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
  punchBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryBar: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  summaryCol: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  rosterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addStaffBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
  },
  addStaffBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  staffCard: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  staffTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  staffLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  staffAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  staffInitial: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  staffRole: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  staffGeo: {
    fontSize: 11,
    color: theme.colors.secondary,
    fontWeight: '600',
    marginTop: 3,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  statusBtnPresentActive: {
    backgroundColor: theme.colors.success,
  },
  statusBtnHalfActive: {
    backgroundColor: theme.colors.warning,
  },
  statusBtnAbsentActive: {
    backgroundColor: theme.colors.error,
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBtnTextActive: {
    color: '#FFF',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceWhite,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  closeBtn: {
    padding: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: theme.spacing.lg,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roleChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  roleChipTextActive: {
    color: '#FFF',
  },
  confirmStaffBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    marginTop: 8,
  },
  confirmStaffBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
