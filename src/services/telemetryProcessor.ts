/**
 * Telemetry Processor - Safely processes OpenF1 API data
 * Handles undefined/null values and API inconsistencies
 */

export interface DriverTelemetry {
  driverNumber: number;
  firstName: string;
  lastName: string;
  teamName: string;
  teamColour: string;
  position: number;
  gapToLeader: number | null;
  gapToAhead: number | null;
  currentLapTime: number;
  bestLapTime: number;
  lastLapTime: number;
  lapNumber: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  rpm: number;
  tyreCompound: string;
  tyreAge: number;
  pitCount: number;
  drsEnabled: boolean;
  trackX: number;
  trackY: number;
}

export class TelemetryProcessor {
  /**
   * Process driver data from API
   */
  static processDriver(rawDriver: any): Partial<DriverTelemetry> {
    if (!rawDriver) return {};

    return {
      driverNumber: rawDriver.driver_number ?? 0,
      firstName: rawDriver.first_name ?? 'Unknown',
      lastName: rawDriver.last_name ?? 'Driver',
      teamName: rawDriver.team_name ?? 'Unknown Team',
      teamColour: this.sanitizeColor(rawDriver.team_colour),
      position: rawDriver.position ?? 0,
    };
  }

  /**
   * Process location data (track position)
   */
  static processLocation(rawLocation: any): Partial<DriverTelemetry> {
    if (!rawLocation) return {};

    return {
      trackX: this.normalizeCoordinate(rawLocation.x),
      trackY: this.normalizeCoordinate(rawLocation.y),
    };
  }

  /**
   * Process interval data (gaps)
   */
  static processInterval(rawInterval: any): Partial<DriverTelemetry> {
    if (!rawInterval) return {};

    return {
      gapToLeader: rawInterval.gap_to_leader ?? null,
      gapToAhead: rawInterval.interval ?? null,
    };
  }

  /**
   * Process lap data
   */
  static processLap(rawLap: any): Partial<DriverTelemetry> {
    if (!rawLap) return {};

    return {
      lapNumber: rawLap.lap_number ?? 0,
      currentLapTime: this.convertToSeconds(rawLap.lap_duration),
      lastLapTime: this.convertToSeconds(rawLap.lap_duration),
    };
  }

  /**
   * Process stint data (tyres)
   */
  static processStint(rawStint: any): Partial<DriverTelemetry> {
    if (!rawStint) return {};

    return {
      tyreCompound: rawStint.tyre_compound ?? 'UNKNOWN',
      tyreAge: rawStint.tyre_age_at_start ?? 0,
      pitCount: rawStint.stint_number ?? 0,
    };
  }

  /**
   * Process car data (telemetry)
   */
  static processCarData(rawCarData: any): Partial<DriverTelemetry> {
    if (!rawCarData) return {};

    return {
      speed: rawCarData.speed ?? 0,
      throttle: rawCarData.throttle ?? 0,
      brake: rawCarData.brake ?? 0,
      gear: rawCarData.n_gear ?? 0,
      rpm: rawCarData.rpm ?? 0,
      drsEnabled: (rawCarData.drs ?? 0) > 0,
    };
  }

  /**
   * Normalize coordinate to 0-100 range
   */
  private static normalizeCoordinate(value: any): number {
    const num = parseFloat(value);
    if (isNaN(num)) return 50; // Default center
    
    // Clamp to reasonable F1 track bounds
    if (num < -2000) return 0;
    if (num > 2000) return 100;
    
    // Map -2000 to 2000 range to 0-100
    return ((num + 2000) / 4000) * 100;
  }

  /**
   * Convert duration to seconds
   */
  private static convertToSeconds(duration: any): number {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;
    
    // Handle string format "MM:SS.mmm"
    if (typeof duration === 'string') {
      const parts = duration.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parseFloat(parts[1]) || 0;
        return minutes * 60 + seconds;
      }
    }
    
    return 0;
  }

  /**
   * Sanitize color hex value
   */
  private static sanitizeColor(color: any): string {
    if (!color) return '#DC0000'; // Default F1 red
    
    const str = String(color).trim();
    
    // Already has #
    if (str.startsWith('#')) {
      return str.length === 7 ? str : '#DC0000';
    }
    
    // Add # if missing
    if (str.length === 6) {
      return `#${str}`;
    }
    
    return '#DC0000';
  }

  /**
   * Merge multiple telemetry updates safely
   */
  static mergeTelemetry(
    current: Partial<DriverTelemetry>,
    update: Partial<DriverTelemetry>
  ): Partial<DriverTelemetry> {
    return {
      ...current,
      ...Object.entries(update).reduce((acc, [key, value]) => {
        // Only update if value is not undefined
        if (value !== undefined) {
          acc[key as keyof DriverTelemetry] = value;
        }
        return acc;
      }, {} as Partial<DriverTelemetry>)
    };
  }

  /**
   * Calculate best lap from lap array
   */
  static calculateBestLap(laps: any[]): number {
    if (!Array.isArray(laps) || laps.length === 0) return 0;

    let bestTime = Infinity;
    
    for (const lap of laps) {
      if (!lap || lap.is_pit_out_lap) continue;
      
      const duration = this.convertToSeconds(lap.lap_duration);
      if (duration > 0 && duration < bestTime) {
        bestTime = duration;
      }
    }
    
    return bestTime === Infinity ? 0 : bestTime;
  }

  /**
   * Calculate sector deltas
   */
  static calculateSectorDeltas(
    currentSectors: [number, number, number],
    bestSectors: [number, number, number]
  ): [number, number, number] {
    return [
      currentSectors[0] - bestSectors[0],
      currentSectors[1] - bestSectors[1],
      currentSectors[2] - bestSectors[2],
    ];
  }
}
