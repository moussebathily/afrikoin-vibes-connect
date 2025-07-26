import React from 'react';
import { useDeviceCompatibility } from '@/hooks/useDeviceCompatibility';
import { UniversalContainer } from './universal-container';
import { AdaptiveButton } from './adaptive-button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

export const CompatibilityShowcase: React.FC = () => {
  const { deviceInfo } = useDeviceCompatibility();

  const getDeviceStatusColor = () => {
    if (deviceInfo.isLowEndDevice) return 'destructive';
    if (deviceInfo.isSmallScreen) return 'secondary';
    if (deviceInfo.isLargeScreen) return 'default';
    return 'outline';
  };

  return (
    <UniversalContainer className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="responsive-text">
            Informations de Compatibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline">
              {deviceInfo.platform.toUpperCase()}
            </Badge>
            <Badge variant={getDeviceStatusColor()}>
              {deviceInfo.isTablet ? 'Tablette' : 'Téléphone'}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Modèle: {deviceInfo.model}</p>
            <p>OS: {deviceInfo.operatingSystem} {deviceInfo.osVersion}</p>
            <p>Résolution: {deviceInfo.pixelRatio}x DPR</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {deviceInfo.supportsTouchEvents && (
              <Badge variant="secondary">Tactile</Badge>
            )}
            {deviceInfo.supportsHover && (
              <Badge variant="secondary">Hover</Badge>
            )}
            {deviceInfo.hasNotch && (
              <Badge variant="secondary">Notch</Badge>
            )}
            {deviceInfo.isLowEndDevice && (
              <Badge variant="destructive">Performances limitées</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <AdaptiveButton variant="default" size="sm">
              Bouton Adaptatif
            </AdaptiveButton>
            <AdaptiveButton variant="outline" size="sm">
              Test Tactile
            </AdaptiveButton>
          </div>
        </CardContent>
      </Card>
    </UniversalContainer>
  );
};