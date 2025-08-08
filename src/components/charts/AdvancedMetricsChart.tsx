import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  ComposedChart,
  Bar
} from 'recharts';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Warning
} from '@mui/icons-material';
import { MetricChange, PeriodComparison } from '../../services/metrics-monitoring.service';
import { useTranslation } from '../../hooks/useTranslation';

interface TrendAnalysisChartProps {
  data: Array<{
    period: string;
    value: number;
    target?: number;
    benchmark?: number;
  }>;
  title: string;
  metricName: string;
  unit?: string;
  targetValue?: number;
  showBenchmark?: boolean;
  height?: number;
}

export const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({
  data,
  title,
  metricName,
  unit = '',
  targetValue,
  showBenchmark = false,
  height = 300
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const formatValue = (value: number) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'kg') return `${(value / 1000).toFixed(1)}kg`;
    return value.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value)}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Target line */}
              {targetValue && (
                <ReferenceLine 
                  y={targetValue} 
                  stroke={theme.palette.warning.main}
                  strokeDasharray="5 5"
                  label={{ value: `Objectif: ${formatValue(targetValue)}`, position: 'top' }}
                />
              )}
              
              {/* Main trend area */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                fill={`url(#gradient-${metricName})`}
                strokeWidth={2}
              />
              
              {/* Benchmark line */}
              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={false}
                />
              )}
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${metricName}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

interface ComparisonChartProps {
  comparison: PeriodComparison;
  selectedMetrics: string[];
  height?: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  comparison,
  selectedMetrics,
  height = 400
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartData = selectedMetrics.map(metric => {
    const metricData = comparison.metrics[metric];
    return {
      metric: metric,
      current: metricData.current,
      previous: metricData.previous,
      change: metricData.change,
      changePercent: metricData.percentageChange
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          bgcolor: 'background.paper',
          p: 1.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {comparison.currentPeriod.label}: {data.current.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {comparison.previousPeriod.label}: {data.previous.toFixed(1)}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: data.changePercent >= 0 ? 'success.main' : 'error.main',
              fontWeight: 'medium'
            }}
          >
            {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comparaison des périodes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip 
            label={comparison.currentPeriod.label}
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" sx={{ alignSelf: 'center' }}>vs</Typography>
          <Chip 
            label={comparison.previousPeriod.label}
            color="default"
            variant="outlined"
          />
        </Box>
        <Box sx={{ height, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
              />
              <YAxis 
                type="category"
                dataKey="metric"
                tick={{ fontSize: 12 }}
                stroke={theme.palette.text.secondary}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Bar 
                dataKey="previous" 
                fill={theme.palette.grey[400]}
                name={comparison.previousPeriod.label}
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="current" 
                fill={theme.palette.primary.main}
                name={comparison.currentPeriod.label}
                radius={[0, 4, 4, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  metricChange: MetricChange;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  benchmark?: {
    current: number;
    best: number;
    average: number;
    percentile: number;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metricChange,
  unit = '',
  icon,
  color = 'primary.main',
  benchmark
}) => {
  const theme = useTheme();

  const formatValue = (value: number) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'kg') return `${(value / 1000).toFixed(1)}kg`;
    return value.toFixed(1);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      default:
        return <TrendingFlat sx={{ color: 'text.secondary' }} />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'stable') return 'text.secondary';
    return change > 0 ? 'success.main' : 'error.main';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
              {formatValue(metricChange.current)}
            </Typography>
            
            {/* Period comparison */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: benchmark ? 1 : 0 }}>
              {getTrendIcon(metricChange.trend)}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: getTrendColor(metricChange.trend, metricChange.change),
                  fontWeight: 'medium'
                }}
              >
                {metricChange.percentageChange >= 0 ? '+' : ''}
                {metricChange.percentageChange.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs mois dernier
              </Typography>
            </Box>

            {/* Benchmark information */}
            {benchmark && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Meilleur: {formatValue(benchmark.best)} | 
                  Moyenne: {formatValue(benchmark.average)} | 
                  Percentile: {benchmark.percentile.toFixed(0)}%
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Icon */}
          {icon && (
            <Box sx={{ color, opacity: 0.7 }}>
              {icon}
            </Box>
          )}
        </Box>

        {/* Alert indicator */}
        {benchmark && benchmark.current < benchmark.average * 0.8 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mt: 1,
            p: 1,
            bgcolor: 'warning.light',
            borderRadius: 1
          }}>
            <Warning sx={{ fontSize: 16, color: 'warning.dark' }} />
            <Typography variant="caption" color="warning.dark">
              Performance inférieure à la moyenne
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

interface PerformanceHeatmapProps {
  data: Array<{
    week: string;
    day: string;
    value: number;
    metric: string;
  }>;
  title: string;
  height?: number;
}

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({
  data,
  title,
  height = 200
}) => {
  const theme = useTheme();

  const getIntensityColor = (value: number, max: number) => {
    const intensity = max > 0 ? value / max : 0;
    const alpha = Math.max(0.1, intensity);
    return `rgba(25, 118, 210, ${alpha})`;
  };

  const maxValue = Math.max(...data.map(d => d.value));
  const weeks = Array.from(new Set(data.map(d => d.week)));
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${weeks.length}, 1fr)`,
          gap: 1,
          mt: 2
        }}>
          {weeks.map(week => (
            <Box key={week}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {week}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateRows: `repeat(7, 1fr)`, gap: 0.5 }}>
                {days.map(day => {
                  const dayData = data.find(d => d.week === week && d.day === day);
                  const value = dayData?.value || 0;
                  return (
                    <Box
                      key={`${week}-${day}`}
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: getIntensityColor(value, maxValue),
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: theme.palette.primary.light,
                          borderColor: 'primary.main'
                        }
                      }}
                      title={`${day} ${week}: ${value} ${dayData?.metric || ''}`}
                    >
                      <Typography variant="caption" sx={{ fontSize: 8, color: 'white', fontWeight: 'bold' }}>
                        {value > 0 ? value : ''}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Moins
          </Typography>
          {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
            <Box
              key={intensity}
              sx={{
                width: 12,
                height: 12,
                bgcolor: `rgba(25, 118, 210, ${intensity})`,
                borderRadius: 0.5
              }}
            />
          ))}
          <Typography variant="caption" color="text.secondary">
            Plus
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};