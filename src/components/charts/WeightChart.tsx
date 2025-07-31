import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { WeightRecord } from '../../models/types';
import { formatDate } from '../../utils/dates';

interface WeightChartProps {
  weights: WeightRecord[];
  title?: string;
}

export const WeightChart: React.FC<WeightChartProps> = ({ weights, title = "Évolution du poids" }) => {
  if (weights.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aucune donnée de poids disponible
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Sort weights by date and prepare data for the chart
  const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const chartData = sortedWeights.map((weight, index) => ({
    date: weight.date,
    weight: weight.weightGrams,
    formattedDate: formatDate(weight.date, 'dd/MM'),
    fullDate: formatDate(weight.date),
    dayIndex: index,
  }));

  // Calculate weight gain
  const firstWeight = chartData[0]?.weight || 0;
  const lastWeight = chartData[chartData.length - 1]?.weight || 0;
  const totalGain = lastWeight - firstWeight;
  const gainPercentage = firstWeight > 0 ? ((totalGain / firstWeight) * 100).toFixed(1) : '0.0';

  // Calculate average daily gain if we have at least 2 points
  let avgDailyGain = 0;
  if (chartData.length >= 2) {
    const firstDate = new Date(chartData[0].date);
    const lastDate = new Date(chartData[chartData.length - 1].date);
    const daysDiff = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    avgDailyGain = daysDiff > 0 ? totalGain / daysDiff : 0;
  }

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        fullDate: string;
        weight: number;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="body2" fontWeight="medium">
            {data.fullDate}
          </Typography>
          <Typography variant="body2" color="primary">
            Poids: {data.weight}g
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
          {title}
        </Typography>
        
        {/* Statistics */}
        <Box sx={{ mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Poids actuel
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {lastWeight}g
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Gain total
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight="medium"
              color={totalGain >= 0 ? 'success.main' : 'error.main'}
            >
              {totalGain > 0 ? '+' : ''}{totalGain}g ({gainPercentage}%)
            </Typography>
          </Box>
          {avgDailyGain !== 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Gain moyen/jour
              </Typography>
              <Typography 
                variant="body2" 
                fontWeight="medium"
                color={avgDailyGain >= 0 ? 'success.main' : 'error.main'}
              >
                {avgDailyGain > 0 ? '+' : ''}{avgDailyGain.toFixed(1)}g
              </Typography>
            </Box>
          )}
        </Box>

        {/* Chart */}
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={5}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={5}
                label={{ value: 'Poids (g)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#1976d2" 
                strokeWidth={2}
                dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
              />
              {/* Add reference line for starting weight */}
              {chartData.length > 1 && (
                <ReferenceLine 
                  y={firstWeight} 
                  stroke="#666" 
                  strokeDasharray="2 2" 
                  label={{ value: "Poids initial" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};