import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { Header } from '../components/Header';

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
            <Text style={styles.heroPillText}>आज का दिन · Active Counter</Text>
          </View>
          <Text style={styles.heroTitle}>नमस्ते, Rajesh ji 🙏</Text>
          <Text style={styles.heroSubtitle}>Your shop summary for today. Quick & simple.</Text>

          <View style={styles.heroStatusRow}>
            <View style={styles.shopOpenBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.shopOpenText}>दुकान खुली है (Shop Open)</Text>
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
              Saved on device <Text style={styles.syncBannerMuted}>· 42 records synced</Text>
            </Text>
          </View>
          <View style={styles.syncBannerRight}>
            <MaterialIcons name="wifi" size={15} color={theme.colors.success} />
            <Text style={styles.cloudLiveText}>Cloud Live</Text>
          </View>
        </View>

        {/* Section: Daily KPI Grid (2x2) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Snapshot (आज की स्थिति)</Text>
          <Text style={styles.sectionSubtitle}>Updated just now</Text>
        </View>

        <View style={styles.kpiGrid}>
          {/* Card 1: Today's Total Sale */}
          <TouchableOpacity style={styles.kpiCard} activeOpacity={0.85} onPress={onNavigateToSales}>
            <View style={styles.kpiCardTop}>
              <Text style={styles.kpiLabel}>Today's Total Sale</Text>
              <View style={[styles.kpiIconBadge, { backgroundColor: theme.colors.secondaryLight }]}>
                <MaterialIcons name="payments" size={18} color={theme.colors.secondary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>₹38,450</Text>
            <View style={styles.kpiTrendBadge}>
              <Text style={styles.kpiTrendText}>+14% vs yesterday</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Money in Hand */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiCardTop}>
              <Text style={styles.kpiLabel}>Money In Hand</Text>
              <View style={[styles.kpiIconBadge, { backgroundColor: theme.colors.primaryLight }]}>
                <MaterialIcons name="account-balance-wallet" size={18} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={styles.kpiValue}>₹29,200</Text>
            <View style={styles.kpiSubRow}>
              <View style={[styles.smallDot, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.kpiSubText}>Cash & UPI received</Text>
            </View>
          </View>

          {/* Card 3: Udhaar to Collect */}
          <View style={[styles.kpiCard, styles.kpiCardAlert]}>
            <View style={styles.kpiCardTop}>
              <Text style={[styles.kpiLabel, { color: theme.colors.error }]}>Customer Udhaar</Text>
              <View style={[styles.kpiIconBadge, { backgroundColor: theme.colors.errorContainer }]}>
                <MaterialIcons name="pending-actions" size={18} color={theme.colors.error} />
              </View>
            </View>
            <Text style={[styles.kpiValue, { color: theme.colors.error }]}>₹14,800</Text>
            <View style={[styles.kpiTrendBadge, { backgroundColor: theme.colors.errorContainer }]}>
              <Text style={[styles.kpiTrendText, { color: theme.colors.error }]}>6 customers due</Text>
            </View>
          </View>

          {/* Card 4: Low Stock Alert */}
          <TouchableOpacity style={[styles.kpiCard, styles.kpiCardWarning]} activeOpacity={0.85} onPress={onNavigateToStock}>
            <View style={styles.kpiCardTop}>
              <Text style={styles.kpiLabel}>Low Stock Alert</Text>
              <View style={[styles.kpiIconBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
                <MaterialIcons name="warning" size={18} color={theme.colors.secondary} />
              </View>
            </View>
            <View style={styles.kpiStockRow}>
              <Text style={styles.kpiValue}>5</Text>
              <Text style={styles.kpiStockSub}>items low</Text>
            </View>
            <View style={[styles.kpiTrendBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Text style={[styles.kpiTrendText, { color: theme.colors.secondary }]}>Needs reorder</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions (तुरंत काम)</Text>
          <Text style={styles.sectionSubtitle}>1-Tap Easy Desk</Text>
        </View>

        {/* Hero Billing CTA Button */}
        <TouchableOpacity style={styles.makeBillButton} activeOpacity={0.85} onPress={onNavigateToBill}>
          <View style={styles.makeBillLeft}>
            <View style={styles.makeBillBoltCircle}>
              <MaterialIcons name="bolt" size={30} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.makeBillTitle}>⚡ Make Bill (बनाएं बिल)</Text>
              <Text style={styles.makeBillSubtitle}>Fast 1-minute billing · Barcode & Name search</Text>
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
            <Text style={styles.actionTileTitle}>Sell / बेचें</Text>
            <Text style={styles.actionTileSub}>Quick entry</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile} activeOpacity={0.7} onPress={onNavigateToPurchase}>
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.primaryLight }]}>
              <MaterialIcons name="shopping-bag" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionTileTitle}>Buy Stock / खरीदें</Text>
            <Text style={styles.actionTileSub}>Add supplier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile} activeOpacity={0.7} onPress={onNavigateToStock}>
            <View style={[styles.actionIconCircle, { backgroundColor: theme.colors.successBg }]}>
              <MaterialIcons name="inventory-2" size={24} color={theme.colors.success} />
            </View>
            <Text style={styles.actionTileTitle}>My Stock / सामान</Text>
            <Text style={styles.actionTileSub}>Check items</Text>
          </TouchableOpacity>
        </View>

        {/* Attendance Banner */}
        <TouchableOpacity style={styles.attendanceBanner} activeOpacity={0.8} onPress={onNavigateToAttendance}>
          <View style={styles.attendanceLeft}>
            <View style={styles.attendanceIconCircle}>
              <MaterialIcons name="badge" size={22} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.attendanceTitle}>Staff Attendance & Geotag</Text>
              <Text style={styles.attendanceSubtitle}>3 Present · 1 Absent · Pune Mandi Muster</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        {/* Section: Recent Shop Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Shop Activity (गतिविधि)</Text>
          <Text style={styles.viewAllText}>View All</Text>
        </View>

        <View style={styles.activityList}>
          {/* Item 1 */}
          <View style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.successBg }]}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
              </View>
              <View>
                <Text style={styles.activityTitle}>Pooja Store</Text>
                <Text style={styles.activitySub}>Bill Paid via UPI · 10m ago</Text>
              </View>
            </View>
            <View style={styles.activityRight}>
              <Text style={styles.activityAmount}>₹4,850</Text>
              <View style={[styles.activityBadge, { backgroundColor: theme.colors.successBg }]}>
                <Text style={[styles.activityBadgeText, { color: theme.colors.success }]}>Received</Text>
              </View>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.secondaryLight }]}>
                <MaterialIcons name="task-alt" size={20} color={theme.colors.secondary} />
              </View>
              <View>
                <Text style={styles.activityTitle}>Ramesh ji</Text>
                <Text style={styles.activitySub}>Udhaar Cleared (Cash) · 35m ago</Text>
              </View>
            </View>
            <View style={styles.activityRight}>
              <Text style={styles.activityAmount}>₹8,000</Text>
              <View style={[styles.activityBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={[styles.activityBadgeText, { color: theme.colors.secondary }]}>Full Cleared</Text>
              </View>
            </View>
          </View>

          {/* Item 3 */}
          <View style={styles.activityItem}>
            <View style={styles.activityLeft}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.primaryLight }]}>
                <MaterialIcons name="inventory" size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.activityTitle}>Tata Tea 500g</Text>
                <Text style={styles.activitySub}>24 packets added · 1h ago</Text>
              </View>
            </View>
            <View style={styles.activityRight}>
              <Text style={styles.activityAmount}>+24 packs</Text>
              <View style={[styles.activityBadge, { backgroundColor: theme.colors.surfaceContainerHigh }]}>
                <Text style={[styles.activityBadgeText, { color: theme.colors.textMuted }]}>Stock Added</Text>
              </View>
            </View>
          </View>
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
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  heroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  heroStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  shopOpenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  shopOpenText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  cloudSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
  },
  cloudSyncText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  syncBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  syncBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  syncBannerMuted: {
    fontWeight: '400',
    color: theme.colors.textMuted,
  },
  syncBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cloudLiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.secondaryAccent,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.secondaryAccent,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  kpiCard: {
    width: '48%',
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
  kpiCardAlert: {
    borderColor: theme.colors.errorContainer,
  },
  kpiCardWarning: {
    borderColor: theme.colors.secondaryContainer,
  },
  kpiCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    flex: 1,
  },
  kpiIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.3,
    marginBottom: theme.spacing.xs,
  },
  kpiStockRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  kpiStockSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  kpiTrendBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  kpiTrendText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.success,
  },
  kpiSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  kpiSubText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  makeBillButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: theme.colors.secondaryAccent,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  makeBillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
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
    fontSize: 11,
    color: theme.colors.primaryDim,
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  actionTile: {
    flex: 1,
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: 6,
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
    marginBottom: 6,
  },
  actionTileTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  actionTileSub: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  attendanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderGold,
    marginBottom: theme.spacing.lg,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  attendanceIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.secondaryLight,
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
    marginTop: 1,
  },
  activityList: {
    gap: theme.spacing.sm,
  },
  activityItem: {
    backgroundColor: theme.colors.surfaceWhite,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  activitySub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  activityBadge: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.borderRadius.full,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
