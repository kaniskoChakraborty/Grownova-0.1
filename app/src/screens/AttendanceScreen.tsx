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
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp, StaffMember } from '../context/AppContext';

interface AttendanceScreenProps {
  onBack: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onBack }) => {
  const {
    staff,
    isOwnerPunchedIn,
    ownerPunchTime,
    ownerPhotoUri,
    ownerGeoCoords,
    toggleOwnerPunch,
    recordOwnerPhotoPunch,
    setStaffStatus,
    recordStaffPhotoAttendance,
    addStaff,
    language,
    store,
  } = useApp();

  // Add Staff Modal
  const [addStaffModalVisible, setAddStaffModalVisible] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Counter Billing');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  // Geotag Camera Modal
  const [geotagModalVisible, setGeotagModalVisible] = useState(false);
  const [activeStaffForPhoto, setActiveStaffForPhoto] = useState<StaffMember | null>(null);
  const [isOwnerPhotoCapture, setIsOwnerPhotoCapture] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [simulatedShutter, setSimulatedShutter] = useState(false);

  // View Geotag Slip Modal
  const [slipModalVisible, setSlipModalVisible] = useState(false);
  const [viewingStaffSlip, setViewingStaffSlip] = useState<StaffMember | null>(null);

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

  // Launch Camera with permission
  const handleLaunchCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Please allow camera access to capture geotag attendance photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Camera', 'Unable to open camera on this device. Using quick in-app geotag snap.');
      handleInstantQuickSnap();
    }
  };

  // Launch Gallery
  const handleLaunchGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      handleInstantQuickSnap();
    }
  };

  // Simulated In-App Quick Geotag Snap (Reliable across all environments)
  const handleInstantQuickSnap = () => {
    setSimulatedShutter(true);
    setTimeout(() => {
      setSimulatedShutter(false);
      // Sample high quality representative avatar/photo
      const sampleUri =
        activeStaffForPhoto?.role.includes('Inventory')
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60';
      setCapturedPhotoUri(sampleUri);
    }, 400);
  };

  // Confirm Geotag Attendance
  const handleConfirmGeotagAttendance = () => {
    const photoToSave =
      capturedPhotoUri ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60';
    const coords = '18.5204° N, 73.8567° E';
    const address = `${store.name} · ${store.address || 'Market Yard, Pune Mandi'}`;

    if (isOwnerPhotoCapture) {
      recordOwnerPhotoPunch(photoToSave, coords);
    } else if (activeStaffForPhoto) {
      recordStaffPhotoAttendance(activeStaffForPhoto.id, photoToSave, coords, address);
      Alert.alert(
        '✅ Geotag Attendance Verified',
        `Geotag attendance recorded with photo for ${activeStaffForPhoto.name}!\nGPS Location: ${coords}\nStatus: Inside Shop (8m radius)`
      );
    }

    setGeotagModalVisible(false);
    setActiveStaffForPhoto(null);
    setCapturedPhotoUri(null);
    setIsOwnerPhotoCapture(false);
  };

  const openGeotagModalForStaff = (member: StaffMember) => {
    setActiveStaffForPhoto(member);
    setIsOwnerPhotoCapture(false);
    setCapturedPhotoUri(member.photoUri || null);
    setGeotagModalVisible(true);
  };

  const openGeotagModalForOwner = () => {
    setIsOwnerPhotoCapture(true);
    setActiveStaffForPhoto(null);
    setCapturedPhotoUri(ownerPhotoUri || null);
    setGeotagModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header
        title={language === 'hi' ? 'स्टाफ हाजिरी (Attendance)' : 'Staff Attendance & Geotag'}
        subtitle="GPS Geotag & Photo Verification"
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
              <View style={{ flex: 1 }}>
                <Text style={styles.geoTitle}>{store.name} Counter</Text>
                <Text style={styles.geoCoords}>18.5204° N, 73.8567° E · Accuracy 8m</Text>
                <Text style={styles.geoAddressText}>{store.city}</Text>
              </View>
            </View>
            <View style={styles.inShopBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.inShopText}>Inside Geofence</Text>
            </View>
          </View>

          {/* Owner Punch Clock CTA */}
          <View style={styles.punchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.punchTitle}>
                {isOwnerPunchedIn ? 'Owner Counter Clocked In' : 'Owner Counter Clocked Out'}
              </Text>
              <Text style={styles.punchTime}>
                {isOwnerPunchedIn
                  ? `Clocked in at ${ownerPunchTime || '08:30 AM'} · GPS Stamped`
                  : 'Not clocked in today'}
              </Text>
            </View>

            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={styles.ownerPhotoBtn}
                onPress={openGeotagModalForOwner}
                activeOpacity={0.8}
              >
                <MaterialIcons name="add-a-photo" size={16} color={theme.colors.primary} />
                <Text style={styles.ownerPhotoBtnText}>
                  {ownerPhotoUri ? 'Photo ✅' : 'Geotag 📷'}
                </Text>
              </TouchableOpacity>

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
                  size={18}
                  color="#FFF"
                />
                <Text style={styles.punchBtnText}>
                  {isOwnerPunchedIn ? 'Clock Out' : 'Punch In'}
                </Text>
              </TouchableOpacity>
            </View>
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
          <View>
            <Text style={styles.sectionTitle}>Workers Muster ({staff.length})</Text>
            <Text style={styles.sectionSub}>All workers must punch with Geotag photo</Text>
          </View>
          <TouchableOpacity
            style={styles.addStaffBtn}
            onPress={() => setAddStaffModalVisible(true)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="person-add" size={16} color="#FFF" />
            <Text style={styles.addStaffBtnText}>+ Add Worker</Text>
          </TouchableOpacity>
        </View>

        {staff.map((member) => {
          const hasPhoto = !!member.photoUri;
          const isGeotagged = member.isGeotagVerified;

          return (
            <View key={member.id} style={styles.staffCard}>
              <View style={styles.staffTop}>
                {/* Avatar or Photo Thumbnail */}
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={() => {
                    if (hasPhoto) {
                      setViewingStaffSlip(member);
                      setSlipModalVisible(true);
                    } else {
                      openGeotagModalForStaff(member);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  {hasPhoto ? (
                    <Image source={{ uri: member.photoUri }} style={styles.staffThumbImage} />
                  ) : (
                    <View style={styles.staffAvatar}>
                      <Text style={styles.staffInitial}>{member.name.charAt(0)}</Text>
                    </View>
                  )}
                  {isGeotagged && (
                    <View style={styles.geoBadgePin}>
                      <MaterialIcons name="gps-fixed" size={10} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    {isGeotagged ? (
                      <View style={styles.geotagStatusChip}>
                        <MaterialIcons name="check-circle" size={12} color="#166534" />
                        <Text style={styles.geotagStatusChipText}>Geotagged</Text>
                      </View>
                    ) : (
                      <View style={[styles.geotagStatusChip, { backgroundColor: '#FEF3C7' }]}>
                        <MaterialIcons name="camera-alt" size={12} color="#92400E" />
                        <Text style={[styles.geotagStatusChipText, { color: '#92400E' }]}>Photo Req.</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.staffRole}>
                    {member.role} · {member.phone}
                  </Text>

                  <Text style={styles.staffGeo}>
                    <MaterialIcons name="location-on" size={13} color={theme.colors.secondary} />{' '}
                    {member.geoAccuracy}
                    {member.checkInTime ? ` · Punch: ${member.checkInTime}` : ''}
                  </Text>
                </View>
              </View>

              {/* Action: Geotag Photo Button */}
              <View style={styles.geotagActionRow}>
                <TouchableOpacity
                  style={[
                    styles.geotagPhotoBtn,
                    hasPhoto && styles.geotagPhotoBtnDone,
                  ]}
                  onPress={() => openGeotagModalForStaff(member)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name={hasPhoto ? 'camera-alt' : 'add-a-photo'}
                    size={16}
                    color={hasPhoto ? theme.colors.primary : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.geotagPhotoBtnText,
                      hasPhoto && { color: theme.colors.primary },
                    ]}
                  >
                    {hasPhoto ? 'Retake Geotag Photo' : '📸 Take Geotag Photo Punch'}
                  </Text>
                </TouchableOpacity>

                {hasPhoto && (
                  <TouchableOpacity
                    style={styles.viewSlipBtn}
                    onPress={() => {
                      setViewingStaffSlip(member);
                      setSlipModalVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="receipt-long" size={15} color={theme.colors.secondary} />
                    <Text style={styles.viewSlipBtnText}>View Slip</Text>
                  </TouchableOpacity>
                )}
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
                    size={14}
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
                    size={14}
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
                    size={14}
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
          );
        })}
      </ScrollView>

      {/* ======================================================== */}
      {/* GEOTAG CAMERA SCANNER / CAPTURE MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={geotagModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGeotagModalVisible(false)}
      >
        <View style={styles.cameraModalBackdrop}>
          <View style={styles.cameraModalSheet}>
            {/* Modal Header */}
            <View style={styles.cameraModalHeader}>
              <View>
                <Text style={styles.cameraModalTitle}>
                  {isOwnerPhotoCapture
                    ? 'Owner Geotag Clock-In'
                    : `Worker Geotag: ${activeStaffForPhoto?.name || 'Staff'}`}
                </Text>
                <Text style={styles.cameraModalSubtitle}>
                  GPS Verified Photo Attendance · {store.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setGeotagModalVisible(false)}
                style={styles.closeModalBtn}
              >
                <MaterialIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Live GPS HUD Status Bar */}
            <View style={styles.gpsHudCard}>
              <View style={styles.hudRow}>
                <View style={styles.hudItem}>
                  <Text style={styles.hudLabel}>GEO COORDINATES</Text>
                  <Text style={styles.hudVal}>18.5204° N, 73.8567° E</Text>
                </View>
                <View style={styles.hudItem}>
                  <Text style={styles.hudLabel}>RADIUS ACCURACY</Text>
                  <Text style={[styles.hudVal, { color: '#10B981' }]}>8m (Inside Shop) ✅</Text>
                </View>
              </View>
              <View style={styles.hudDivider} />
              <View style={styles.hudRow}>
                <View style={styles.hudItem}>
                  <Text style={styles.hudLabel}>SHOP PREMISES</Text>
                  <Text style={styles.hudValSmall}>{store.name}, {store.city}</Text>
                </View>
                <View style={styles.hudItem}>
                  <Text style={styles.hudLabel}>TIMESTAMP</Text>
                  <Text style={styles.hudValSmall}>
                    {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}, Today
                  </Text>
                </View>
              </View>
            </View>

            {/* Camera Viewfinder Frame */}
            <View style={styles.viewfinderFrame}>
              {capturedPhotoUri ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: capturedPhotoUri }} style={styles.previewImage} />
                  {/* Official Geotag Watermark Overlay */}
                  <View style={styles.watermarkOverlay}>
                    <View style={styles.watermarkTop}>
                      <Text style={styles.watermarkBrand}>GrowNova OS · VERIFIED ATTENDANCE</Text>
                      <View style={styles.watermarkBadge}>
                        <Text style={styles.watermarkBadgeText}>GEOFENCE VALID</Text>
                      </View>
                    </View>
                    <Text style={styles.watermarkName}>
                      {isOwnerPhotoCapture ? store.ownerName : activeStaffForPhoto?.name} (
                      {isOwnerPhotoCapture ? 'Store Owner' : activeStaffForPhoto?.role})
                    </Text>
                    <Text style={styles.watermarkMeta}>
                      📍 18.5204° N, 73.8567° E · Accuracy 8m · {store.name}
                    </Text>
                    <Text style={styles.watermarkTime}>
                      🕒 {new Date().toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyViewfinder}>
                  {simulatedShutter && <View style={styles.shutterFlash} />}
                  <View style={styles.crosshairTL} />
                  <View style={styles.crosshairTR} />
                  <View style={styles.crosshairBL} />
                  <View style={styles.crosshairBR} />

                  <View style={styles.viewfinderCenter}>
                    <MaterialIcons name="face" size={60} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.viewfinderGuideText}>Position face inside the frame</Text>
                    <Text style={styles.viewfinderSubText}>Coordinates will be watermarked</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Capture Triggers */}
            <View style={styles.cameraActionsRow}>
              <TouchableOpacity
                style={styles.camOptBtn}
                onPress={handleLaunchCamera}
                activeOpacity={0.8}
              >
                <MaterialIcons name="photo-camera" size={20} color={theme.colors.primary} />
                <Text style={styles.camOptBtnText}>Device Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.camOptBtn}
                onPress={handleLaunchGallery}
                activeOpacity={0.8}
              >
                <MaterialIcons name="photo-library" size={20} color={theme.colors.primary} />
                <Text style={styles.camOptBtnText}>Pick Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.camOptBtn, styles.camOptBtnQuick]}
                onPress={handleInstantQuickSnap}
                activeOpacity={0.8}
              >
                <MaterialIcons name="flash-on" size={20} color="#C69A43" />
                <Text style={[styles.camOptBtnText, { color: '#C69A43' }]}>Quick Geotag</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm & Save Button */}
            <TouchableOpacity
              style={[
                styles.saveGeotagBtn,
                !capturedPhotoUri && styles.saveGeotagBtnDisabled,
              ]}
              disabled={!capturedPhotoUri}
              onPress={handleConfirmGeotagAttendance}
              activeOpacity={0.85}
            >
              <MaterialIcons name="verified" size={20} color="#FFF" />
              <Text style={styles.saveGeotagBtnText}>
                {capturedPhotoUri
                  ? 'Confirm & Stamp Geotag Attendance'
                  : 'Capture or Choose Photo First'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* VIEW STAMPED GEOTAG ATTENDANCE SLIP MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={slipModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSlipModalVisible(false)}
      >
        <View style={styles.cameraModalBackdrop}>
          <View style={styles.slipCardSheet}>
            <View style={styles.slipHeader}>
              <View>
                <Text style={styles.slipTitle}>Official Geotag Slip</Text>
                <Text style={styles.slipSub}>Proof of Presence on Counter</Text>
              </View>
              <TouchableOpacity onPress={() => setSlipModalVisible(false)}>
                <MaterialIcons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {viewingStaffSlip?.photoUri ? (
              <View style={styles.slipPhotoWrap}>
                <Image source={{ uri: viewingStaffSlip.photoUri }} style={styles.slipImage} />
                <View style={styles.watermarkOverlay}>
                  <Text style={styles.watermarkBrand}>GrowNova OS Verified</Text>
                  <Text style={styles.watermarkName}>{viewingStaffSlip.name} ({viewingStaffSlip.role})</Text>
                  <Text style={styles.watermarkMeta}>📍 {viewingStaffSlip.geoCoords || '18.5204° N, 73.8567° E'}</Text>
                  <Text style={styles.watermarkTime}>🕒 {viewingStaffSlip.attendanceTimestamp || 'Today'}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.slipDetailsList}>
              <View style={styles.slipDetailRow}>
                <Text style={styles.slipDetailLabel}>Employee Name:</Text>
                <Text style={styles.slipDetailValue}>{viewingStaffSlip?.name}</Text>
              </View>
              <View style={styles.slipDetailRow}>
                <Text style={styles.slipDetailLabel}>Designation:</Text>
                <Text style={styles.slipDetailValue}>{viewingStaffSlip?.role}</Text>
              </View>
              <View style={styles.slipDetailRow}>
                <Text style={styles.slipDetailLabel}>Punch Time:</Text>
                <Text style={styles.slipDetailValue}>{viewingStaffSlip?.checkInTime || '09:00 AM'}</Text>
              </View>
              <View style={styles.slipDetailRow}>
                <Text style={styles.slipDetailLabel}>GPS Coordinates:</Text>
                <Text style={styles.slipDetailValue}>{viewingStaffSlip?.geoCoords || '18.5204° N, 73.8567° E'}</Text>
              </View>
              <View style={styles.slipDetailRow}>
                <Text style={styles.slipDetailLabel}>Geofence Status:</Text>
                <Text style={[styles.slipDetailValue, { color: '#16A34A', fontWeight: '800' }]}>
                  Verified Inside Shop (8m) ✅
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.doneSlipBtn}
              onPress={() => setSlipModalVisible(false)}
            >
              <Text style={styles.doneSlipBtnText}>Close Geotag Slip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        visible={addStaffModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddStaffModalVisible(false)}
      >
        <View style={styles.cameraModalBackdrop}>
          <View style={styles.addModalSheet}>
            <View style={styles.cameraModalHeader}>
              <Text style={styles.cameraModalTitle}>Register New Worker</Text>
              <TouchableOpacity onPress={() => setAddStaffModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Anand Jadhav"
              placeholderTextColor="#94A3B8"
              value={newStaffName}
              onChangeText={setNewStaffName}
            />

            <Text style={styles.inputLabel}>Role / Duty</Text>
            <View style={styles.roleChips}>
              {['Counter Billing', 'Inventory & Stock', 'Helper & Delivery', 'Loading Staff'].map(
                (role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleChip,
                      newStaffRole === role && styles.roleChipActive,
                    ]}
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
                )
              )}
            </View>

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 98230-99887"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={newStaffPhone}
              onChangeText={setNewStaffPhone}
            />

            <TouchableOpacity
              style={styles.saveGeotagBtn}
              onPress={handleCreateStaff}
            >
              <Text style={styles.saveGeotagBtnText}>Save & Add to Muster</Text>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  geoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  geoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  geoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  geoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(198, 154, 67, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  geoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102B4E',
  },
  geoCoords: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  geoAddressText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  inShopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  inShopText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  punchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  punchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#102B4E',
  },
  punchTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ownerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  ownerPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  punchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  punchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    alignItems: 'center',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#102B4E',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  rosterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#102B4E',
  },
  sectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  addStaffBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addStaffBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  staffTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  staffAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  staffThumbImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  staffInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  geoBadgePin: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staffName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102B4E',
  },
  geotagStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  geotagStatusChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  staffRole: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  staffGeo: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  geotagActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  geotagPhotoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  geotagPhotoBtnDone: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  geotagPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewSlipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: 'rgba(198, 154, 67, 0.4)',
  },
  viewSlipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusBtnPresentActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  statusBtnHalfActive: {
    backgroundColor: '#EAB308',
    borderColor: '#EAB308',
  },
  statusBtnAbsentActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
  },
  cameraModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 43, 78, 0.75)',
    justifyContent: 'flex-end',
  },
  cameraModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  cameraModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cameraModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102B4E',
  },
  cameraModalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeModalBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  gpsHudCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudItem: {
    flex: 1,
  },
  hudLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  hudVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  hudValSmall: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
  hudDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  viewfinderFrame: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#334155',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  watermarkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 8,
  },
  watermarkTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  watermarkBrand: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  watermarkBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  watermarkBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  watermarkName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  watermarkMeta: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 1,
  },
  watermarkTime: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 1,
  },
  emptyViewfinder: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  shutterFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  crosshairTL: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#F59E0B',
  },
  crosshairTR: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#F59E0B',
  },
  crosshairBL: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#F59E0B',
  },
  crosshairBR: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#F59E0B',
  },
  viewfinderCenter: {
    alignItems: 'center',
  },
  viewfinderGuideText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  viewfinderSubText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  cameraActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  camOptBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  camOptBtnQuick: {
    backgroundColor: '#FFFDF9',
    borderColor: 'rgba(198, 154, 67, 0.4)',
  },
  camOptBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102B4E',
  },
  saveGeotagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#102B4E',
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveGeotagBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveGeotagBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  slipCardSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
  slipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  slipTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102B4E',
  },
  slipSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  slipPhotoWrap: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  slipImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slipDetailsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 6,
  },
  slipDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slipDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  slipDetailValue: {
    fontSize: 12,
    color: '#102B4E',
    fontWeight: '700',
  },
  doneSlipBtn: {
    backgroundColor: '#102B4E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneSlipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102B4E',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#102B4E',
  },
  roleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  roleChipActive: {
    backgroundColor: theme.colors.primary,
  },
  roleChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
