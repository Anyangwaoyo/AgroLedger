import { BusinessProfile, RegistrationFormData } from '../types';

const STORAGE_ACTIVE_PROFILE_KEY = 'agroledger_active_business_profile_v3';
const STORAGE_PROFILES_KEY = 'agroledger_registered_profiles_v3';

export interface AuthResult {
  success: boolean;
  profile?: BusinessProfile;
  error?: string;
}

class AuthService {
  private currentProfile: BusinessProfile | null = null;
  private hasInitialized: boolean = false;

  private init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    try {
      const stored = window.localStorage.getItem(STORAGE_ACTIVE_PROFILE_KEY);
      if (stored) {
        this.currentProfile = JSON.parse(stored);
      }
    } catch {
      this.currentProfile = null;
    }
  }

  private getRegisteredProfiles(): BusinessProfile[] {
    try {
      const stored = window.localStorage.getItem(STORAGE_PROFILES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveRegisteredProfiles(profiles: BusinessProfile[]) {
    try {
      window.localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save registered profiles:', e);
    }
  }

  public getProfile(): BusinessProfile | null {
    this.init();
    return this.currentProfile;
  }

  public async checkSession(): Promise<BusinessProfile | null> {
    this.init();
    return this.currentProfile;
  }

  public async register(formData: RegistrationFormData): Promise<AuthResult> {
    this.init();

    const email = formData.email.trim().toLowerCase();
    const profiles = this.getRegisteredProfiles();

    // Check if account already exists with this email
    const existing = profiles.find(p => p.email.toLowerCase() === email);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    const newProfile: BusinessProfile = {
      id: 'biz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: formData.email.trim(),
      fullName: formData.fullName.trim(),
      businessName: formData.businessName.trim(),
      businessType: formData.businessType,
      mainGrain: formData.mainGrain,
      stateOfOperation: formData.stateOfOperation?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    this.saveRegisteredProfiles(profiles);

    this.currentProfile = newProfile;
    window.localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, JSON.stringify(newProfile));
    window.dispatchEvent(new Event('agroledger_auth_changed'));

    return {
      success: true,
      profile: newProfile,
    };
  }

  public async login(email: string, _password?: string): Promise<AuthResult> {
    this.init();

    const cleanEmail = email.trim().toLowerCase();
    const profiles = this.getRegisteredProfiles();

    const found = profiles.find(p => p.email.toLowerCase() === cleanEmail);
    if (!found) {
      // If user is logging in for the first time without prior registration, provide clear message
      return {
        success: false,
        error: 'No registered business found for this email. Please create an account first.',
      };
    }

    this.currentProfile = found;
    window.localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, JSON.stringify(found));
    window.dispatchEvent(new Event('agroledger_auth_changed'));

    return {
      success: true,
      profile: found,
    };
  }

  public async signOut(): Promise<void> {
    this.init();
    this.currentProfile = null;
    window.localStorage.removeItem(STORAGE_ACTIVE_PROFILE_KEY);
    window.dispatchEvent(new Event('agroledger_auth_changed'));
  }

  /**
   * Quick guest/demo mode profile for immediate exploration
   */
  public enterGuestDemo(profileData?: Partial<BusinessProfile>): BusinessProfile {
    const defaultProfile: BusinessProfile = {
      id: 'biz_demo_default',
      email: 'trader@agroledger.ng',
      fullName: 'Ibrahim Abubakar',
      businessName: 'Dawanau Grain Ventures',
      businessType: 'Grain Trader',
      mainGrain: 'Maize',
      stateOfOperation: 'Kano',
      createdAt: new Date().toISOString(),
      ...profileData,
    };

    this.currentProfile = defaultProfile;
    window.localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, JSON.stringify(defaultProfile));
    window.dispatchEvent(new Event('agroledger_auth_changed'));
    return defaultProfile;
  }
}

export const authService = new AuthService();
