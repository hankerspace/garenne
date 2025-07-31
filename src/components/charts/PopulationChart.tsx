import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useAppStore } from '../../state/store';
import { getKPIs } from '../../state/selectors';
import { Status } from '../../models/types';

const COLORS = {
  male: '#1976d2',
  female: '#e91e63',
  reproducer: '#4caf50',
  grow: '#ff9800',
  retired: '#9c27b0',
  deceased: '#f44336',
};

export const PopulationChart: React.FC = () => {
  const state = useAppStore();
  const kpis = getKPIs(state);
  const liveAnimals = state.animals.filter(a => a.status !== Status.Deceased);

  // Gender distribution data
  const genderData = [
    { name: 'Mâles', value: kpis.malesCount, color: COLORS.male },
    { name: 'Femelles', value: kpis.femalesCount, color: COLORS.female },
  ];

  // Status distribution data
  const statusData = [
    { 
      name: 'Reproducteurs', 
      value: liveAnimals.filter(a => a.status === Status.Reproducer).length, 
      color: COLORS.reproducer 
    },
    { 
      name: 'Croissance', 
      value: liveAnimals.filter(a => a.status === Status.Grow).length, 
      color: COLORS.grow 
    },
    { 
      name: 'Retraités', 
      value: liveAnimals.filter(a => a.status === Status.Retired).length, 
      color: COLORS.retired 
    },
  ].filter(item => item.value > 0);

  // Monthly births data (last 6 months)
  const monthlyBirths = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
    // Create a date for the first day of the target month
    const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    
    const birthsInMonth = liveAnimals.filter(animal => {
      if (!animal.birthDate) return false;
      const birthDate = new Date(animal.birthDate);
      return birthDate >= monthStart && birthDate <= monthEnd;
    }).length;

    monthlyBirths.push({
      month: targetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      births: birthsInMonth,
    });
  }

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
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
            {data.name}: {data.value}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      {/* Gender Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Répartition par sexe
            </Typography>
            {kpis.liveAnimalsCount === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucun animal enregistré
              </Typography>
            ) : (
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
              {genderData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: item.color, borderRadius: 1 }} />
                  <Typography variant="body2">
                    {item.name}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Status Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Répartition par statut
            </Typography>
            {statusData.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucun animal enregistré
              </Typography>
            ) : (
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              {statusData.map((item) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: item.color, borderRadius: 1 }} />
                  <Typography variant="body2">
                    {item.name}: {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Births */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Naissances par mois (6 derniers mois)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBirths} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    tickMargin={5}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickMargin={5}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    labelFormatter={(label) => `Mois: ${label}`}
                    formatter={(value) => [`${value} naissances`, 'Naissances']}
                  />
                  <Bar 
                    dataKey="births" 
                    fill={COLORS.grow}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};