export interface PushDeviceRegistration {
  id: string;
  deviceId: string;
  platform: 'ANDROID' | 'IOS';
  isActive: boolean;
  lastSeenAt: string;
  updatedAt: string;
}

export interface PushDeviceDeactivation {
  deactivated: boolean;
}
