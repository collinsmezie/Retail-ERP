import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'skeleton' | 'pulse';
  text?: string;
  fullHeight?: boolean;
  overlay?: boolean;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  variant = 'spinner', 
  text, 
  fullHeight = false,
  overlay = false 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60
  };

  const spinnerSize = sizeMap[size];

  if (variant === 'skeleton') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: fullHeight ? '100vh' : 'auto',
        p: 4
      }}>
        <Skeleton variant="circular" width={spinnerSize} height={spinnerSize} />
        {text && (
          <Skeleton variant="text" width={200} height={20} sx={{ mt: 2 }} />
        )}
      </Box>
    );
  }

  if (variant === 'dots') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: fullHeight ? '100vh' : 'auto',
        p: 4
      }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 1.4s ease-in-out infinite both',
                animationDelay: `${i * 0.16}s`,
                '@keyframes pulse': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0)',
                    opacity: 0.5,
                  },
                  '40%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
        {text && (
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'pulse') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: fullHeight ? '100vh' : 'auto',
        p: 4
      }}>
        <Box
          sx={{
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
        {text && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  // Default spinner variant
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: fullHeight ? '100vh' : 'auto',
      p: 4,
      position: overlay ? 'absolute' : 'relative',
      top: overlay ? 0 : 'auto',
      left: overlay ? 0 : 'auto',
      right: overlay ? 0 : 'auto',
      bottom: overlay ? 0 : 'auto',
      bgcolor: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      zIndex: overlay ? 1000 : 'auto'
    }}>
      <CircularProgress 
        size={spinnerSize} 
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {text && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {text}
        </Typography>
        )}
    </Box>
  );
}

// Specialized loading components for common use cases
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return <LoadingSpinner variant="spinner" size="large" text={text} fullHeight />;
}

export function TableLoader({ text = "Loading data..." }: { text?: string }) {
  return <LoadingSpinner variant="dots" size="medium" text={text} />;
}

export function FormLoader({ text = "Saving..." }: { text?: string }) {
  return <LoadingSpinner variant="pulse" size="small" text={text} />;
}

export function OverlayLoader({ text = "Processing..." }: { text?: string }) {
  return <LoadingSpinner variant="spinner" size="medium" text={text} overlay />;
} 