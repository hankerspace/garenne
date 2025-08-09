import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingIcon,
  Compare as CompareIcon,
  Warning as AlertIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useAppStore } from '../../state/store';
import { StatisticsService } from '../../services/statistics.service';
import { MetricsMonitoringService, RealTimeMetrics, PeriodComparison } from '../../services/metrics-monitoring.service';
import { AlertingService, AlertNotification } from '../../services/alerting.service';
import { 
  TrendAnalysisChart, 
  ComparisonChart, 
  MetricCard, 
  PerformanceHeatmap 
} from '../../components/charts/AdvancedMetricsChart';
import { PopulationChart } from '../../components/charts/PopulationChart';
import { useTranslation } from '../../hooks/useTranslation';
import { I18nService } from '../../services/i18n.service';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const AdvancedStatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { animals, litters, weights, treatments, cages } = useAppStore();
  const [currentTab, setCurrentTab] = useState(0);
  const [timePeriod, setTimePeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [comparisonPeriod, setComparisonPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [periodComparison, setPeriodComparison] = useState<PeriodComparison | null>(null);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const alertingService = useMemo(() => AlertingService.getInstance(), []);

  // Calculate basic statistics
  const stats = useMemo(() => {
    return StatisticsService.generatePerformanceReport(
      animals,
      litters,
      weights,
      treatments,
      cages
    );
  }, [animals, litters, weights, treatments, cages]);

  // Calculate benchmarks
  const benchmarks = useMemo(() => {
    return MetricsMonitoringService.calculateBenchmarks(animals, litters, weights, treatments);
  }, [animals, litters, weights, treatments]);

  // Load real-time metrics
  useEffect(() => {
    const loadRealTimeMetrics = () => {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        animals, litters, weights, treatments, cages
      );
      setRealTimeMetrics(metrics);
      setLastRefresh(new Date());
    };

    loadRealTimeMetrics();
    // Refresh every 5 minutes
    const interval = setInterval(loadRealTimeMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [animals, litters, weights, treatments, cages]);

  // Load period comparison
  useEffect(() => {
    const comparison = MetricsMonitoringService.generatePeriodComparison(
      animals, litters, weights, treatments, comparisonPeriod
    );
    setPeriodComparison(comparison);
  }, [animals, litters, weights, treatments, comparisonPeriod]);

  // Subscribe to alerts
  useEffect(() => {
    const unsubscribe = alertingService.subscribe(setAlerts);
    
    // Trigger initial check
    alertingService.triggerManualCheck(animals, litters, weights, treatments, cages);
    
    return unsubscribe;
  }, [alertingService, animals, litters, weights, treatments, cages]);

  // Generate trend data for charts
  const generateTrendData = (metricName: string) => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthAnimals = animals.filter(a => {
        const animalDate = new Date(a.birthDate || a.createdAt || now);
        return animalDate.getMonth() === date.getMonth() && 
               animalDate.getFullYear() === date.getFullYear();
      });
      
      const monthLitters = litters.filter(l => {
        const litterDate = new Date(l.kindlingDate);
        return litterDate.getMonth() === date.getMonth() && 
               litterDate.getFullYear() === date.getFullYear();
      });

      const monthWeights = weights.filter(w => {
        const weightDate = new Date(w.date);
        return weightDate.getMonth() === date.getMonth() && 
               weightDate.getFullYear() === date.getFullYear();
      });

      const monthTreatments = treatments.filter(t => {
        const treatmentDate = new Date(t.date);
        return treatmentDate.getMonth() === date.getMonth() && 
               treatmentDate.getFullYear() === date.getFullYear();
      });

      const monthStats = StatisticsService.generatePerformanceReport(
        monthAnimals, monthLitters, monthWeights, monthTreatments, []
      );

      let value = 0;
      switch (metricName) {
        case 'reproduction':
          value = monthStats.reproduction.reproductionRate;
          break;
        case 'survival':
          value = monthStats.reproduction.survivalRate;
          break;
        case 'weight':
          value = monthStats.overview.averageWeight;
          break;
        case 'treatments':
          value = monthStats.health.totalTreatments;
          break;
      }

      months.push({
        period: I18nService.formatDate(date, { month: 'short', year: '2-digit' }),
        value,
        target: metricName === 'reproduction' ? 8 : metricName === 'survival' ? 85 : undefined,
        benchmark: benchmarks[metricName]?.average || 0
      });
    }
    
    return months;
  };

  // Generate heatmap data
  const generateHeatmapData = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekLabel = `S${Math.ceil(weekStart.getDate() / 7)}`;
      
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart.getTime() + j * 24 * 60 * 60 * 1000);
        const dayTreatments = treatments.filter(t => {
          const treatmentDate = new Date(t.date);
          return treatmentDate.toDateString() === day.toDateString();
        }).length;

        weeks.push({
          week: weekLabel,
          day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][j],
          value: dayTreatments,
          metric: 'traitements'
        });
      }
    }
    
    return weeks;
  };

  const handleRefresh = () => {
    if (realTimeMetrics) {
      const metrics = MetricsMonitoringService.calculateRealTimeMetrics(
        animals, litters, weights, treatments, cages
      );
      setRealTimeMetrics(metrics);
      setLastRefresh(new Date());
    }
    
    // Trigger alert check
    alertingService.triggerManualCheck(animals, litters, weights, treatments, cages);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    alertingService.acknowledgeAlert(alertId);
  };

  const handleDismissAlert = (alertId: string) => {
    alertingService.dismissAlert(alertId);
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tableaux de bord avancés
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Dernière mise à jour: {I18nService.formatDate(lastRefresh, { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
          <Tooltip title="Actualiser les métriques">
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Active Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="warning" 
            icon={<AlertIcon />}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => setCurrentTab(3)}
              >
                Voir toutes
              </Button>
            }
          >
            <Typography variant="body2">
              {unacknowledgedAlerts.length} alerte(s) nécessitent votre attention
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Vue d'ensemble" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrendingIcon />} 
            label="Analyse des tendances" 
            iconPosition="start"
          />
          <Tab 
            icon={<CompareIcon />} 
            label="Comparaisons" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge badgeContent={unacknowledgedAlerts.length} color="error">
                <AlertIcon />
              </Badge>
            } 
            label="Alertes" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab 1: Vue d'ensemble */}
      <TabPanel value={currentTab} index={0}>
        {realTimeMetrics && (
          <Grid container spacing={3}>
            {/* Real-time Metrics Cards */}
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Total d'animaux"
                metricChange={realTimeMetrics.totalAnimals}
                icon={<AnalyticsIcon sx={{ fontSize: 40 }} />}
                benchmark={benchmarks.totalAnimals}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Taux de reproduction"
                metricChange={realTimeMetrics.reproductionRate}
                unit=""
                icon={<TrendingIcon sx={{ fontSize: 40 }} />}
                color="success.main"
                benchmark={benchmarks.reproductionRate}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Taux de survie"
                metricChange={realTimeMetrics.survivalRate}
                unit="%"
                icon={<DashboardIcon sx={{ fontSize: 40 }} />}
                color="info.main"
                benchmark={benchmarks.survivalRate}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Poids moyen"
                metricChange={realTimeMetrics.averageWeight}
                unit="kg"
                icon={<TrendingIcon sx={{ fontSize: 40 }} />}
                color="warning.main"
                benchmark={benchmarks.averageWeight}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Nombre de traitements"
                metricChange={realTimeMetrics.treatmentCount}
                icon={<AlertIcon sx={{ fontSize: 40 }} />}
                color="error.main"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Taux de consommation"
                metricChange={realTimeMetrics.consumptionRate}
                icon={<AnalyticsIcon sx={{ fontSize: 40 }} />}
                color="secondary.main"
              />
            </Grid>

            {/* Population Charts */}
            <Grid item xs={12}>
              <PopulationChart />
            </Grid>

            {/* Activity Heatmap */}
            <Grid item xs={12} md={6}>
              <PerformanceHeatmap
                data={generateHeatmapData()}
                title="Activité des traitements (8 dernières semaines)"
              />
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Tab 2: Analyse des tendances */}
      <TabPanel value={currentTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TrendAnalysisChart
              data={generateTrendData('reproduction')}
              title="Évolution du taux de reproduction"
              metricName="reproduction"
              targetValue={8}
              showBenchmark={true}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TrendAnalysisChart
              data={generateTrendData('survival')}
              title="Évolution du taux de survie"
              metricName="survival"
              unit="%"
              targetValue={85}
              showBenchmark={true}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TrendAnalysisChart
              data={generateTrendData('weight')}
              title="Évolution du poids moyen"
              metricName="weight"
              unit="kg"
              showBenchmark={true}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TrendAnalysisChart
              data={generateTrendData('treatments')}
              title="Évolution des traitements"
              metricName="treatments"
              showBenchmark={true}
            />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 3: Comparaisons */}
      <TabPanel value={currentTab} index={2}>
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Période de comparaison</InputLabel>
            <Select
              value={comparisonPeriod}
              label="Période de comparaison"
              onChange={(e) => setComparisonPeriod(e.target.value as any)}
            >
              <MenuItem value="month">Mois par mois</MenuItem>
              <MenuItem value="quarter">Trimestre par trimestre</MenuItem>
              <MenuItem value="year">Année par année</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {periodComparison && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ComparisonChart
                comparison={periodComparison}
                selectedMetrics={['totalAnimals', 'reproductionRate', 'survivalRate', 'averageWeight']}
              />
            </Grid>

            {/* Period Summary Cards */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {periodComparison.currentPeriod.label}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {Object.entries(periodComparison.metrics).map(([metric, change]) => (
                    <Box key={metric} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="body2">{metric}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {change.current.toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {periodComparison.previousPeriod.label}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {Object.entries(periodComparison.metrics).map(([metric, change]) => (
                    <Box key={metric} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="body2">{metric}:</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {change.previous.toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Tab 4: Alertes */}
      <TabPanel value={currentTab} index={3}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Alertes proactives ({alerts.length})
          </Typography>
          <Button
            variant="outlined"
            onClick={() => alertingService.dismissAllAlerts()}
            disabled={alerts.length === 0}
          >
            Supprimer toutes
          </Button>
        </Box>

        <Grid container spacing={2}>
          {alerts.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AlertIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Aucune alerte active
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Votre élevage fonctionne dans les paramètres normaux.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            alerts.map((alert) => (
              <Grid item xs={12} key={alert.id}>
                <Card 
                  sx={{ 
                    border: alert.severity === 'high' ? 2 : 1,
                    borderColor: alert.severity === 'high' ? 'error.main' : 
                                alert.severity === 'medium' ? 'warning.main' : 'info.main',
                    opacity: alert.acknowledged ? 0.7 : 1
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip 
                            label={alert.severity.toUpperCase()}
                            color={alert.severity === 'high' ? 'error' : 
                                  alert.severity === 'medium' ? 'warning' : 'info'}
                            size="small"
                          />
                          <Typography variant="h6">
                            {alert.title}
                          </Typography>
                          {alert.acknowledged && (
                            <Chip label="Accusé réception" size="small" variant="outlined" />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {alert.message}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary">
                          {I18nService.formatDate(alert.timestamp, { 
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>

                        {alert.actions && alert.actions.length > 0 && (
                          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="small"
                                variant="outlined"
                                color={action.color || 'primary'}
                                onClick={action.action}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {!alert.acknowledged && (
                          <Button
                            size="small"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Accusé réception
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDismissAlert(alert.id)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default AdvancedStatisticsPage;