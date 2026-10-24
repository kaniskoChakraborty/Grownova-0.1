import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightBadge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightBadge,
}) => {
  const { store, language, toggleLanguage, syncNow, isSyncing } = useApp();
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const displayTitle = title || store.name;
  const displaySubtitle = subtitle || `${store.ownerName} · ${store.city}`;

  return (
    <>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.iconCircle}
              onPress={() => setProfileModalVisible(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="storefront" size={22} color={theme.colors.secondary} />
            </TouchableOpacity>
          )}

          <View style={styles.titleColumn}>
            <Text style={styles.titleText} numberOfLines={1}>
              {displayTitle}
            </Text>
            <Text style={styles.subtitleText} numberOfLines={1}>
              {displaySubtitle}
            </Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          {rightBadge ? (
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{rightBadge}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.langButton,
                language === 'hi' && styles.langButtonActive,
              ]}
              onPress={toggleLanguage}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="translate"
                size={14}
                color={language === 'hi' ? '#FFF' : theme.colors.secondary}
              />
              <Text
                style={[
                  styles.langText,
                  language === 'hi' && styles.langTextActive,
                ]}
              >
                {language === 'hi' ? 'हिंदी' : 'ENG'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {store.ownerName.charAt(0) || 'R'}
              </Text>
            </View>
            <View style={styles.activeDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Store Profile & QR Code Modal */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconWrap}>
                  <MaterialIcons name="store" size={24} color={theme.colors.secondary} />
                </View>
                <View>
                  <Text style={styles.modalStoreName}>{store.name}</Text>
                  <Text style={styles.modalStoreTag}>{store.tagline}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setProfileModalVisible(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={22} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Merchant Details List */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Owner / मालिक:</Text>
                <Text style={styles.detailVal}>{store.ownerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone / फोन:</Text>
                <Text style={styles.detailVal}>{store.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>GSTIN:</Text>
                <Text style={styles.detailVal}>{store.gstin}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailVal} numberOfLines={1}>{store.address}</Text>
              </View>
            </View>

            {/* UPI QR Code Card */}
            <View style={styles.upiCard}>
              <Text style={styles.upiTitle}>⚡ Shop Counter UPI QR</Text>
              <Text style={styles.upiSubtitle}>Customers can scan to pay directly</Text>
              <View style={styles.qrContainer}>
                <Image
                  source={{ uri: store.qrCodeUrl }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.upiIdText}>VPA: {store.upiId}</Text>
            </View>

            {/* Cloud Sync Button */}
            <TouchableOpacity
              style={styles.syncBtn}
              onPress={syncNow}
              disabled={isSyncing}
              activeOpacity={0.8}
            >
              {isSyncing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <MaterialIcons name="cloud-sync" size={20} color="#FFF" />
                  <Text style={styles.syncBtnText}>Manual Cloud Sync (सिंक करें)</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 68,
    backgroundColor: theme.colors.surfaceWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  titleColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  langButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  langTextActive: {
    color: '#FFF',
  },
  badgePill: {
    backgroundColor: theme.colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  avatarButton: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.secondaryLight,
  },
  avatarInitial: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.success,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceWhite,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  modalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStoreName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  modalStoreTag: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  detailsBox: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  upiCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  upiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  upiSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  qrContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  upiIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
    letterSpacing: 0.5,
  },
  syncBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
  },
  syncBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
