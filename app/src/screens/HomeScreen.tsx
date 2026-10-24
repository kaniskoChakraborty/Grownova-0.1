import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';
import { useApp } from '../context/AppContext';

interface HomeScreenProps {
  onNavigateToBill: () => void;
  onNavigateToSales: () => void;
  onNavigateToPurchase: () => void;
  onNavigateToStock: () => void;
  onNavigateToAttendance: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToBill,
  onNavigateToSales,
  onNavigateToPurchase,
  onNavigateToStock,
  onNavigateToAttendance,
}) => {
  const {
    store,
    language,
    todaySales,
    todayCash,
    todayUdhaar,
    lowStockCount,
    staff,
    sales,
    isOwnerPunchedIn,
  } = useApp();

  const presentCount = staff.filter((s) => s.status === 'present').length;
  const absentCount = staff.filter((s) => s.status === 'absent').length;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Greeting Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroPill}>
            <MaterialIcons name="wb-sunny" size={14} color={theme.colors.secondary} />
            <Text style={styles.heroPillText}>
              {language === 'hi' ? 'आज का दिन · Active Counter' : "Today's Summary · Active Counter"}
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            {language === 'hi'
              ? `नमस्ते, ${store.ownerName} 🙏`
              : `Hello, ${store.ownerName} 👋`}
          </Text>
          <Text style={styles.heroSubtitle}>
            {language === 'hi'
              ? 'आपकी दुकान का लाइव हिसाब-किताब। सरल और तेज़।'
              : 'Your shop live summary for today. Quick & simple.'}
          </Text>

          <View style={styles.heroStatusRow}>
            <View style={styles.shopOpenBadge}>
              <View style={[styles.pulseDot, !isOwnerPunchedIn && { backgroundColor: theme.colors.error }]} />
              <Text style={styles.shopOpenText}>
                {isOwnerPunchedIn
                  ? (language === 'hi' ? 'दुकान खुली है (Shop Open)' : 'Shop Open & Active')
                  : (language === 'hi' ? 'दुकान बंद है (Shop Closed)' : 'Shop Closed')}
              </Text>
            </View>
            <View style={styles.cloudSyncBadge}>
              <MaterialIcons name="check-circle" size={14} color={theme.colors.secondaryAccent} />
              <Text style={styles.cloudSyncText}>Cloud Auto-Sync Active</Text>
            </View>
          </View>
        </View>

        {/* Offline-First Sync Banner */}
        <View style={styles.syncBanner}>
          <View style={styles.syncBannerLeft}>
            <View style={styles.onlineDot} />
            <Text style={styles.syncBannerText}>
              Saved on device <Text style={styles.syncBannerMuted}>· {sales.length + 38} records synced</Text>
            </Text>
          </View>
          <View style={styles.syncBannerRight}>
            <MaterialIcons name="wifi" size={15} color={theme.colors.success} />
            <Text style={styles.syncBannerRightText}>Online</Text>
          </View>
        </View>

        {/* 2x2 Metric KPI Grid */}
        <View style={styles.kpiGrid}>
          {/* Tile 1: Today's Sale */}
          <TouchableOpacity
            style={[styles.kpiCard, styles.kpiCardHighlight]}
            activeOpacity={0.8}
            onPress={onNavigateToSales}
          >
            <View style={styles.kpiHeaderRow}>
              <Text style={styles.kpiLabel}>
                {language === 'hi' ? "आज की बिक्री (Sale)" : "Today's Sales"}
              </Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.secondaryLight }]}>
                <MaterialIcons name="trending-up" size={18} color={theme.colors.secondary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>₹{todaySales.toLocaleString('en-IN')}</Text>
            <View style={styles.kpiFooter}>
              <MaterialIcons name="check" size={12} color={theme.colors.success} />
              <Text style={styles.kpiFooterText}>{sales.length} bills generated</Text>
            </View>
          </TouchableOpacity>

          {/* Tile 2: Cash in Hand */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.8}
            onPress={onNavigateToSales}
          >
            <View style={styles.kpiHeaderRow}>
              <Text style={styles.kpiLabel}>
                {language === 'hi' ? "गल्ला (Cash in Hand)" : "Cash in Hand"}
              </Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.successBg }]}>
                <MaterialIcons name="account-balance-wallet" size={18} color={theme.colors.success} />
              </View>
            </View>
            <Text style={styles.kpiValue}>₹{todayCash.toLocaleString('en-IN')}</Text>
            <View style={styles.kpiFooter}>
              <Text style={[styles.kpiFooterText, { color: theme.colors.success }]}>● Safe in register</Text>
            </View>
          </TouchableOpacity>

          {/* Tile 3: Customer Udhaar */}
          <TouchableOpacity
            style={styles.kpiCard}
            activeOpacity={0.8}
            onPress={onNavigateToSales}
          >
            <View style={styles.kpiHeaderRow}>
              <Text style={styles.kpiLabel}>
                {language === 'hi' ? "कुल उधारी (Udhaar)" : "Customer Udhaar"}
              </Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.errorBg }]}>
                <MaterialIcons name="schedule" size={18} color={theme.colors.error} />
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: theme.colors.error }]}>
              ₹{todayUdhaar.toLocaleString('en-IN')}
            </Text>
            <View style={styles.kpiFooter}>
              <Text style={[styles.kpiFooterText, { color: theme.colors.error }]}>In Khata ledger</Text>
            </View>
          </TouchableOpacity>

          {/* Tile 4: Low Stock Alert */}
          <TouchableOpacity
            style={[styles.kpiCard, lowStockCount > 0 && styles.kpiCardWarning]}
            activeOpacity={0.8}
            onPress={onNavigateToStock}
          >
            <View style={styles.kpiHeaderRow}>
              <Text style={styles.kpiLabel}>
                {language === 'hi' ? "कम स्टॉक (Low Stock)" : "Low Stock Alert"}
              </Text>
              <View style={[styles.kpiIconWrap, { backgroundColor: theme.colors.warningBg }]}>
                <MaterialIcons name="warning" size={18} color={theme.colors.warning} />
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: theme.colors.warning }]}>
              {lowStockCount} Items
            </Text>
            <View style={styles.kpiFooter}>
              <Text style={[styles.kpiFooterText, { color: theme.colors.warning }]}>
                {lowStockCount > 0 ? 'Action needed' : 'All stocks safe'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ⚡ High-Visibility Quick Action: Make Bill */}
        <TouchableOpacity style={styles.makeBillButton} activeOpacity={0.85} onPress={onNavigateToBill}>
          <View style={styles.makeBillLeft}>
            <View style={styles.makeBillBoltCircle}>
              <MaterialIcons name="bolt" size={30} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.makeBillTitle}>
                {language === 'hi' ? '⚡ Make Bill (बिल बनाएं)' : '⚡ Make Bill (Quick POS)'}
              </Text>
              <Text style={styles.makeBillSubtitle}>
                {language === 'hi' ? '1 मिनट में बिल बनाएं · QR & WhatsApp' : 'Fast 1-minute billing · Barcode & Name'}
              </Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={26} color="#FFF" />
        </TouchableOpacity>

        {/* 3 Action Tiles */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionTile} activeOpacity={0.7} onPress={onNavigateToSales}>
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.secondaryLight }]}>
              <MaterialIcons name="point-of-sale" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.actionTileTitle}>
              {language === 'hi' ? 'Sell / बेचें' : 'Sales History'}
            </Text>
            <Text style={styles.actionTileSub}>{sales.length} Invoices</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile} activeOpacity={0.7} onPress={onNavigateToPurchase}>
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.primaryLight }]}>
              <MaterialIcons name="shopping-bag" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionTileTitle}>
              {language === 'hi' ? 'Buy Stock / खरीदें' : 'Purchases'}
            </Text>
            <Text style={styles.actionTileSub}>Suppliers dues</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile} activeOpacity={0.7} onPress={onNavigateToStock}>
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.successBg }]}>
              <MaterialIcons name="inventory-2" size={24} color={theme.colors.success} />
            </View>
            <Text style={styles.actionTileTitle}>
              {language === 'hi' ? 'My Stock / सामान' : 'Inventory'}
            </Text>
            <Text style={styles.actionTileSub}>{lowStockCount} need reorder</Text>
          </TouchableOpacity>
        </View>

        {/* 📷 AI Inventory Scan Quick Launch Card */}
        <TouchableOpacity style={styles.scanLaunchCard} activeOpacity={0.85} onPress={onNavigateToStock}>
          <View style={styles.scanLaunchLeft}>
            <View style={styles.scanLaunchIconCircle}>
              <MaterialIcons name="photo-camera" size={24} color="#C69A43" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.scanBadgeRow}>
                <Text style={styles.scanLaunchTitle}>📷 Scan Inventory (AI Camera)</Text>
                <View style={styles.aiPill}>
                  <Text style={styles.aiPillText}>AI LENS</Text>
                </View>
              </View>
              <Text style={styles.scanLaunchSub}>
                Photo detect FMCG items · Counts stock & auto-updates
              </Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={22} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Attendance Banner */}
        <TouchableOpacity style={styles.attendanceBanner} activeOpacity={0.8} onPress={onNavigateToAttendance}>
          <View style={styles.attendanceLeft}>
            <View style={styles.attendanceIconCircle}>
              <MaterialIcons name="badge" size={22} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.attendanceTitle}>
                {language === 'hi' ? 'स्टाफ हाजिरी (Staff Attendance)' : 'Staff Attendance & Geotag'}
              </Text>
              <Text style={styles.attendanceSubtitle}>
                {presentCount} Present · {absentCount} Absent · Pune Mandi Muster
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Section: Recent Shop Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'हाल की गतिविधि (Recent Activity)' : 'Recent Shop Activity'}
          </Text>
          <TouchableOpacity onPress={onNavigateToSales}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {sales.slice(0, 4).map((sale) => (
            <TouchableOpacity
              key={sale.id}
              style={styles.activityItem}
              activeOpacity={0.7}
              onPress={onNavigateToSales}
            >
              <View style={styles.activityLeft}>
                <View
                  style={[
                    styles.activityIcon,
                    {
                      backgroundColor:
                        sale.paymentMode === 'upi'
                          ? theme.colors.secondaryLight
                          : sale.paymentMode === 'cash'
                          ? theme.colors.successBg
                          : theme.colors.errorBg,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={
                      sale.paymentMode === 'upi'
                        ? 'qr-code-scanner'
                        : sale.paymentMode === 'cash'
                        ? 'payments'
                        : 'schedule'
                    }
                    size={20}
                    color={
                      sale.paymentMode === 'upi'
                        ? theme.colors.secondary
                        : sale.paymentMode === 'cash'
                        ? theme.colors.success
                        : theme.colors.error
                    }
                  />
                </View>
                <View>
                  <Text style={styles.activityTitle}>{sale.customerName}</Text>
                  <Text style={styles.activitySub}>
                    #{sale.invoiceNumber} · {sale.paymentMode.toUpperCase()} · {sale.timeAgo}
                  </Text>
                </View>
              </View>
              <View style={styles.activityRight}>
                <Text style={styles.activityAmount}>₹{sale.total.toLocaleString('en-IN')}</Text>
                <View
                  style={[
                    styles.activityBadge,
                    {
                      backgroundColor:
                        sale.paymentMode === 'udhaar' ? theme.colors.errorBg : theme.colors.successBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.activityBadgeText,
                      {
                        color:
                          sale.paymentMode === 'udhaar' ? theme.colors.error : theme.colors.success,
                      },
                    ]}
                  >
                    {sale.paymentMode === 'udhaar' ? 'Udhaar' : 'Paid'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
  heroCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.md,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  shopOpenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  shopOpenText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cloudSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cloudSyncText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.secondary,
  },

  syncBanner: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: theme.colors.success,
  },
  syncBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  syncBannerMuted: {
    color: theme.colors.textMuted,
    fontWeight: '400',
  },
  syncBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncBannerRightText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },

  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  kpiCard: {
    width: '47.5%',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  kpiCardHighlight: {
    borderColor: theme.colors.borderGold,
    backgroundColor: '#FFFCF7',
  },
  kpiCardWarning: {
    borderColor: 'rgba(183, 129, 3, 0.3)',
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
    flex: 1,
    marginRight: 4,
  },
  kpiIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  kpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  kpiFooterText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  makeBillButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  makeBillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  makeBillBoltCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeBillTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  makeBillSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },

  actionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionTile: {
    flex: 1,
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTileTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  actionTileSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  attendanceBanner: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  attendanceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  attendanceSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  scanLaunchCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#C69A43',
    marginBottom: theme.spacing.md,
    shadowColor: '#102B4E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  scanLaunchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  scanLaunchIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#102B4E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanLaunchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102B4E',
  },
  aiPill: {
    backgroundColor: '#C69A43',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFF',
  },
  scanLaunchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  activityList: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  activitySub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  activityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
