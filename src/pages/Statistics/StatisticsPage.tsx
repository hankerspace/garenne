import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Pets as AnimalIcon,
  TrendingUp as GrowthIcon,
  RestaurantMenu as ConsumedIcon,
  LocalHospital as HealthIcon,
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { StatisticsService } from '../../services/statistics.service';
import { useTranslation } from '../../hooks/useTranslation';
import { I18nService } from '../../services/i18n.service';

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { animals, litters, weights, treatments, cages } = useAppStore();

  const stats = useMemo(() => {
    return StatisticsService.generatePerformanceReport(
      animals,
      litters,
      weights,
      treatments,
      cages
    );
  }, [animals, litters, weights, treatments, cages]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, subtitle, icon, color = 'primary.main' }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('statisticsPage.title')}
      </Typography>

      {/* Overview Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        {t('statisticsPage.overview')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.totalAnimals')}
            value={stats.overview.totalAnimals}
            subtitle={t('statisticsPage.cards.totalAnimalsSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.activeAnimals')}
            value={stats.overview.activeAnimals}
            subtitle={t('statisticsPage.cards.activeAnimalsSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.reproductors')}
            value={stats.overview.reproductors}
            subtitle={t('statisticsPage.cards.reproductorsSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.growing')}
            value={stats.overview.growing}
            subtitle={t('statisticsPage.cards.growingSubtitle')}
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Reproduction Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        {t('statisticsPage.reproduction')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.totalLitters')}
            value={stats.reproduction.totalLitters}
            subtitle={t('statisticsPage.cards.totalLittersSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.averageSize')}
            value={stats.reproduction.averageLitterSize.toFixed(1)}
            subtitle={t('statisticsPage.cards.averageSizeSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.survivalRate')}
            value={`${stats.reproduction.survivalRate}%`}
            subtitle={t('statisticsPage.cards.survivalRateSubtitle')}
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('statisticsPage.cards.efficiency')}
            value={stats.reproduction.reproductionRate.toFixed(1)}
            subtitle={t('statisticsPage.cards.efficiencySubtitle')}
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Consumption Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        {t('statisticsPage.consumption')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.totalConsumed')}
            value={stats.consumption.totalConsumed}
            subtitle={t('statisticsPage.cards.totalConsumedSubtitle')}
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.totalWeight')}
            value={`${(stats.consumption.totalWeight / 1000).toFixed(1)} kg`}
            subtitle={t('statisticsPage.cards.totalWeightSubtitle')}
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.averageWeight')}
            value={`${(stats.consumption.averageConsumptionWeight / 1000).toFixed(1)} kg`}
            subtitle={t('statisticsPage.cards.averageWeightSubtitle')}
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Health Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        {t('statisticsPage.health')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.totalTreatments')}
            value={stats.health.totalTreatments}
            subtitle={t('statisticsPage.cards.totalTreatmentsSubtitle')}
            icon={<HealthIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.activeWithdrawals')}
            value={stats.health.activeWithdrawals}
            subtitle={t('statisticsPage.cards.activeWithdrawalsSubtitle')}
            icon={<HealthIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {t('statisticsPage.cards.commonTreatments')}
              </Typography>
              {stats.health.commonTreatments.slice(0, 3).map((treatment, index) => (
                <Box key={index}>
                  <Typography variant="body2">
                    {treatment.product}: {treatment.count}
                  </Typography>
                  {index < 2 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        {t('statisticsPage.otherMetrics')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.averageAge')}
            value={stats.overview.averageAge}
            subtitle={t('statisticsPage.cards.averageAgeSubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.averageAnimalWeight')}
            value={`${(stats.overview.averageWeight / 1000).toFixed(1)} kg`}
            subtitle={t('statisticsPage.cards.averageAnimalWeightSubtitle')}
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t('statisticsPage.cards.cageOccupancy')}
            value={`${stats.overview.cageOccupancy}%`}
            subtitle={t('statisticsPage.cards.cageOccupancySubtitle')}
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {t('statisticsPage.reportGenerated')} {I18nService.formatDate(new Date(stats.generatedAt), { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatisticsPage;