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

const StatisticsPage: React.FC = () => {
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
        Statistiques
      </Typography>

      {/* Overview Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        Vue d'ensemble
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Animaux"
            value={stats.overview.totalAnimals}
            subtitle="animaux enregistrés"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Animaux Actifs"
            value={stats.overview.activeAnimals}
            subtitle="vivants"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reproducteurs"
            value={stats.overview.reproductors}
            subtitle="en reproduction"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En Croissance"
            value={stats.overview.growing}
            subtitle="jeunes"
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Reproduction Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        Reproduction
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Portées"
            value={stats.reproduction.totalLitters}
            subtitle="portées enregistrées"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taille Moyenne"
            value={stats.reproduction.averageLitterSize.toFixed(1)}
            subtitle="lapereaux par portée"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Taux de Survie"
            value={`${stats.reproduction.survivalRate}%`}
            subtitle="sevrage réussi"
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Efficacité"
            value={stats.reproduction.reproductionRate.toFixed(1)}
            subtitle="portées/femelle/an"
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Consumption Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        Consommation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Consommés"
            value={stats.consumption.totalConsumed}
            subtitle="animaux"
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Poids Total"
            value={`${(stats.consumption.totalWeight / 1000).toFixed(1)} kg`}
            subtitle="viande produite"
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Poids Moyen"
            value={`${(stats.consumption.averageConsumptionWeight / 1000).toFixed(1)} kg`}
            subtitle="par animal"
            icon={<ConsumedIcon sx={{ fontSize: 40 }} />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Health Statistics */}
      <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
        Santé
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Traitements"
            value={stats.health.totalTreatments}
            subtitle="enregistrés"
            icon={<HealthIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Délais Actifs"
            value={stats.health.activeWithdrawals}
            subtitle="en cours"
            icon={<HealthIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Traitements Fréquents
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
        Autres Métriques
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Âge Moyen"
            value={stats.overview.averageAge}
            subtitle="jours"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Poids Moyen"
            value={`${(stats.overview.averageWeight / 1000).toFixed(1)} kg`}
            subtitle="animaux actifs"
            icon={<GrowthIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Occupation Cages"
            value={`${stats.overview.cageOccupancy}%`}
            subtitle="taux d'occupation"
            icon={<AnimalIcon sx={{ fontSize: 40 }} />}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Rapport généré le {new Date(stats.generatedAt).toLocaleString('fr-FR')}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatisticsPage;