import { ReactNode } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AccessibleButton } from '../AccessibleButton';
import { EnhancedTooltip } from '../TooltipProvider';

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  /** Whether this section is required */
  required?: boolean;
  /** Whether this section should be collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
}

export interface GenericFormProps {
  /** Form title */
  title: string;
  /** Form description */
  description?: string;
  /** Form sections */
  sections: FormSection[];
  /** Submit handler */
  onSubmit: () => void | Promise<void>;
  /** Cancel handler */
  onCancel: () => void;
  /** Whether form is submitting */
  isSubmitting?: boolean;
  /** Whether form is valid */
  isValid?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Whether to show as card */
  asCard?: boolean;
  /** Custom actions */
  actions?: ReactNode;
}

/**
 * Generic form component with consistent styling and behavior
 * Provides responsive layout and accessibility features
 */
export const GenericForm = ({
  title,
  description,
  sections,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isValid = true,
  submitText = 'Sauvegarder',
  cancelText = 'Annuler',
  asCard = true,
  actions,
}: GenericFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit();
  };

  const formContent = (
    <>
      {/* Form Header */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Form Sections */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {sections.map((section, index) => (
          <Box key={section.id} sx={{ mb: 3 }}>
            {/* Section Header */}
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {section.title}
              {section.required && (
                <Typography 
                  component="span" 
                  color="error.main"
                  sx={{ ml: 0.5 }}
                >
                  *
                </Typography>
              )}
            </Typography>
            
            {section.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {section.description}
              </Typography>
            )}

            {/* Section Content */}
            <Box sx={{ mb: 2 }}>
              {section.children}
            </Box>

            {/* Divider between sections */}
            {index < sections.length - 1 && (
              <Divider sx={{ mt: 3 }} />
            )}
          </Box>
        ))}

        {/* Form Actions */}
        <Box 
          sx={{ 
            mt: 4,
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'flex-end',
          }}
        >
          {actions}
          
          <EnhancedTooltip title="Annuler les modifications" shortcut="Esc">
            <AccessibleButton
              size={isMobile ? "large" : "medium"}
              onClick={onCancel}
              disabled={isSubmitting}
              sx={{ 
                order: { xs: 2, sm: 1 },
                minWidth: { xs: 'auto', sm: '120px' }
              }}
            >
              {cancelText}
            </AccessibleButton>
          </EnhancedTooltip>

          <EnhancedTooltip title="Sauvegarder le formulaire" shortcut="Ctrl+S">
            <AccessibleButton
              type="submit"
              variant="contained"
              size={isMobile ? "large" : "medium"}
              disabled={!isValid || isSubmitting}
              sx={{ 
                order: { xs: 1, sm: 2 },
                minWidth: { xs: 'auto', sm: '120px' }
              }}
            >
              {isSubmitting ? 'Sauvegarde...' : submitText}
            </AccessibleButton>
          </EnhancedTooltip>
        </Box>
      </Box>
    </>
  );

  if (!asCard) {
    return (
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        maxWidth: { xs: '100%', md: '800px' },
        mx: 'auto',
      }}>
        {formContent}
      </Box>
    );
  }

  return (
    <Card sx={{ 
      maxWidth: { xs: '100%', md: '800px' },
      mx: 'auto',
      mt: { xs: 1, sm: 2 },
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {formContent}
      </CardContent>
    </Card>
  );
};