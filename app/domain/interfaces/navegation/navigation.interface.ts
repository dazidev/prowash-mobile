import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PackageInfo } from '../service/service.interface';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerify: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type ServicesStackParamList = {
  Services: undefined;
  SelectHouse: { packageInfo: PackageInfo };
};

export type QuoteNavigationParams = {
  quoteId?: string;
  eventId?: string;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  ChangeEmail: undefined;
  ChangePassword: undefined;
  TermsConditions: undefined;
  ManageHouses: undefined;
  AddHouse: undefined;
  MembershipHome: QuoteNavigationParams | undefined;
  Quotes: QuoteNavigationParams | undefined;
};

export type AppParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
  ServicesTab: NavigatorScreenParams<ServicesStackParamList> | undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: NavigatorScreenParams<AppParamList> | undefined;
  EmailVerify: undefined;
};
