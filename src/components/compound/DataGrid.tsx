import { ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Grid,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ViewList as ListIcon,
  GridView as GridIcon,
} from '@mui/icons-material';

export interface DataGridColumn {
  key: string;
  label: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: any, item: any) => ReactNode;
}

export interface DataGridProps {
  data: any[];
  columns?: DataGridColumn[];
  loading?: boolean;
  empty?: ReactNode;
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  renderCard?: (item: any, index: number) => ReactNode;
  gridCols?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  title?: string;
  actions?: ReactNode;
}

/**
 * Reusable data grid with list/grid view toggle
 */
export const DataGrid = ({
  data,
  columns = [],
  loading = false,
  empty,
  viewMode = 'grid',
  onViewModeChange,
  renderCard,
  gridCols = { xs: 1, sm: 2, md: 3, lg: 4 },
  title,
  actions,
}: DataGridProps) => {
  const showViewToggle = onViewModeChange && renderCard && columns.length > 0;

  const renderLoading = () => {
    if (viewMode === 'grid') {
      return (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item key={index} {...gridCols}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  <Skeleton width="80%" />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderEmpty = () => {
    if (empty) return empty;
    
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Aucune donnée disponible
        </Typography>
        <Typography variant="body2">
          Les éléments que vous cherchez n'ont pas pu être trouvés.
        </Typography>
      </Box>
    );
  };

  const renderGridView = () => (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item key={item.id || index} {...gridCols}>
          {renderCard?.(item, index)}
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                style={{ width: col.width }}
                sortDirection={false}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id || index} hover>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Header */}
      {(title || actions || showViewToggle) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {actions}
            {showViewToggle && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Vue grille">
                  <IconButton
                    size="small"
                    onClick={() => onViewModeChange?.('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    aria-label="Vue grille"
                  >
                    <GridIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Vue liste">
                  <IconButton
                    size="small"
                    onClick={() => onViewModeChange?.('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    aria-label="Vue liste"
                  >
                    <ListIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Content */}
      {loading ? (
        renderLoading()
      ) : data.length === 0 ? (
        renderEmpty()
      ) : viewMode === 'grid' ? (
        renderGridView()
      ) : (
        renderListView()
      )}
    </Box>
  );
};