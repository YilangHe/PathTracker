'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Train, Clock, Car, Navigation, Info, Bus, Ship, Accessibility } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StationCard } from '@/components/StationCard';
import { StationDetails } from '@/data/station-details';
import { STATIONS } from '@/constants/stations';
import { useMultiStationData } from '@/hooks/useMultiStationData';
import { StationCode } from '@/types/path';

interface StationPageClientProps {
  stationId: string;
  stationDetails: StationDetails;
  locale: string;
}

export default function StationPageClient({ stationId, stationDetails, locale }: StationPageClientProps) {
  const t = useTranslations();
  const stationName = STATIONS[stationId as keyof typeof STATIONS];
  
  // Use the existing hook to get real-time data for this station
  const stationCodes = useMemo(() => [stationId as StationCode], [stationId]);
  const { stationData } = useMultiStationData(stationCodes);
  const currentStationData = stationData[stationId as StationCode];

  const getAttractionIcon = (type: string) => {
    switch (type) {
      case 'landmark': return '🏛️';
      case 'shopping': return '🛍️';
      case 'dining': return '🍽️';
      case 'park': return '🌳';
      case 'entertainment': return '🎭';
      default: return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{stationName} PATH Station</h1>
          <p className="text-muted-foreground text-lg">{stationDetails.description}</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{stationDetails.address}</span>
          </div>
        </div>

        {/* Live Arrivals */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Train className="h-6 w-6" />
            {t('station.liveArrivals')}
          </h2>
          <StationCard
            stationCode={stationId as StationCode}
            data={currentStationData?.data || null}
            loading={currentStationData?.loading || false}
            error={currentStationData?.error || null}
            hasCachedData={currentStationData?.hasCachedData}
          />
        </div>

        {/* Station Information Tabs */}
        <Tabs defaultValue="connections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="connections">{t('station.connections')}</TabsTrigger>
            <TabsTrigger value="nearby">{t('station.nearby')}</TabsTrigger>
            <TabsTrigger value="travel">{t('station.travelTimes')}</TabsTrigger>
            <TabsTrigger value="amenities">{t('station.amenities')}</TabsTrigger>
          </TabsList>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  {t('station.transportConnections')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stationDetails.connections.subway && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Train className="h-4 w-4" />
                      {t('station.subway')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stationDetails.connections.subway.map((line) => (
                        <Badge key={line} variant="secondary" className="text-sm">
                          {line}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stationDetails.connections.bus && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      {t('station.busRoutes')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stationDetails.connections.bus.map((route) => (
                        <Badge key={route} variant="outline" className="text-sm">
                          {route}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {stationDetails.connections.njTransit && (
                  <div>
                    <h4 className="font-semibold mb-2">NJ Transit Rail</h4>
                    <ul className="space-y-1">
                      {stationDetails.connections.njTransit.map((line) => (
                        <li key={line} className="text-sm">• {line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {stationDetails.connections.ferry && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Ship className="h-4 w-4" />
                      {t('station.ferryServices')}
                    </h4>
                    <ul className="space-y-1">
                      {stationDetails.connections.ferry.map((service) => (
                        <li key={service} className="text-sm">• {service}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {stationDetails.connections.lightRail && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('station.lightRail')}</h4>
                    <ul className="space-y-1">
                      {stationDetails.connections.lightRail.map((line) => (
                        <li key={line} className="text-sm">• {line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nearby Tab */}
          <TabsContent value="nearby">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t('station.nearbyAttractions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {stationDetails.nearbyAttractions.map((attraction) => (
                    <div key={attraction.name} className="flex items-start gap-3 p-3 rounded-lg border">
                      <span className="text-2xl">{getAttractionIcon(attraction.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium">{attraction.name}</p>
                        <p className="text-sm text-muted-foreground">{attraction.distance}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {stationDetails.parking && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {t('station.parking')}
                    </h4>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm">
                        {stationDetails.parking.available ? '✅ ' : '❌ '}
                        {stationDetails.parking.available 
                          ? t('station.parkingAvailable')
                          : t('station.noParking')}
                      </p>
                      {stationDetails.parking.spaces && (
                        <p className="text-sm mt-1">
                          {t('station.parkingSpaces', { count: stationDetails.parking.spaces })}
                        </p>
                      )}
                      {stationDetails.parking.details && (
                        <p className="text-sm mt-1 text-muted-foreground">
                          {stationDetails.parking.details}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Times Tab */}
          <TabsContent value="travel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('station.travelTimes')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {stationDetails.travelTimes.map((route) => (
                    <div key={route.destination} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">{route.destination}</span>
                      <Badge variant="secondary">
                        {route.minutes} {t('time.minutes')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t('station.stationAmenities')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Accessibility className="h-4 w-4" />
                    {t('station.accessibility')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {stationDetails.accessibility.wheelchairAccessible ? '✅' : '❌'}
                      <span className="text-sm">
                        {t('station.wheelchairAccessible')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {stationDetails.accessibility.elevators ? '✅' : '❌'}
                      <span className="text-sm">{t('station.elevators')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {stationDetails.accessibility.escalators ? '✅' : '❌'}
                      <span className="text-sm">{t('station.escalators')}</span>
                    </div>
                  </div>
                </div>

                {stationDetails.amenities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t('station.facilities')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {stationDetails.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}