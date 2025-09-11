import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from "../views/screens/HomeScreen";
import { UserProfileScreen } from "../views/screens/UserProfileScreen";
import { ServicesScreen } from "../views/screens/ServicesScreen";
import { FlexAlignType, StyleSheet, View } from "react-native";
import { AppParamList, HomeStackParamList, ProfileStackParamList, ServicesStackParamList } from "./navigation.types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditProfileScreen } from "../views/screens/UserProfile/EditProfileScreen";
import { ChangeEmailAddressScreen } from "../views/screens/UserProfile/ChangeEmailAddressScreen";
import { ChangePasswordScreen } from "../views/screens/UserProfile/ChangePasswordScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator<AppParamList>()
const Home = createNativeStackNavigator<HomeStackParamList>()
const Services = createNativeStackNavigator<ServicesStackParamList>()
const Profile = createNativeStackNavigator<ProfileStackParamList>()

const HomeNavigator = () => {
  return (
    <Home.Navigator screenOptions={{ headerShown: false }}>
      <Home.Screen name="Home" component={HomeScreen}/>
    </Home.Navigator>
  )
}

const ServicesNavigator = () => {
  return (
    <Services.Navigator screenOptions={{ headerShown: false }}>
      <Services.Screen name="Services" component={ServicesScreen}/>
    </Services.Navigator>
  )
}

const ProfileNavigator = () => {
  return (
    <Profile.Navigator screenOptions={{ headerShown: false }}>
      <Profile.Screen name="ProfileHome" component={UserProfileScreen}/>
      <Profile.Screen name="EditProfile" component={EditProfileScreen}/>
      <Profile.Screen name="ChangeEmail" component={ChangeEmailAddressScreen}/>
      <Profile.Screen name="ChangePassword" component={ChangePasswordScreen}/>
    </Profile.Navigator>
  )
}

const AppTabNavigator = () => (
  <Tab.Navigator 
    //screenOptions={{headerShown: false}}
    //tabBar={(props) => <TabBarCustom {...props}/>}
    screenOptions = {({ route }) => {
      const alignMap = {
        HomeTab: "flex-start",
        ProfileTab: "center",
        ServicesTab: "flex-end",
      }
      const align = alignMap[route.name as keyof typeof alignMap] ?? "center"

      return {
        headerShown: false,
        tabBarActiveTintColor: '#0D47A1',
        tabBarInactiveTintColor: '#ffffff',
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: {
          paddingTop: 16,
          paddingHorizontal: 15,
          alignItems: align as FlexAlignType
        },
        tabBarIcon: ({ focused, color }) => {
          const map: Record<string, [string, string]> = {
            HomeTab: ["home-outline", "home"],
            ProfileTab: ["person-outline", "person"],
            ServicesTab: ["bar-chart-outline", "bar-chart"],
          }
          const [inactive, active] = map[route.name] ?? [
            "help-circle-outline",
            "help-circle",
          ]
          const name = focused ? active : inactive;
  
          return (
            <View
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: focused ? '#ffffff': '',
                borderRadius: 60,
              }}
            >
              <Ionicons name={name} size={focused ? 36 : 32} color={color} />
            </View>
          )
        },
      }
    }}
  >
    <Tab.Screen name="HomeTab" component={HomeNavigator} />
    <Tab.Screen 
      name="ProfileTab"
      component={ProfileNavigator}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? ""
        const hideOnRoutes = ["EditProfile"]
        return {
          tabBarStyle: hideOnRoutes.includes(routeName)
            ? { display: "none" }
            : styles.tabBar
        } 
      }} 
    />
    <Tab.Screen name="ServicesTab" component={ServicesNavigator} />
  </Tab.Navigator>
)

export default AppTabNavigator

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    marginHorizontal: 80,
    height: 70,
    borderRadius: 35,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopWidth: 0,
    backgroundColor: '#0D47A1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8  
  }
})