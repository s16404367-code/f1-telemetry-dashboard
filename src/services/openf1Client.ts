import axios, { AxiosInstance } from 'axios';

const API_BASE = 'https://api.openf1.org/v1';

interface CacheEntry {
  data: any;
  timestamp: number;
}

class OpenF1Client {
  private client: AxiosInstance;
  private cache: Map<string, CacheEntry> = new Map();
  private cacheExpiry = 30000; // 30 seconds

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      }
    });
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramStr}`;
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async get(endpoint: string, params?: Record<string, any>): Promise<any> {
    try {
      const cacheKey = this.getCacheKey(endpoint, params);
      const cached = this.getFromCache(cacheKey);
      
      if (cached) {
        return cached;
      }

      const response = await this.client.get(endpoint, { params });
      const data = response.data || [];
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`OpenF1 API Error [${endpoint}]:`, error);
      return [];
    }
  }

  // Get all meetings for a year
  async getMeetings(year?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (year) params.year = year;
    return this.get('/meetings', params);
  }

  // Get sessions for a meeting
  async getSessions(meetingKey?: number, year?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (meetingKey) params.meeting_key = meetingKey;
    if (year) params.year = year;
    return this.get('/sessions', params);
  }

  // Get drivers for a session
  async getDrivers(sessionKey?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    return this.get('/drivers', params);
  }

  // Get location data (live or historical)
  async getLocation(sessionKey?: number, driverNumber?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    if (driverNumber) params.driver_number = driverNumber;
    return this.get('/location', params);
  }

  // Get interval data (gaps between drivers)
  async getIntervals(sessionKey?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    return this.get('/intervals', params);
  }

  // Get lap data
  async getLaps(sessionKey?: number, driverNumber?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    if (driverNumber) params.driver_number = driverNumber;
    return this.get('/laps', params);
  }

  // Get stint data (tyre information)
  async getStints(sessionKey?: number, driverNumber?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    if (driverNumber) params.driver_number = driverNumber;
    return this.get('/stints', params);
  }

  // Get weather data
  async getWeather(sessionKey?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    return this.get('/weather', params);
  }

  // Get car data (telemetry)
  async getCarData(sessionKey?: number, driverNumber?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    if (driverNumber) params.driver_number = driverNumber;
    return this.get('/car_data', params);
  }

  // Get pit data
  async getPitData(sessionKey?: number, driverNumber?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    if (driverNumber) params.driver_number = driverNumber;
    return this.get('/pit', params);
  }

  // Get race control messages
  async getRaceControl(sessionKey?: number): Promise<any[]> {
    const params: Record<string, any> = {};
    if (sessionKey) params.session_key = sessionKey;
    return this.get('/race_control', params);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export const openf1 = new OpenF1Client();
